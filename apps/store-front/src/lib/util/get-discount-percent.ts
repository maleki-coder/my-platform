import { HttpTypes } from "@medusajs/types"

export const getDiscountPercent = (
  item: HttpTypes.StoreCartLineItem
): number | null => {
  if (!item.subtotal || !item.discount_total) return null

  const percent = (item.discount_total / item.subtotal) * 100
  return percent > 0 ? percent : null
}
