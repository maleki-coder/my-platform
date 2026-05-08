"use client"

import { useState, useRef, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { TechnicalSpecificationsSection } from "@modules/products/components/product-tabs/technical-specification-section"
import { ProductDetailsSection } from "@modules/products/components/product-tabs/product-detail-section"
import { ProductReviewsSection } from "@modules/products/components/product-tabs/product-reviews-section"
import { useScrollVisibility } from "@lib/hooks/use-scroll-visibility"
import { ProductDescriptionSection } from "@modules/products/components/product-tabs/product-description-section"

export type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

type TabId = "description" | "technical" | "details" | "reviews"

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabId>("description")
  
  // A single ref map is cleaner!
  const sectionRefs = {
    description: useRef<HTMLDivElement>(null),
    technical: useRef<HTMLDivElement>(null),
    details: useRef<HTMLDivElement>(null),
    reviews: useRef<HTMLDivElement>(null),
  }

  const isVisible = useScrollVisibility(10)

  // ✨ DYNAMIC OFFSET CALCULATION ✨
  // Based on your Tailwind classes: top-34 = 8.5rem, top-22 = 5.5rem.
  // We add a little extra padding for breathing room.
  const scrollMarginTop = isVisible ? "9rem" : "6rem"; // e.g., 144px and 96px

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, section: TabId) => {
    e.preventDefault() // Prevent URL hash from changing
    setActiveTab(section)
    
    const ref = sectionRefs[section]
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start", // This aligns the top of the element to the top of the scroll container
      })
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // The id is on the element, so we can cast it safely.
            setActiveTab(entry.target.id as TabId)
          }
        })
      },
      // This rootMargin is brilliant! It says "consider an element active when it's
      // between 100px from the top and the center of the screen".
      { threshold: 0.5, rootMargin: "-100px 0px -50% 0px" }
    )

    // Observe all refs
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current)
    })

    return () => observer.disconnect()
  }, []) // No dependencies needed if refs don't change

  const tabs = [
    { id: "description" as TabId, label: "شرح" },
    { id: "technical" as TabId, label: "مشخصات" },
    { id: "details" as TabId, label: "جزئیات" },
    { id: "reviews" as TabId, label: "نظرات" },
  ]

  return (
    <div className="relative w-full">
      {/* Sticky Tab Navigation */}
      <div
        className={`sticky md:z-15 w-full border-b border-gray-200 bg-white transition-all duration-300 pt-2 ${
          isVisible ? "md:top-31" : "md:top-19"
        }`}
      >
        <div className="flex gap-1">
          {tabs.map((tab) => (
            // Using <a> tags for semantics and accessibility
            <a
              key={tab.id}
              href={`#${tab.id}`}
              onClick={(e) => scrollToSection(e, tab.id)}
              className={`shrink cursor-pointer p-2 text-gray-600 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "border-b-blue-400 border-b-2 text-blue-600"
                  : "hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </a>
          ))}
        </div>
      </div>

      {/* The Sections */}
      {/* We apply the dynamic scroll-margin-top via inline styles */}
      <div
        id="description"
        ref={sectionRefs.description}
        className="md:py-8 py-4"
        style={{ scrollMarginTop }}
      >
        <ProductDescriptionSection product={product} />
      </div>

      <div
        id="technical"
        ref={sectionRefs.technical}
        className="md:py-8 py-4"
        style={{ scrollMarginTop }}
      >
        <TechnicalSpecificationsSection product={product} />
      </div>

      <div
        id="details"
        ref={sectionRefs.details}
        className="md:py-8 py-4"
        style={{ scrollMarginTop }}
      >
        <ProductDetailsSection product={product} />
      </div>

      <div
        id="reviews"
        ref={sectionRefs.reviews}
        className="md:py-8 py-4"
        style={{ scrollMarginTop }}
      >
        <ProductReviewsSection productId={product.id} />
      </div>
    </div>
  )
}

export default ProductTabs
