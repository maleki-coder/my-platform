// src/api/store/categories/[id]/options/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const categoryId = req.params.id as string

  if (!categoryId) {
    return res.status(400).json({ message: "category_id is required" })
  }

  // Resolve the Product Module Service (v2 way)
  const productModuleService: any = req.scope.resolve(Modules.PRODUCT)

  // Fetch ALL published products in the category (increase take if you have huge categories)
  const [products] = await productModuleService.listProducts(
    {
      categories: { id: categoryId },
      status: { $eq: "published" }, // only published products
    },
    {
      relations: ["options", "options.values"],
      take: 2000,           // adjust based on your catalog size
      skip: 0,
    }
  )

  // Aggregate unique options by title (so "Color" appears only once)
  const optionMap = new Map<string, any>()

  for (const product of products) {
    for (const option of product.options ?? []) {
      if (!optionMap.has(option.title)) {
        optionMap.set(option.title, {
          id: option.id,                    // representative option_id (first one we see)
          title: option.title,
          values: [] as Array<{ id: string; value: string }>,
        })
      }

      const existingOption = optionMap.get(option.title)!

      // Add unique values (by value string) with their option-value IDs
      for (const val of option.values ?? []) {
        if (!existingOption.values.some((v: any) => v.value === val.value)) {
          existingOption.values.push({
            id: val.id,      // ProductOptionValue id – useful if you ever need it
            value: val.value,
          })
        }
      }
    }
  }

  // Optional: sort values alphabetically
  for (const opt of optionMap.values()) {
    opt.values.sort((a: any, b: any) => a.value.localeCompare(b.value))
  }

  res.json({
    options: Array.from(optionMap.values()),
  })
}