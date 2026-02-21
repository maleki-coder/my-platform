"use client"

import { RadioGroup } from "@headlessui/react"
import { paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import { CheckoutStepHeader } from "@modules/checkout/components/checkout-step-header"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState, useTransition } from "react"
import { Button } from "@lib/components/ui/button"
import { Spinner } from "@lib/components/ui/spinner"
import { ChevronLeft, CoinsIcon } from "lucide-react"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isNavigating, startTransition] = useTransition()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    // if (isStripeLike(method)) {
    await initiatePaymentSession(cart, {
      provider_id: method,
    })
    // }
  }
  const paymentReady = activeSession && cart?.shipping_methods.length !== 0

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    startTransition(() => {
      router.push(pathname + "?" + createQueryString("step", "payment"), {
        scroll: false,
      })
    })
  }

  const handleSubmit = async () => {
    try {
      if (selectedPaymentMethod) {
        setIsLoading(true)
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
        return startTransition(() => {
          router.push(pathname + "?" + createQueryString("step", "review"), {
            scroll: false,
          })
        })
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-white flex flex-col gap-y-2">
      <div className="flex flex-row items-center justify-between">
        <CheckoutStepHeader isOpen={isOpen} title={"روش پرداخت"} />
      </div>
      {isOpen ? (
        <>
          {availablePaymentMethods?.length && (
            <RadioGroup
              value={selectedPaymentMethod}
              onChange={(value: string) => setPaymentMethod(value)}
            >
              {availablePaymentMethods.map((paymentMethod) => (
                <div key={paymentMethod.id}>
                  <PaymentContainer
                    paymentInfoMap={paymentInfoMap}
                    paymentProviderId={paymentMethod.id}
                    selectedPaymentOptionId={selectedPaymentMethod}
                  />
                </div>
              ))}
            </RadioGroup>
          )}
          <div className="flex justify-end">
            <Button
              disabled={!selectedPaymentMethod || isLoading}
              onClick={handleSubmit}
              className="cursor-pointer text-xs w-22 h-fit"
              data-testid="submit-delivery-option-button"
            >
              {isNavigating ? <Spinner /> : <span>ادامه خرید</span>}
            </Button>
            <ErrorMessage
              error={error}
              data-testid="delivery-option-error-message"
            />
          </div>
        </>
      ) : (
        <>
          {activeSession ? (
            <div className="text-small-regular">
              <div className="flex justify-between rounded-2xl border-none bg-indigo-50 px-8 py-5">
                <div className="flex max-w-[64%] items-center gap-6">
                  <div className="flex w-full flex-col gap-y-1.5">
                    <div className="flex items-center gap-3 leading-9 xl:leading-7.5 text-sm font-medium text-gray-800">
                      <span>
                        <CoinsIcon size={14} />
                      </span>
                      <span>روش پرداخت</span>
                      <span>
                        {paymentInfoMap[activeSession?.provider_id]?.title ||
                          activeSession?.provider_id}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-gray-600 flex shrink-0! items-center cursor-pointer gap-1.5">
                  <div
                    onClick={handleEdit}
                    className="inline-block text-sm leading-5 xl:text-sm"
                  >
                    {isNavigating ? <Spinner /> : <span>ویرایش</span>}
                  </div>
                  <ChevronLeft size={18} />
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
      <Divider className="mt-4" />
    </div>
  )
}

export default Payment
