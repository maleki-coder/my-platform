// src/api/store/categories/[id]/options/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const categoryId = req.params.id;
  
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  try {
    const { data: categories } = await query.graph({
      entity: "product_category",
      fields: [
        "id",
        "products.id",
        "products.options.title",
        "products.options.values.value",
      ],
      filters: {
        id: [categoryId],
      },
    });

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    const categoryProducts = categories[0].products || [];

    const availableOptions: Record<string, Set<string>> = {};

    categoryProducts.forEach((product: any) => {
      if (product.options) {
        product.options.forEach((option: any) => {
          const title = option.title;
          if (!availableOptions[title]) {
            availableOptions[title] = new Set();
          }

          if (option.values) {
            option.values.forEach((val: any) => {
              availableOptions[title].add(val.value);
            });
          }
        });
      }
    });

    const formattedOptions = Object.keys(availableOptions).map((key) => ({
      title: key,
      values: Array.from(availableOptions[key]),
    }));

    return res.status(200).json({ options: formattedOptions });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch category options" });
  }
}
