import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query");
  const categoryId = req.query.category_id as string;
  const optionsParam = req.query.options as string;
  const limit = parseInt((req.query.limit as string) || "100");
  const offset = parseInt((req.query.offset as string) || "0");

  let filters: any = { status: "published" };

  if (categoryId) {
    filters.categories = { id: categoryId };
  }

  if (optionsParam) {
    const optionValues = optionsParam.split(",");
    filters.options = {
      values: {
        value: { $in: optionValues },
      },
    };
  }

  try {
    const { data: products, metadata } = await query.graph({
      entity: "product",
      fields: ["id"],
      filters,
      pagination: { skip: offset, take: limit },
    });

    const productIds = products.map((p: any) => p.id);

    res.json({
      product_ids: productIds,
      count: metadata?.count || productIds.length,
    });
  } catch (error) {
    console.error("Filter Graph Error:", error);
    res.status(500).json({ message: "Error fetching filtered IDs", error });
  }
}
