"use client"

import { Button } from "@lib/components/ui/button"

type Props = {
  total: number
  isLoading: boolean
  error: any
  customer: any
  convertToLocale: (opts: { amount: number }) => string
  handleLoginOrOrder: () => void
}

const CartDropdownFooter = ({
  total,
  isLoading,
  error,
  customer,
  convertToLocale,
  handleLoginOrOrder,
}: Props) => {
  return (
    <div className="sticky bottom-0 border-t-2 p-4 w-full flex flex-col gap-y-4">
      <Button
        onClick={handleLoginOrOrder}
        className="flex bg-sky-700 cursor-pointer items-center justify-around text-white rounded-sm px-8 py-2"
      >
        {isLoading || error || !customer ? (
          <div className="font-semibold">ورود و ثبت سفارش</div>
        ) : (
          <div className="font-semibold">ادامه خرید‍</div>
        )}

        <span className="text-base">|</span>

        <div
          className="text-base font-medium flex gap-2 items-center"
          data-testid="cart-subtotal"
          data-value={total}
        >
          <span>{convertToLocale({ amount: total })}</span>
          <span className="text-xs">تومان</span>
        </div>
      </Button>
    </div>
  )
}

export default CartDropdownFooter
