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
  
  const sectionRefs = {
    description: useRef<HTMLDivElement>(null),
    technical: useRef<HTMLDivElement>(null),
    details: useRef<HTMLDivElement>(null),
    reviews: useRef<HTMLDivElement>(null),
  }

  const isVisible = useScrollVisibility(10)

  const scrollMarginTop = isVisible ? "9rem" : "6rem"

  const scrollToSection = (section: TabId) => {
    setActiveTab(section)
    
    const ref = sectionRefs[section]
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>, section: TabId) => {
    e.preventDefault()
    scrollToSection(section)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id as TabId)
          }
        })
      },
      { threshold: 0.5, rootMargin: "-100px 0px -50% 0px" }
    )

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current)
    })

    return () => observer.disconnect()
  }, [])

  // Listen for custom event from MainCharacterOptions
  useEffect(() => {
    const handleScrollToTechnical = () => {
      scrollToSection("technical")
    }

    window.addEventListener("scrollToTechnicalSpecs", handleScrollToTechnical)

    return () => {
      window.removeEventListener("scrollToTechnicalSpecs", handleScrollToTechnical)
    }
  }, [])

  const tabs = [
    { id: "description" as TabId, label: "شرح" },
    { id: "technical" as TabId, label: "مشخصات" },
    { id: "details" as TabId, label: "جزئیات" },
    { id: "reviews" as TabId, label: "نظرات" },
  ]

  return (
    <div className="relative w-full">
      <div
        className={`sticky md:z-12 w-full border-b border-gray-200 bg-white transition-all duration-300 pt-2 ${
          isVisible ? "md:top-31" : "md:top-19"
        }`}
      >
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              onClick={(e) => handleTabClick(e, tab.id)}
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
