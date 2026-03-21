import { OptionsProductSearchParams, ProductSearchParams } from "@lib/types"

export function extractOptionParams(
  queryParams: ProductSearchParams
): OptionsProductSearchParams {
  // System-level keys that should NEVER be treated as product options.
  // You can add more depending on your project.
  const RESERVED_KEYS = new Set([
    "min_price",
    "max_price",
    "in_stock",
    "id",
    "tag_id",
    "variants",
    "locale",
    "category_id",
    "page",
    "title",
    "type_id",
    "category_id",
    "updated_at",
    "deleted_at",
    "collection_id",
    "created_at",
    "handle",
    "external_id",
    "id",
    "is_giftcard",
    "limit",
    "offset",
    "fields",
    "expand",
    "order",
    "with_deleted",
    "q",
    "currency_code",
    "region_id",
  ])

  const optionParams: Record<string, string[]> = {}

  for (const [key, rawValue] of Object.entries(queryParams)) {
    if (RESERVED_KEYS.has(key) || rawValue === undefined || rawValue === null) {
      continue
    }

    // دور زدن محدودیت تایپ اسکریپت با Casting
    const value = rawValue as string | string[]
    let parsedValues: string[] = []

    if (typeof value === "string") {
      parsedValues = value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    } else if (Array.isArray(value)) {
      parsedValues = value
        .filter((v) => typeof v === "string")
        .map((v) => String(v).trim())
        .filter(Boolean)
    }

    if (parsedValues.length > 0) {
      optionParams[key] = parsedValues
    }
  }

  return optionParams as OptionsProductSearchParams
}
