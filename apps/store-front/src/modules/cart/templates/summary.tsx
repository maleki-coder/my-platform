"use client"

import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@lib/components/ui/button"
import { useState, useEffect, useTransition } from "react"
import { useCustomer } from "@lib/context/customer-context"
import { useRouter } from "next/navigation"
import { Spinner } from "@lib/components/ui/spinner"

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
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const [isNavigating, startTransition] = useTransition()
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent
      setIsMobile(
        /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
          userAgent
        )
      )
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])
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
    <div
      style={{
        marginBottom: isMobile ? "10rem" : undefined,
      }}
      className="flex flex-col gap-y-3"
    >
      <header className="flex md:px-2 px-8">
        <p className="text-lg font-bold">صورتحساب</p>
      </header>
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
        <div className="fixed bottom-20 right-0 z-20 w-full border-t border-gray-300 bg-gray-3 px-6 py-4 bg-gray-100!">
          <Button
            onClick={handleLoginOrOrder}
            className="w-full hover:bg-sky-700 bg-sky-700 cursor-pointer items-center justify-center text-white rounded-sm py-6"
          >
            {buttonContent}
          </Button>
        </div>
      </div>
      <DiscountCode cart={cart} />
    </div>
  )
}

export default Summary
