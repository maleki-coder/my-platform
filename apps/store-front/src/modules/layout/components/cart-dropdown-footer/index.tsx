"use client"

import { Button } from "@lib/components/ui/button"
import { Spinner } from "@lib/components/ui/spinner"

type Props = {
  total: number
  isLoading: boolean
  isNavigating: boolean
  error: any
  customer: any
  convertToLocale: (opts: { amount: number }) => string
  handleLoginOrOrder: () => void
}

const CartDropdownFooter = ({
  total,
  isNavigating,
  isLoading,
  error,
  customer,
  convertToLocale,
  handleLoginOrOrder,
}: Props) => {
  const buttonContent = (() => {
    if (isLoading || error || !customer) {
      return <div className="font-semibold">ورود و ثبت سفارش</div>
    }
    if (isNavigating) {
      return <Spinner />
    }
    return <div className="font-semibold">ادامه خرید</div>
  })()
  return (
    <div className="sticky bottom-0 border-t-2 p-4 w-full flex flex-col gap-y-4">
      <Button
        onClick={handleLoginOrOrder}
        className="flex bg-sky-700 cursor-pointer items-center justify-between text-white rounded-sm px-8 py-2"
      >
        <div className="flex-1 flex justify-start">{buttonContent}</div>

        <span className="flex-none text-base">|</span>
        <div className="flex-1 flex justify-end">
          <div
            className="text-base font-medium flex gap-2 items-center"
            data-testid="cart-subtotal"
            data-value={total}
          >
            <span className="font-semibold">
              {convertToLocale({ amount: total })}
            </span>
            <span className="text-xs">تومان</span>
          </div>
        </div>
      </Button>
    </div>
  )
}

export default CartDropdownFooter
