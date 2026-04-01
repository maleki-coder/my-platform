import { model } from "@medusajs/framework/utils"
import { InquiryCart } from "./Inquiry-cart"
export const InquiryCartItem = model.define("inquiry_cart_item", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  variant_id: model.text().nullable(),
  title: model.text(),
  thumbnail: model.text().nullable(),
  quantity: model.number().default(1),
  cart: model.belongsTo(() => InquiryCart, {
    mappedBy: "items",
  }),
})