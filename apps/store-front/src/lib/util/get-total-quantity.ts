export const getTotalQuantity = (items: { quantity: number }[] = []) => {
  return items.reduce((sum, item) => sum + (item.quantity || 0), 0)
}
