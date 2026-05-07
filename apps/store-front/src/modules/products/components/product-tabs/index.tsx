"use client"

import { useState, useRef, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { TechnicalSpecificationsSection } from "@modules/products/components/product-tabs/technical-specification-section"
import { ProductDetailsSection } from "@modules/products/components/product-tabs/product-detail-section"
import { ShippingReturnsSection } from "@modules/products/components/product-tabs/shipping-returns-section"
import { ProductReviewsSection } from "@modules/products/components/product-tabs/product-reviews-section"
import { useScrollVisibility } from "@lib/hooks/use-scroll-visibility"

export type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

type TabId = "technical" | "details" | "shipping" | "reviews"

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabId>("technical")
  const technicalRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)
  const shippingRef = useRef<HTMLDivElement>(null)
  const reviewsRef = useRef<HTMLDivElement>(null)
  const isVisible = useScrollVisibility(10)
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
      <div
        className={`sticky md:z-15 shadow-sm bg-white w-fit ${
          isVisible ? "md:top-34" : "md:top-22"
        }`}
      >
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`shrink cursor-pointer p-2 text-xs md:text-sm font-medium transition-all duration-200 ${
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
        className="md:py-8 py-4 scroll-mt-24"
      >
        <TechnicalSpecificationsSection product={product} />
      </div>

      {/* Product Details Section */}
      <div id="product-details" ref={detailsRef} className="md:py-8 py-4 scroll-mt-24">
        <ProductDetailsSection product={product} />
      </div>

      {/* Shipping & Returns Section */}
      <div
        id="shipping-returns"
        ref={shippingRef}
        className="md:py-8 py-4 scroll-mt-24"
      >
        <ShippingReturnsSection />
      </div>

      {/* Product Reviews Section */}
      <div id="product-reviews" ref={reviewsRef} className="md:py-8 py-4 scroll-mt-24">
        <ProductReviewsSection productId={product.id} />
      </div>
    </div>
  )
}

export default ProductTabs
