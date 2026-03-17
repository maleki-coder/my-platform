// src/api/admin/product-reviews/[id]/approve/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import ProductReviewService from "../../../../../modules/product-reviews/service"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const reviewId = req.params.id
  const reviewModule = req.scope.resolve("productReviews") as ProductReviewService

  const updatedReview = await reviewModule.updateProductReviews({
    id: reviewId,
    is_approved: true
  })

  res.status(200).json({ review: updatedReview })
}
