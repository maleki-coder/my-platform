// src/api/store/hero-categories/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // ✅ Resolve the Product Module service (documented)
  const productModuleService = req.scope.resolve(Modules.PRODUCT);

  const metadataTag = req.query.metadataTag as string;
  const limit = parseInt(req.query.limit as string) || 100;

  // ✅ Use listProductCategories (documented method)
  const categories = await productModuleService.listProductCategories(
    {
      // Metadata filter syntax - handles both string and array values
      //@ts-ignore
      metadata: {
        tags: metadataTag,
      },
    },
    {
      select: ["description", "hanlde", "id", "name", "rank"],
      take: limit,
      order: { rank: "ASC" },
    }
  );
  const query = req.scope.resolve("query");

  const categoryIds = categories.map((c) => c.id);

  if (categoryIds.length === 0) {
    return res.json({ product_categories: [] });
  }
  const { data: categoryImages } = await query.graph({
    entity: "product_category_image",
    fields: ["*"],
    filters: {
      category_id: categoryIds,
    },
  });

  const imagesByCategory: Record<string, any[]> = {};

  for (const img of categoryImages) {
    if (!imagesByCategory[img.category_id]) {
      imagesByCategory[img.category_id] = [];
    }
    imagesByCategory[img.category_id].push(img);
  }

  const categoriesWithImages = categories.map((c) => ({
    ...c,
    product_category_image: imagesByCategory[c.id] || [],
  }));

  res.json({ product_categories: categoriesWithImages });
}
