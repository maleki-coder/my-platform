// src/api/store/products/[id]/reviews/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import ProductReviewService from "../../../../../modules/product-reviews/service";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const productId = req.params.id;
  const { rating, comment, customer_id } = req.body as {
    rating: number;
    comment: string;
    customer_id: string;
  };

  if (!customer_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // اصلاح نوع در اینجا
  const reviewModule = req.scope.resolve(
    "productReviews",
  ) as ProductReviewService;

  const review = await reviewModule.createProductReviews({
    product_id: productId,
    customer_id: customer_id,
    rating,
    comment,
    is_approved: false,
  });

  res.status(201).json({ review });
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const productId = req.params.id
  
  // Get your custom product review module
   const reviewModule = req.scope.resolve(
    "productReviews",
  ) as ProductReviewService;
  
  // Get customer module
  const customerModuleService = req.scope.resolve(Modules.CUSTOMER)
  
  // Fetch reviews
  const reviews = await reviewModule.listProductReviews({
    product_id: productId,
    is_approved: true,
  })
  
  // Extract unique customer IDs
  const customerIds = [...new Set(reviews.map(review => review.customer_id).filter(Boolean))]
  
  // Fetch only first_name and last_name
  let customers: { id: string; first_name: string; last_name: string }[] = []
  if (customerIds.length > 0) {
    const customerData = await customerModuleService.listCustomers(
      {
        id: customerIds,
      },
      {
        select: ["id", "first_name", "last_name"],
      }
    )
    customers = customerData as { id: string; first_name: string; last_name: string }[]
  }
  
  // Create a customer map for quick lookup
  const customerMap = new Map(
    customers.map(customer => [customer.id, { first_name: customer.first_name, last_name: customer.last_name }])
  )
  
  // Enrich reviews with customer data
  const enrichedReviews = reviews.map(review => ({
    ...review,
    customer: review.customer_id ? customerMap.get(review.customer_id) : null,
  }))

  res.status(200).json({ reviews: enrichedReviews })
}
