import { model } from "@medusajs/framework/utils"
import { InquiryCartItem } from "./inquiry-cart-item"

export const InquiryCart = model.define("inquiry_cart", {
  id: model.id().primaryKey(),
  customer_id: model.text().nullable(), // برای اتصال به کاربران لاگین شده
  status: model.enum(["active", "submitted", "contacted"]).default("active"),
  
  // اطلاعات مشتری که در مرحله نهایی (Submit) پر می‌شود
  email: model.text().nullable(),
  phone: model.text().nullable(),
  customer_name: model.text().nullable(),
  notes: model.text().nullable(),
  
  items: model.hasMany(() => InquiryCartItem, {
    mappedBy: "cart",
  }),
})