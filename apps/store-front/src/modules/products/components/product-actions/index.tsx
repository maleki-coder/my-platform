"use client"

// 1. External & React Imports
import { useState } from "react"
import { useParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { ClipboardList, ShoppingCart } from "lucide-react"

// 2. Library & Context Imports
import { addToCart, addToInquiryCart } from "@lib/data/cart"
import { getProductPrice } from "@lib/util/get-product-price"
import { useProductSelection } from "@modules/products/components/product-selection-provider"

// 3. UI Components
import { Button } from "@lib/components/ui/button"
import { Spinner } from "@lib/components/ui/spinner"
import ProductPrice from "@modules/products/components/product-price"
import TimedDiscountBadge from "@modules/products/components/timed-discount-badge"
import ProductInStockInfo from "@modules/products/components/product-in-stock-info"
import ProductWarrantyInfo from "@modules/products/components/product-warranty-info"

// --- Types & Constants ---

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  disabled?: boolean
}

const BUTTON_BASE_CLASSES =
  "relative w-full h-12 text-sm text-white cursor-pointer font-bold shadow-md transition-all duration-300"

// --- Main Component ---

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  // State & Hooks
  const [isAdding, setIsAdding] = useState(false)
  const countryCode = useParams().countryCode as string

  // Context
  const { selectedVariant, isValidVariant, inStock } = useProductSelection()

  // Derived Data
  const { cheapestPrice } = getProductPrice({ product })

  const hasValidTimedDiscount =
    cheapestPrice?.percentage_diff &&
    parseInt(cheapestPrice.percentage_diff) > 0 &&
    cheapestPrice?.ends_at

  const isActionDisabled = !!disabled || isAdding

  // --- Handlers ---

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null
    setIsAdding(true)
    await addToCart({ variantId: selectedVariant.id, quantity: 1, countryCode })
    setIsAdding(false)
  }

  const handleAddToInquiryCart = async () => {
    if (!selectedVariant?.id) return null
    setIsAdding(true)
    await addToInquiryCart({
      quantity: 1,
      product_id: product.id,
      variant_id: selectedVariant.id,
      product_handle: product.handle,
      thumbnail: product.thumbnail!,
      title: product.title,
    })
    setIsAdding(false)
  }

  // --- Render Helpers ---

  const renderCartButtonContent = () => {
    if (isAdding) return <Spinner />
    return (
      <>
        <span>افزودن به سبد خرید</span>
        <ShoppingCart size={24} className="absolute left-3.5" />
      </>
    )
  }

  const renderInquiryButtonContent = () => {
    if (isAdding) return <Spinner />
    return (
      <>
        <span>افزودن به لیست استعلام</span>
        <ClipboardList size={24} className="absolute left-3.5" />
      </>
    )
  }

  // --- Main Render ---

  return (
    <div className="sticky top-12 flex flex-col gap-y-6 rounded-2xl border-b border-gray-100 bg-white p-2 shadow-custom">
      {/* Discount Badge */}
      {inStock && isValidVariant && hasValidTimedDiscount && (
        <div className="border-b border-gray-100 pb-4">
          <TimedDiscountBadge
            startsAt={cheapestPrice.starts_at}
            endsAt={cheapestPrice.ends_at!}
          />
        </div>
      )}

      {/* Stock & Warranty Info */}
      <div className="flex flex-col gap-1">
        <ProductInStockInfo inStock={inStock} />
        {inStock && <ProductWarrantyInfo />}
      </div>

      {/* Price */}
      {inStock && isValidVariant && (
        <ProductPrice product={product} variant={selectedVariant} />
      )}

      {/* Actions */}
      <div className="border-t border-gray-100 pt-6">
        {inStock && isValidVariant ? (
          <>
            <div className="md:block hidden">
              <Button
                onClick={handleAddToCart}
                disabled={isActionDisabled}
                className={`${BUTTON_BASE_CLASSES} bg-sky-900 hover:bg-sky-700`}
              >
                {renderCartButtonContent()}
              </Button>
            </div>
            <div className="md:hidden block">
              <div
                className={`fixed bottom-20 right-0 z-20 w-full border-t border-gray-300 bg-gray-3 px-6 py-4 bg-gray-100!`}
              >
                <Button
                  onClick={handleAddToCart}
                  disabled={isActionDisabled}
                  className={`${BUTTON_BASE_CLASSES} bg-sky-900 hover:bg-sky-700`}
                >
                  {renderCartButtonContent()}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="md:block hidden">
              <Button
                onClick={handleAddToInquiryCart}
                disabled={isActionDisabled}
                className={`${BUTTON_BASE_CLASSES} bg-green-900 hover:bg-green-700`}
              >
                {renderInquiryButtonContent()}
              </Button>
            </div>
            <div className="md:hidden block">
              <div
                className={`fixed bottom-20 right-0 z-20 w-full border-t border-gray-300 bg-gray-3 px-6 py-4 bg-gray-100!`}
              >
                <Button
                  onClick={handleAddToInquiryCart}
                  disabled={isActionDisabled}
                  className={`${BUTTON_BASE_CLASSES} bg-green-900 hover:bg-green-700`}
                >
                  {renderInquiryButtonContent()}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
