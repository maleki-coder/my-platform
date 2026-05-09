// src/modules/products/product-tabs/components/product-reviews-section/index.tsx
"use client"

import { useState, useEffect } from "react"
import { Star, User } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { submitProductReviewAction, getProductReviews } from "@lib/data/products"
import { useCustomer } from "@lib/context/customer-context"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@lib/components/ui/dialog"
import { Button } from "@lib/components/ui/button"
import { Label } from "@lib/components/ui/label"
import { Spinner } from "@lib/components/ui/spinner"
import { useScrollVisibility } from "@lib/hooks/use-scroll-visibility"

interface ProductReviewsProps {
  productId: string
}

interface Review {
  id: string
  rating: number
  comment: string
  customer_id: string
  created_at: string
  is_approved: boolean
  customer?: {
    first_name: string
    last_name: string
  } | null
}

export function ProductReviewsSection({ productId }: ProductReviewsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { customer, isLoading, error } = useCustomer()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState("")

  // Fetch reviews on mount
  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true)
      const result = await getProductReviews(productId)
      
      if (result.success) {
        setReviews(result.reviews)
      } else {
        setReviewsError(result.error || "خطا در دریافت نظرات")
      }
      setReviewsLoading(false)
    }

    fetchReviews()
  }, [productId])

  const handleDialogOpen = () => {
    if (!customer || isLoading || error) {
      router.push(`/account?backTo=${encodeURIComponent(pathname)}`)
      return
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    setIsSubmitting(true)

    try {
      const result = await submitProductReviewAction(
        productId,
        rating,
        comment,
        customer!.id
      )

      if (result.success) {
        setSuccessMessage(result.message || "نظر شما ثبت شد و پس از تایید نمایش داده خواهد شد.")
        setComment("")
        setRating(5)
        
        // Refresh reviews after successful submission
        const updatedReviews = await getProductReviews(productId)
        if (updatedReviews.success) {
          setReviews(updatedReviews.reviews)
        }

        // Close dialog after 2 seconds
        setTimeout(() => {
          setIsDialogOpen(false)
          setSuccessMessage("")
        }, 2000)
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const calculateAverageRating = () => {
    if (reviews.length === 0) return "0"
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  const getCustomerName = (review: Review) => {
    if (review.customer?.first_name && review.customer?.last_name) {
      return `${review.customer.first_name} ${review.customer.last_name}`
    }
    return "کاربر"
  }

  const isVisible = useScrollVisibility(10)

  return (
    <div className="md:p-0 px-4">
      <h3 className="text-lg font-bold text-gray-900 mb-6">نظرات کاربران</h3>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Right Section - Sticky Submit Button & Average Rating */}
        <div className="lg:col-span-4 order-first">
          <div style={isVisible ? { top: "11.5rem" } : { top: "8.5rem" }} className="lg:sticky">
            <div className="border rounded-xl p-6 bg-white shadow-sm">
              {/* Average Rating */}
              {reviews.length > 0 && (
                <div className="text-center mb-6 pb-6 border-b">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    {calculateAverageRating()}
                  </div>
                  <div className="flex justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          parseFloat(calculateAverageRating()) >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    از مجموع {reviews.length} امتیاز
                  </p>
                </div>
              )}

              {/* Submit Review Dialog Trigger */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <button
                    onClick={handleDialogOpen}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    data-testid="submit-review-button"
                  >
                    ثبت نظر
                  </button>
                </DialogTrigger>
                <DialogContent
                  className="sm:max-w-150 w-full max-h-screen md:max-h-[90vh] overflow-y-auto z-10000"
                  data-testid="submit-review-modal"
                >
                  <DialogHeader>
                    <DialogTitle className="text-right">ثبت دیدگاه</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-y-4 py-4">
                      {/* Rating Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="rating">امتیاز شما:</Label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-8 h-8 ${
                                  rating >= star
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Comment Textarea */}
                      <div className="space-y-2">
                        <Label htmlFor="comment">نظر شما:</Label>
                        <textarea
                          id="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="نظر خود را درباره این محصول بنویسید..."
                          className="w-full border rounded-lg p-3 min-h-32 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          required
                          data-testid="comment-input"
                        />
                      </div>

                      {/* Success Message */}
                      {successMessage && (
                        <div
                          className="p-3 bg-green-50 text-green-700 rounded-lg text-sm"
                          data-testid="success-message"
                        >
                          {successMessage}
                        </div>
                      )}

                      {/* Error Message */}
                      {errorMessage && (
                        <div
                          className="p-3 bg-red-50 text-red-700 rounded-lg text-sm"
                          data-testid="error-message"
                        >
                          {errorMessage}
                        </div>
                      )}
                    </div>

                    <DialogFooter>
                      <div className="flex gap-3 justify-end">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setIsDialogOpen(false)}
                          className="cursor-pointer h-10"
                          data-testid="cancel-button"
                        >
                          لغو
                        </Button>
                        <Button
                          className="cursor-pointer"
                          type="submit"
                          disabled={isSubmitting}
                          data-testid="save-button"
                        >
                          {isSubmitting ? <Spinner /> : "ثبت نظر"}
                        </Button>
                      </div>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Left Section - Reviews List (Scrollable) */}
        <div className="lg:col-span-8 space-y-6">
          <h4 className="text-md font-semibold text-gray-900">
            نظرات ({reviews.length})
          </h4>

          {reviewsLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border rounded-lg p-6 animate-pulse bg-gray-50"
                >
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}

          {reviewsError && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">
              {reviewsError}
            </div>
          )}

          {!reviewsLoading && reviews.length === 0 && (
            <div className="border rounded-lg p-8 bg-gray-50 text-center text-gray-500">
              هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهد!
            </div>
          )}

          {!reviewsLoading &&
            reviews.map((review) => (
              <div
                key={review.id}
                className="border rounded-lg p-6 bg-white hover:shadow-md transition-shadow"
              >
                {/* Customer Name with Avatar */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {getCustomerName(review)}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          review.rating >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-gray-700 leading-relaxed text-sm">
                  {review.comment}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
