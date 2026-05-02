"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { isEqual } from "lodash"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type ProductSelectionContextType = {
  options: Record<string, string | undefined>
  setOptionValue: (optionId: string, value: string) => void
  selectedVariant: HttpTypes.StoreProductVariant | undefined
  isValidVariant: boolean
  inStock: boolean
}

const ProductSelectionContext = createContext<ProductSelectionContextType | null>(null)

const optionsAsKeymap = (variantOptions: HttpTypes.StoreProductVariant["options"]) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export const ProductSelectionProvider = ({
  product,
  children,
}: {
  product: HttpTypes.StoreProduct
  children: React.ReactNode
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})

  // 1. Check if valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    }) ?? false
  }, [product.variants, options])

  // 2. Auto-select logic
  useEffect(() => {
    if (isValidVariant) return
    if (product.variants && product.variants.length > 0) {
      const firstAvailableVariant = product.variants.find((v) => {
        if (!v.manage_inventory) return true
        if (v.allow_backorder) return true
        if (v.manage_inventory && (v.inventory_quantity || 0) > 0) return true
        return false
      })

      const variantToSelect = firstAvailableVariant || product.variants[0]
      if (variantToSelect) {
        const variantOptions = optionsAsKeymap(variantToSelect.options)
        setOptions(variantOptions ?? {})
      }
    }
  }, [product.variants, isValidVariant])

  // 3. Get Selected Variant
  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return undefined
    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // 4. Update URL params
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) return

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString(), { scroll: false })
  }, [selectedVariant, isValidVariant, pathname, router, searchParams])

  // 5. Check Stock
  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) return true
    if (selectedVariant?.allow_backorder) return true
    if (selectedVariant?.manage_inventory && (selectedVariant?.inventory_quantity || 0) > 0) return true
    return false
  }, [selectedVariant])

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({ ...prev, [optionId]: value }))
  }

  return (
    <ProductSelectionContext.Provider
      value={{ options, setOptionValue, selectedVariant, isValidVariant, inStock }}
    >
      {children}
    </ProductSelectionContext.Provider>
  )
}

export const useProductSelection = () => {
  const context = useContext(ProductSelectionContext)
  if (!context) {
    throw new Error("useProductSelection must be used within a ProductSelectionProvider")
  }
  return context
}
