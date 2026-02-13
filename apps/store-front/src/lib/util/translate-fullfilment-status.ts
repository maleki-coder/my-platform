const fulfillmentStatusFa = {
  not_fulfilled: "تامین نشده",
  partially_fulfilled: "به‌صورت جزئی تامین شده",
  fulfilled: "در حال ارسال",
  partially_shipped: "به‌صورت جزئی ارسال شده",
  shipped: "ارسال شده",
  partially_delivered: "به‌صورت جزئی تحویل شده",
  delivered: "تحویل شده",
  canceled: "لغو شده",
} as const
type FulfillmentStatus =
  | "not_fulfilled"
  | "partially_fulfilled"
  | "fulfilled"
  | "partially_shipped"
  | "shipped"
  | "partially_delivered"
  | "delivered"
  | "canceled"

export function translateFulfillmentStatus(
  status: FulfillmentStatus
): string {
  return fulfillmentStatusFa[status] ?? "وضعیت نامشخص"
}
