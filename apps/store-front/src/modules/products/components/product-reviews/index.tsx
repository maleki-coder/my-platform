// src/modules/products/components/product-reviews/index.tsx
"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { submitProductReviewAction } from "@lib/data/products"
import { useCustomer } from "@lib/context/customer-context"

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const router = useRouter()
  const pathname = usePathname() // دریافت آدرس فعلی محصول
  const { customer, isLoading, error } = useCustomer()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    // ۱. بررسی وضعیت لاگین و ریدایرکت با پارامتر backTo
    if (!customer || isLoading || error) {
      // هدایت کاربر به صفحه لاگین/اکانت به همراه آدرس بازگشت
      router.push(`/account?backTo=${encodeURIComponent(pathname)}`)
      return
    }

    setIsSubmitting(true)

    try {
      // ۲. فراخوانی Server Action
      const result = await submitProductReviewAction(
        productId,
        rating,
        comment,
        customer.id
      )

      if (result.success) {
        setSuccessMessage(result.message || "نظر شما ثبت شد.")
        setComment("")
        setRating(5)
      } else {
        setErrorMessage(result.error || "خطا در ثبت نظر.")
      }
    } catch (error) {
      console.error(error)
      setErrorMessage("یک خطای غیرمنتظره رخ داد.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-2xl mb-12"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">امتیاز شما:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${
                    rating >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="نظر خود را درباره این محصول بنویسید..."
          className="w-full border rounded-lg p-4 min-h-30 focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg w-fit hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "در حال ثبت..." : "ثبت نظر"}
        </button>

        {successMessage && (
          <div className="p-4 bg-green-50 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            {errorMessage}
          </div>
        )}
      </form>
  )
}
