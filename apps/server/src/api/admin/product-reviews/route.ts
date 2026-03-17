// src/api/admin/product-reviews/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    // ۱. استخراج سرویس‌های مورد نیاز از کانتینر مدوسا
    const reviewModuleService = req.scope.resolve("productReviews")
    const productModuleService = req.scope.resolve("product")
    const customerModuleService = req.scope.resolve("customer")

    // ۲. دریافت لیست نظرات
    const reviews = await reviewModuleService.listProductReviews({}, { order: { created_at: "DESC" } })

    // ۳. استخراج شناسه‌های یکتا برای بهینه‌سازی کوئری دیتابیس
    const productIds = [...new Set(reviews.map((r: any) => r.product_id).filter(Boolean))]
    const customerIds = [...new Set(reviews.map((r: any) => r.customer_id).filter(Boolean))]

    // ۴. دریافت محصولات و مشتریان مرتبط
    const products = productIds.length > 0 
      ? await productModuleService.listProducts({ id: productIds }) 
      : []
      
    const customers = customerIds.length > 0 
      ? await customerModuleService.listCustomers({ id: customerIds }) 
      : []

    // ۵. ساخت Map برای جستجوی سریع (O(1))
    const productMap = new Map(products.map((p: any) => [p.id, p.title]))
    const customerMap = new Map(customers.map((c: any) => [
      c.id, 
      `${c.first_name || ""} ${c.last_name || ""}`.trim() || c.email
    ]))

    // ۶. اضافه کردن نام محصول و مشتری به هر نظر
    const enrichedReviews = reviews.map((review: any) => ({
      ...review,
      product_name: productMap.get(review.product_id) || "محصول نامشخص",
      customer_name: customerMap.get(review.customer_id) || "کاربر نامشخص"
    }))

    return res.json({ reviews: enrichedReviews })
  } catch (error) {
    console.error("Error fetching product reviews:", error)
    return res.status(500).json({ message: "خطا در دریافت لیست نظرات" })
  }
}
