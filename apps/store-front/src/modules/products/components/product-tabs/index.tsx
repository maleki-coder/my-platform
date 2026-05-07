"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"
import ProductReviews from "../product-reviews"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

type TabId = "technical" | "details" | "shipping" | "reviews"

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabId>("technical")
  const technicalRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)
  const shippingRef = useRef<HTMLDivElement>(null)
  const reviewsRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (section: TabId) => {
    setActiveTab(section)
    const refMap = {
      technical: technicalRef,
      details: detailsRef,
      shipping: shippingRef,
      reviews: reviewsRef,
    }
    const ref = refMap[section]

    if (ref.current) {
      const offset = 100
      const elementPosition = ref.current.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            if (id === "technical-specs") setActiveTab("technical")
            if (id === "product-details") setActiveTab("details")
            if (id === "shipping-returns") setActiveTab("shipping")
            if (id === "product-reviews") setActiveTab("reviews")
          }
        })
      },
      { threshold: 0.5, rootMargin: "-100px 0px -50% 0px" }
    )

    if (technicalRef.current) observer.observe(technicalRef.current)
    if (detailsRef.current) observer.observe(detailsRef.current)
    if (shippingRef.current) observer.observe(shippingRef.current)
    if (reviewsRef.current) observer.observe(reviewsRef.current)

    return () => observer.disconnect()
  }, [])

  const tabs = [
    { id: "technical" as TabId, label: "مشخصات فنی" },
    { id: "details" as TabId, label: "جزئیات محصول" },
    { id: "shipping" as TabId, label: "ارسال و بازگشت کالا" },
    { id: "reviews" as TabId, label: "نظرات کاربران" },
  ]

  return (
    <div className="relative w-full">
      {/* Sticky Tab Navigation */}
      <div className="sticky top-20 z-100 shadow-sm bg-white">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`flex-1 cursor-pointer px-4 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Technical Specifications Section */}
      <div
        id="technical-specs"
        ref={technicalRef}
        className="py-8 scroll-mt-24"
      >
        <TechnicalSpecificationsSection product={product} />
      </div>

      {/* Product Details Section */}
      <div id="product-details" ref={detailsRef} className="py-8 scroll-mt-24">
        <ProductDetailsSection product={product} />
      </div>

      {/* Shipping & Returns Section */}
      <div
        id="shipping-returns"
        ref={shippingRef}
        className="py-8 scroll-mt-24"
      >
        <ShippingReturnsSection />
      </div>

      {/* Product Reviews Section */}
      <div id="product-reviews" ref={reviewsRef} className="py-8 scroll-mt-24">
        <ProductReviewsSection product={product} />
      </div>
    </div>
  )
}

// Technical Specifications Section Component
const TechnicalSpecificationsSection = ({ product }: ProductTabsProps) => {
  const [showAll, setShowAll] = useState(false)

  const variantOptionIds = useMemo(() => {
    const ids = new Set<string>()
    product.variants?.forEach((variant) => {
      variant.options?.forEach((option) => {
        ids.add(option.option_id!)
      })
    })
    return ids
  }, [product.variants])

  const nonVariantOptions =
    product.options?.filter((option) => !variantOptionIds.has(option.id)) || []

  const INITIAL_DISPLAY_COUNT = 5
  const hasMoreOptions = nonVariantOptions.length > INITIAL_DISPLAY_COUNT
  const displayedOptions = showAll
    ? nonVariantOptions
    : nonVariantOptions.slice(0, INITIAL_DISPLAY_COUNT)

  if (nonVariantOptions.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">مشخصات فنی</h3>
        <div className="border rounded-xl p-6 bg-gray-50 text-center text-gray-500">
          مشخصات فنی برای این محصول موجود نیست
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">مشخصات فنی</h3>
      <div className="border rounded-xl overflow-hidden bg-white">
        <div className="divide-y divide-gray-200">
          {displayedOptions.map((option) => (
            <div
              key={option.id}
              className="grid grid-cols-1 md:grid-cols-2 hover:bg-gray-50 transition-colors"
            >
              <div className="px-6 py-4 bg-gray-50 md:bg-transparent">
                <span className="font-semibold text-gray-900 text-sm">
                  {option.title}
                </span>
              </div>
              <div className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {option.values && option.values.length > 0 ? (
                    option.values.map((value) => (
                      <span
                        key={value.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {value.value}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">-</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMoreOptions && (
          <div className="border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full px-6 py-4 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              {showAll ? (
                <>
                  <span>نمایش کمتر</span>
                  <svg
                    className="w-4 h-4 transform rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </>
              ) : (
                <>
                  <span>نمایش بیشتر</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Product Details Section Component
const ProductDetailsSection = ({ product }: ProductTabsProps) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">جزئیات محصول</h3>
      <div className="border rounded-xl p-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <span className="font-semibold text-gray-700 block mb-1">
                جنس ساخت
              </span>
              <p className="text-gray-600">
                {product.material ? product.material : "-"}
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-700 block mb-1">
                کشور سازنده
              </span>
              <p className="text-gray-600">
                {product.origin_country ? product.origin_country : "-"}
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-700 block mb-1">
                نوع
              </span>
              <p className="text-gray-600">
                {product.type ? product.type.value : "-"}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <span className="font-semibold text-gray-700 block mb-1">
                وزن
              </span>
              <p className="text-gray-600">
                {product.weight ? `${product.weight} g` : "-"}
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-700 block mb-1">
                ابعاد
              </span>
              <p className="text-gray-600">
                {product.length && product.width && product.height
                  ? `${product.length}L x ${product.width}W x ${product.height}H`
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Shipping & Returns Section Component
const ShippingReturnsSection = () => {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        ارسال و بازگشت کالا
      </h3>
      <div className="border rounded-xl p-6 bg-white space-y-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg">
            <FastDelivery />
          </div>
          <div>
            <span className="font-semibold text-gray-900 block mb-1">
              Fast delivery
            </span>
            <p className="text-sm text-gray-600">
              Your package will arrive in 3-5 business days at your pick up
              location or in the comfort of your home.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-green-50 rounded-lg">
            <Refresh />
          </div>
          <div>
            <span className="font-semibold text-gray-900 block mb-1">
              Simple exchanges
            </span>
            <p className="text-sm text-gray-600">
              Is the fit not quite right? No worries - we&apos;ll exchange your
              product for a new one.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-purple-50 rounded-lg">
            <Back />
          </div>
          <div>
            <span className="font-semibold text-gray-900 block mb-1">
              Easy returns
            </span>
            <p className="text-sm text-gray-600">
              Just return your product and we&apos;ll refund your money. No
              questions asked – we&apos;ll do our best to make sure your return
              is hassle-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Product Reviews Section Component
const ProductReviewsSection = ({ product }: ProductTabsProps) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">نظرات کاربران</h3>
      <div className="border rounded-xl p-8 bg-gray-50 text-center">
         <ProductReviews productId={product.id} />
      </div>
    </div>
  )
}

export default ProductTabs
