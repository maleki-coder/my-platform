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
    shipping_total?: number | null
    discount_subtotal?: number | null
    original_total?: number | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const {
    total,
    shipping_total,
    discount_subtotal,
    original_total,
  } = totals
  return (
    <div className="w-full">
      <div className="flex flex-col px-4 pt-8 pb-6">
        <div className=" flex flex-col gap-4">
          <div className="flex justify-between">
            <p className="text-sm font-semibold text-shadow-2xs">قیمت محصولات</p>
            <p className="text-sm font-semibold text-shadow-2xs">
              {convertToLocale({ amount: (original_total! - shipping_total!)})}
              <span className="text-shadow-2xs text-xs font-medium mr-1">
                تومان
              </span>
            </p>
          </div>
          {discount_subtotal! > 0 && (
            <div className="flex justify-between">
              <p className="text-sm font-semibold text-red-500">
                تخفیف محصولات
              </p>
              <p className="text-sm font-semibold text-red-500">
                {convertToLocale({
                  amount: discount_subtotal ?? 0,
                })}
                <span className="font-medium mr-1 text-xs">تومان</span>
              </p>
            </div>
          )}
          {shipping_total! > 0 && (
            <div className="flex justify-between">
              <p className="text-sm font-semibold text-red-500">
                هزینه بسته بندی و ارسال
              </p>
              <p className="text-sm font-semibold text-red-500">
                {convertToLocale({
                  amount: shipping_total ?? 0,
                })}
                <span className="font-medium mr-1 text-xs">تومان</span>
              </p>
            </div>
          )}
          <div className="flex justify-between">
            <p className="text-sm font-semibold">جمع کل</p>
            <p className="text-sm font-semibold text-shadow-2xs">
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
