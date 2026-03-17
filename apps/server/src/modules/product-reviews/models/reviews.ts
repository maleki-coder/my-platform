// src/modules/product-reviews/models/review.ts
import { model } from "@medusajs/framework/utils"

export const ProductReview = model.define("product_review", {
  id: model.id().primaryKey(),
  product_id: model.text().index(),
  customer_id: model.text().index(),
  rating: model.number(),
  comment: model.text(),
  is_approved: model.boolean().default(false),
})
