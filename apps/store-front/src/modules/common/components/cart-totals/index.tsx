"use client"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import React from "react"

type CartTotalsProps = {
  cart?: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    // currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const {
    // currency_code,
    total,
    // tax_total,
    item_subtotal,
    shipping_subtotal,
    discount_subtotal,
  } = totals
  // const mycart = cart;
  return (
    <div className="mt-1.5 w-full">
      <div className="flex flex-col rounded-t-2xl px-8 pt-8 pb-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
        <div className=" flex flex-col gap-4">
          <div className="flex justify-between">
            <p className="text-sm font-medium text-shadow-2xs">قیمت محصولات</p>
            <p className="text-sm font-medium text-shadow-2xs">
              {convertToLocale({ amount: item_subtotal ?? 0 })}
              <span className="text-shadow-2xs text-xs font-medium mr-1">
                تومان
              </span>
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semiBold text-red-500">تخفیف محصولات</p>
            <p className="text-sm font-semiBold text-red-500">
              {convertToLocale({
                amount: discount_subtotal ?? 0,
              })}
              <span className="font-medium mr-1 text-xs">تومان</span>
            </p>
          </div>
          {shipping_subtotal! > 0 && (
            <div className="flex justify-between">
              <p className="text-sm font-semiBold text-red-500">هزینه ارسال</p>
              <p className="text-sm font-semiBold text-red-500">
                {convertToLocale({
                  amount: shipping_subtotal ?? 0,
                })}
                <span className="font-medium mr-1 text-xs">تومان</span>
              </p>
            </div>
          )}
          <div className="flex justify-between">
            <p className="text-sm font-semiBold">جمع کل</p>
            <p className="text-sm font-medium text-shadow-2xs">
              {convertToLocale({ amount: total ?? 0 })}
              <span className="font-medium mr-1 text-xs">تومان</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartTotals
