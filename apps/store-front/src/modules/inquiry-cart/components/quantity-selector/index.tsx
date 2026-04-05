"use client"

import { Input } from "@lib/components/ui/input"
import { updateInquiryItem, updateLineItem } from "@lib/data/cart"
import DecrementCartItem from "@modules/inquiry-cart/components/decrement-cart-item"
import IncrementCartItem from "@modules/inquiry-cart/components/increment-cart-item.tsx"
import { useCallback, useEffect, useState } from "react"
import { InquiryCartItem } from "types/global"

interface QuantitySelectorProps {
  item: InquiryCartItem
  countryCode: string
}

export function QuantitySelector({ item, countryCode }: QuantitySelectorProps) {
  const currentQty = item.quantity || 1
  const [inputValue, setInputValue] = useState<string | number>(currentQty)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setInputValue(currentQty)
  }, [currentQty])

  const changeQuantity = async (newQuantity: number) => {
    let validQuantity = Math.max(1, newQuantity)
    if (validQuantity === currentQty) {
      setInputValue(currentQty)
      return
    }
    setIsUpdating(true)
    try {
      let body: InquiryCartItem = {
        title: item.title,
        quantity: newQuantity,
      }
      await updateInquiryItem(item.id!, body).finally(() => {
        setInputValue(validQuantity)
      })
    } catch (error) {
      console.error("Failed to update quantity:", error)
      setInputValue(currentQty)
    } finally {
      setIsUpdating(false)
    }
  }

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

  return (
    <div
      className={`flex items-center gap-2 ${
        isUpdating ? "opacity-70 pointer-events-none" : ""
      }`}
    >
      <IncrementCartItem item={item} />

      <Input
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputSubmit}
        onKeyDown={handleKeyDown}
        readOnly={isUpdating}
        className="w-16 h-10 text-center rounded font-semibold"
        aria-label="Product quantity"
      />

      <DecrementCartItem item={item} canDecrement={item.quantity > 1} />
    </div>
  )
}
