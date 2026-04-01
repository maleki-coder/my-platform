// src/modules/product-reviews/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import { ProductReview } from "./models/reviews"

class ProductReviewService extends MedusaService({
  ProductReview,
}) {
}

export default ProductReviewService
