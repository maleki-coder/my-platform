// src/modules/product-reviews/index.ts
import { Module } from "@medusajs/framework/utils"
import ProductReviewService from "./service"

// ثبت ماژول با معرفی سرویس اصلی
export const PRODUCT_REVIEW_MODULE = "productReviews"

export default Module(PRODUCT_REVIEW_MODULE, {
  service: ProductReviewService,
})
