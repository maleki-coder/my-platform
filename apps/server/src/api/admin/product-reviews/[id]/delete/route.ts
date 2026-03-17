// src/api/admin/product-reviews/[id]/delete/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    // ۱. استخراج شناسه نظر از پارامترهای مسیر
    const { id } = req.params

    // ۲. دریافت سرویس ماژول نظرات
    const reviewModuleService = req.scope.resolve("productReviews")

    // ۳. حذف نظر با استفاده از متد تولید شده توسط MedusaService
    // توجه: نام این متد بر اساس نام مدل شما به صورت خودکار ساخته می‌شود
    await reviewModuleService.deleteProductReviews(id)

    // ۴. بازگرداندن پاسخ استاندارد حذف در مدوسا
    return res.status(200).json({
      id,
      object: "product_review",
      deleted: true,
    })
  } catch (error) {
    console.error("خطا در حذف نظر:", error)
    return res.status(500).json({ 
      message: "خطای سرور در هنگام حذف نظر رخ داده است." 
    })
  }
}
