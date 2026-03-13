"use client"

import { Input } from "@lib/components/ui/input"
import { updateLineItem } from "@lib/data/cart"
import { useVariantInventory } from "@lib/hooks/use-variant-inventory"
import { HttpTypes } from "@medusajs/types"
import DecrementCartItem from "@modules/common/components/decrement-cart-item"
import IncrementCartItem from "@modules/common/components/increment-cart-item.tsx"
import { useCallback, useEffect, useState } from "react"

interface QuantitySelectorProps {
  item: HttpTypes.StoreCartLineItem
  countryCode: string
}

export function QuantitySelector({ item, countryCode }: QuantitySelectorProps) {
  const { data: product, isLoading: isInventoryLoading } = useVariantInventory(
    item.product?.id!,
    countryCode
  )

  const variant = product?.variants?.find((v) => v.id === item.variant?.id)
  const maxQtyFromInventory = variant?.inventory_quantity || 0
  const manageInventory = item.variant?.manage_inventory || false
  const allowBackorder = variant?.allow_backorder || false

  const currentQty = item.quantity || 1
  const available = maxQtyFromInventory

  const [inputValue, setInputValue] = useState<string | number>(currentQty)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setInputValue(currentQty)
  }, [currentQty])

  const canIncrement =
    manageInventory && !allowBackorder ? currentQty < available : true
  const canDecrement = currentQty > 1

  const changeQuantity = async (newQuantity: number) => {
    let validQuantity = Math.max(1, newQuantity)

    if (manageInventory && !allowBackorder && validQuantity > available) {
      validQuantity = available
    }

    if (validQuantity === currentQty) {
      setInputValue(currentQty)
      return
    }

    setIsUpdating(true)
    try {
      await updateLineItem({
        lineId: item.id,
        quantity: validQuantity,
      })
      setInputValue(validQuantity)
    } catch (error) {
      console.error("Failed to update quantity:", error)
      setInputValue(currentQty)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleIncrement = useCallback(async () => {
    if (!canIncrement || isUpdating) return
    await changeQuantity(currentQty + 1)
  }, [canIncrement, currentQty, isUpdating])

  const handleDecrement = useCallback(async () => {
    if (!canDecrement || isUpdating) return
    await changeQuantity(currentQty - 1)
  }, [canDecrement, currentQty, isUpdating])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setInputValue("")
      return
    }

    const parsed = parseInt(e.target.value, 10)
    if (!isNaN(parsed)) {
      setInputValue(parsed)
    }
  }

  const handleInputSubmit = async () => {
    if (inputValue === "") {
      setInputValue(currentQty)
      return
    }

    const targetQuantity =
      typeof inputValue === "string" ? parseInt(inputValue, 10) : inputValue

    await changeQuantity(targetQuantity)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleInputSubmit()
    }
  }

  if (isInventoryLoading && manageInventory) {
    return (
      <div className="flex items-center gap-2 opacity-50 pointer-events-none">
        <button className="w-10 h-10 border rounded">-</button>
        <div className="w-12 h-10 animate-pulse bg-gray-200 rounded"></div>
        <button className="w-10 h-10 border rounded">+</button>
      </div>
    )
  }

  return (
    <div
      className={`flex items-center gap-2 ${
        isUpdating ? "opacity-70 pointer-events-none" : ""
      }`}
    >
      <IncrementCartItem
        id={item.id}
        canIncrement={canIncrement}
        manageInventory={manageInventory}
        available={available}
        onIncrement={handleIncrement}
      />

      <Input
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputSubmit}
        onKeyDown={handleKeyDown}
        readOnly={isUpdating}
        className="w-16 h-10 text-center rounded font-semibold"
        aria-label="Product quantity"
      />

      <DecrementCartItem
        id={item.id}
        canDecrement={canDecrement}
        manageInventory={manageInventory}
        onIncrement={handleDecrement}
      />
    </div>
  )
}
