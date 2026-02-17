import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";

export default async function orderShippedHandler({
  event: {
    data: { id },
  },
  container,
}: SubscriberArgs<{ id }>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const notificationModule = container.resolve(Modules.NOTIFICATION);
  const { data: fulfillments } = await query.graph({
    entity: "fulfillment",
    filters: { id: id },
    fields: [
      "id",
      "order_id",
      "order.display_id",
      "order.shipping_address.phone",
      "order.billing_address.phone",
      "order.customer.phone",
      "labels.tracking_number",
      "labels.tracking_url",
      "labels.label_url",
      //   "shipping_option.*",
    ],
  });
  if (!fulfillments || fulfillments.length === 0) {
    console.log("No fulfillment found for ID:", id);
    return;
  }
  const fulfillment = fulfillments[0];
  const message = `Your order #${fulfillment.order?.display_id} has been shipped!\nTracking: || "N/A"}\nThank you for shopping with us!`;

  await notificationModule.createNotifications({
    to: fulfillment.order?.customer?.phone as string,
    channel: "sms",
    template: "shipment-created",
    data: {
      message: message,
      // You can pass order: order, ... and use it in future if you add logic in provider
    },
  });
}

export const config: SubscriberConfig = {
  event: "shipment.created",
};
