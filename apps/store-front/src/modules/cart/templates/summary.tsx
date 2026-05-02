"use client"

import CartTotals from "@modules/common/components/cart-totals"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@lib/components/ui/button"
import { useTransition } from "react"
import { useCustomer } from "@lib/context/customer-context"
import { useRouter } from "next/navigation"
import { Spinner } from "@lib/components/ui/spinner"
import { FileSpreadsheet } from "lucide-react"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)
  const router = useRouter()
  const [isNavigating, startTransition] = useTransition()
  const { customer, isLoading, error } = useCustomer()
  const handleLoginOrOrder = () => {
    if (isLoading || error || !customer) {
      startTransition(() => {
        router.push("/account")
      })
    } else {
      startTransition(() => {
        router.push("/checkout?step=" + step)
      })
    }
  }

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
    <div className="flex flex-col gap-y-2 border border-gray-200 rounded-2xl p-6 bg-white shadow-custom md:mb-0 mb-44">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
          <FileSpreadsheet className="text-blue-600" />
          صورتحساب
        </h2>
      </div>
      <CartTotals totals={cart} cart={cart} />
      <div className="md:block hidden">
        <Button
          onClick={handleLoginOrOrder}
          className="w-full hover:bg-sky-700 bg-sky-700 cursor-pointer items-center justify-center text-white rounded-sm py-6"
        >
          {buttonContent}
        </Button>
      </div>
      <div className="md:hidden block">
        <div
          className={`fixed bottom-20 right-0 z-20 w-full border-t border-gray-300 bg-gray-3 px-6 py-4 bg-gray-100!`}
        >
          <Button
            onClick={handleLoginOrOrder}
            className="w-full hover:bg-sky-700 bg-sky-700 cursor-pointer items-center justify-center text-white rounded-sm py-6"
          >
            {buttonContent}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Summary
