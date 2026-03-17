// src/modules/product-reviews/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import { ProductReview } from "./models/reviews"

// سرویس ماژول که متدهای پایه را از طریق DML دریافت می‌کند
class ProductReviewService extends MedusaService({
  ProductReview,
}) {
  // در صورت نیاز به لاجیک‌های پیچیده‌تر، متدهای کاستوم را اینجا اضافه می‌کنید
}

export default ProductReviewService
