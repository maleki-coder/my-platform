// components/cart/quantity-selector.tsx
"use client"
import { updateLineItem } from "@lib/data/cart"
import { useVariantInventory } from "@lib/hooks/use-variant-inventory"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import DecrementCartItem from "@modules/common/components/decrement-cart-item"
import IncrementCartItem from "@modules/common/components/increment-cart-item.tsx"
import { useCallback } from "react"

interface QuantitySelectorProps {
  item: HttpTypes.StoreCartLineItem
  countryCode: string
}

export function QuantitySelector({ item, countryCode }: QuantitySelectorProps) {
  const { data: product, isLoading } = useVariantInventory(
    item.product?.id!,
    countryCode
  )

  const maxQtyFromInventory = product?.variants?.find(
    (variant) => variant.id === item.variant?.id
  )?.inventory_quantity

  const currentQty = item.quantity || 1
  const available = maxQtyFromInventory || 0
  const canIncrement = currentQty < available
  const canDecrement = currentQty > 1

  const handleIncrement = useCallback(async () => {
    if (!canIncrement) {
      return
    }
    await updateLineItem({
      lineId: item.id,
      quantity: currentQty + 1,
    })
    //   .catch((err) => {
    //     setError(err.message)
    //   })
    //   .finally(() => {
    //     setUpdating(false)
    //   })
  }, [canIncrement, currentQty, item.id, available])

  const handleDecrement = useCallback(async () => {
    if (!canDecrement) return
    await updateLineItem({
      lineId: item.id,
      quantity: currentQty - 1,
    })
    //           .catch((err) => {
    //             setError(err.message)
    //           })
    //           .finally(() => {
    //             setUpdating(false)
    //           })
  }, [canDecrement, currentQty, item.id])

  if (isLoading && item.variant?.manage_inventory) {
    return (
      <div className="flex items-center gap-2">
        <button disabled className="w-8 h-8 border rounded disabled:opacity-50">
          +
        </button>
        <span className="text-sm font-medium min-w-8 text-center">
          {convertToLocale({ amount: Number(currentQty) })}
        </span>
        <button disabled className="w-8 h-8 border rounded disabled:opacity-50">
          -
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <IncrementCartItem
        id={item.id}
        canIncrement={canIncrement}
        manageInventory={item.variant?.manage_inventory!}
        available={available}
        onIncrement={handleIncrement}
      />
      <span className="text-sm font-medium min-w-8 text-center">
        {convertToLocale({ amount: Number(currentQty) })}
      </span>

      <DecrementCartItem
        id={item.id}
        canDecrement={canDecrement}
        manageInventory={item.variant?.manage_inventory!}
        onIncrement={handleDecrement}
      />
    </div>
  )
}
