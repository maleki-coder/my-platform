// src/api/store/products/[id]/reviews/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import ProductReviewService from "../../../../../modules/product-reviews/service"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const productId = req.params.id
  const { rating, comment, customer_id } = req.body as { rating: number; comment: string , customer_id: string}
  
  if (!customer_id) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  // اصلاح نوع در اینجا
  const reviewModule = req.scope.resolve("productReviews") as ProductReviewService
  
  const review = await reviewModule.createProductReviews({
    product_id: productId,
    customer_id: customer_id,
    rating,
    comment,
    is_approved: false
  })

  res.status(201).json({ review })
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const productId = req.params.id
  
  // اصلاح نوع در اینجا
  const reviewModule = req.scope.resolve("productReviews") as ProductReviewService

  const reviews = await reviewModule.listProductReviews({
    product_id: productId,
    is_approved: true
  })

  res.status(200).json({ reviews })
}
