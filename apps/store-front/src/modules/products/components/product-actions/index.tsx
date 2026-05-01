"use client"

import { addToCart, addToInquiryCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
// import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"
import { Button } from "@lib/components/ui/button"
import TimedDiscountBadge from "../timed-discount-badge"
import { getProductPrice } from "@lib/util/get-product-price"
import { clx } from "@lib/util/clx"
import ProductInStockInfo from "../product-in-stock-info/product-in-stock-info"
import ProductGarrantyInfo from "../product-garranty-info.tsx"
import { CarrotIcon, ClipboardList, ShoppingCart } from "lucide-react"
import { Spinner } from "@lib/components/ui/spinner"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const countryCode = useParams().countryCode as string

  // auto select the first avilable product variant
  useEffect(() => {
    if (isValidVariant) return
    if (product.variants && product.variants.length > 0) {
      // Find the first variant that is actually in stock
      const firstAvailableVariant = product.variants.find((v) => {
        // Condition $1$: Inventory is not managed
        if (!v.manage_inventory) return true

        // Condition $2$: Backorders are allowed
        if (v.allow_backorder) return true

        // Condition $3$: Inventory is managed AND quantity is greater than $0$
        if (v.manage_inventory && (v.inventory_quantity || 0) > 0) return true

        // Otherwise, it's out of stock
        return false
      })

      // If we found an in-stock variant, pre-select its options!
      // If none are in stock, you can either fallback to the first one (product.variants[0])
      // or leave it as is (which will show out of stock).
      // Here, we select the first available one, or fallback to the absolute first one if ALL are out of stock.
      const variantToSelect = firstAvailableVariant || product.variants[0]

      if (variantToSelect) {
        const variantOptions = optionsAsKeymap(variantToSelect.options)
        setOptions(variantOptions ?? {})
      }
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }
  const { cheapestPrice } = getProductPrice({
    product,
  })
  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString(), { scroll: false })
  }, [selectedVariant, isValidVariant])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
    })

    setIsAdding(false)
  }
  // add the selected variant to the cart
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
      // countryCode,
    })

    setIsAdding(false)
  }

  const hasValidTimedDiscount =
    cheapestPrice?.percentage_diff &&
    parseInt(cheapestPrice.percentage_diff) > 0 &&
    cheapestPrice?.ends_at

  return (
    <>
      <div
        className={`flex flex-col gap-y-6 border-b border-gray-100 rounded-2xl p-2 bg-white shadow-custom sticky top-12`}
      >
        {hasValidTimedDiscount ? (
          <div className="border-b border-gray-100 pb-4">
            <TimedDiscountBadge
              startsAt={cheapestPrice.starts_at}
              endsAt={cheapestPrice.ends_at!}
            />
          </div>
        ) : null}
        {inStock && (
          <div className="flex flex-col gap-1">
            <ProductInStockInfo />
            <ProductGarrantyInfo />
          </div>
        )}
        <ProductPrice product={product} variant={selectedVariant} />
        <div className="mt-4 pt-6 border-t border-gray-100">
          {inStock && isValidVariant ? (
            <Button
              onClick={handleAddToCart}
              disabled={!!disabled || isAdding}
              className="relative w-full h-12 text-sm text-white cursor-pointer font-bold shadow-md transition-all duration-300 bg-sky-900 hover:bg-sky-700"
            >
              {isAdding ? (
                <Spinner />
              ) : (
                <>
                  <span>افزودن به سبد خرید</span>
                  <ShoppingCart size={24} className="absolute left-3.5" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleAddToInquiryCart}
              disabled={!!disabled || isAdding}
              className="relative w-full h-12 text-sm text-white cursor-pointer font-bold shadow-md transition-all duration-300 bg-green-900 hover:bg-green-700"
            >
              {isAdding ? (
                <Spinner />
              ) : (
                <>
                  <span>افزودن به لیست استعلام</span>
                  <ClipboardList size={24} className="absolute left-3.5" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      {/* <div className="flex flex-col gap-y-2 md:mb-0 mb-40" ref={actionsRef}> */}
      <div>
        {(product.variants?.length ?? 0) > 1 && (
          <div className="flex flex-col gap-y-4">
            {(product.options || []).map((option) => {
              return (
                <div key={option.id}>
                  <OptionSelect
                    option={option}
                    current={options[option.id]}
                    updateOption={setOptionValue}
                    title={option.title ?? ""}
                    data-testid="product-options"
                    disabled={!!disabled || isAdding}
                  />
                </div>
              )
            })}
            <Divider />
          </div>
        )}
      </div>

      {/* <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          // variant="primary"
          className="w-full h-10"
          // isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant && !options
            ? "Select variant"
            : !inStock || !isValidVariant
            ? "Out of stock"
            : "Add to cart"}
        </Button> */}
      {/* <Button
          onClick={handleAddToInquiryCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          className="w-full h-10"
          data-testid="add-product-button"
        >
          {!selectedVariant
            ? "Select variant"
            : !isValidVariant
            ? "Out of stock"
            : "Add to inquiry cart"}
        </Button> */}
      {/* <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        /> */}
      {/* </div> */}
    </>
  )
}
