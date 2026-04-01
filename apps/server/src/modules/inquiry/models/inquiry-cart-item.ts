import { model } from "@medusajs/framework/utils";
import { InquiryCart } from "./Inquiry-cart";
export const InquiryCartItem = model.define("inquiry_cart_item", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  variant_id: model.text().nullable(),
  title: model.text(),
  thumbnail: model.text().nullable(),
  quantity: model.number().default(1),
  target_price: model.text().nullable(),
  currency: model.enum(["USD", "CYN", "IRR"]).default("USD"),
  product_handle: model.text().nullable(),
  package: model.text().nullable(),
  brand: model.text().nullable(),
  link: model.text().nullable(),
  description: model.text().nullable(),
  datasheet_url: model.text().nullable(),
  cart: model.belongsTo(() => InquiryCart, {
    mappedBy: "items",
  }),
});
