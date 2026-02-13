import { HttpTypes } from "@medusajs/types"

export const isVariantDiscounted = (item: HttpTypes.StoreCartLineItem): boolean => {
  if (!item.subtotal || !item.discount_total) return false
  const percent = (item.discount_total / item.subtotal) * 100
  return percent > 0 ? true : false
}
