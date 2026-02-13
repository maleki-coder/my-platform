"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronLeft } from "lucide-react"
import { HttpTypes } from "@medusajs/types"

type Props = {
  cartState?: HttpTypes.StoreCart | null
  getTotalQuantity: (items: { quantity: number }[]) => number
}

const CartDropdownHeader = ({ cartState, getTotalQuantity }: Props) => {
  return (
    <div className="sticky mx-3 my-2 rounded-md top-0 z-30 bg-blue-50 text-xs flex items-center justify-between px-4 py-3">
      <div className="flex items-center">
        <div className="font-black">سبد خرید شما</div>

        <div className="flex gap-1 ms-2 text-gray-600">
          {cartState?.items?.length! > 0 && (
            <>
              {getTotalQuantity(cartState?.items!)}
              <span>عدد کالا</span>
            </>
          )}
        </div>
      </div>

      <div className="flex text-xxs font-black text-blue-400 cursor-pointer">
        <LocalizedClientLink href="/cart" passHref>
          <span>مشاهده سبد خرید</span>
        </LocalizedClientLink>
        <span className="ms-2">
          <ChevronLeft size="16" />
        </span>
      </div>
    </div>
  )
}

export default CartDropdownHeader
