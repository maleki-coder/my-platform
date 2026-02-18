"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripeLike, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
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
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
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
    if (isStripeLike(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

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
    setIsLoading(true)
    try {
      const shouldInputCard =
        isStripeLike(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputCard) {

        return startTransition(() => {
          router.push(
            pathname + "?" + createQueryString("step", "review"),
            {
              scroll: false,
            }
          )
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
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <CheckoutStepHeader
          isOpen={isOpen}
          title={"روش پرداخت"}
        />
      </div>
      {isOpen ? (
        <>
          {!paidByGiftcard && availablePaymentMethods?.length && (
            <>
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
            </>
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
        <div className="text-small-regular">
          {cart && (cart.shipping_methods?.length ?? 0) > 0 ? (
            <div className="flex justify-between mt-3 rounded-2xl border-none bg-indigo-50 px-8 py-5">
              <div className="flex max-w-[64%] items-center gap-6">
                <div className="flex w-full flex-col gap-y-1.5">
                  <div className="flex items-center gap-3 leading-9 xl:leading-7.5 text-sm font-medium text-gray-800">
                    {cart && paymentReady && activeSession ? (
                      <>
                        <span>
                          <CoinsIcon size={14} />
                        </span>
                        <span>روش پرداخت</span>
                        <span>
                          {paymentInfoMap[activeSession?.provider_id]?.title ||
                            activeSession?.provider_id}
                        </span>
                      </>
                    ) : paidByGiftcard ? (
                      <>
                        <span>
                          <CoinsIcon size={14} />
                        </span>
                        <span>روش پرداخت</span>
                        <span>کارت هدیه</span>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="text-gray-600 flex shrink-0! items-center cursor-pointer gap-1.5">
                {!isOpen && cart?.shipping_address && (
                  <>
                    <div
                      onClick={handleEdit}
                      className="inline-block text-sm leading-5 xl:text-sm"
                    >
                      {isNavigating ? <Spinner /> : <span>ویرایش</span>}
                    </div>
                    <ChevronLeft size={18} />
                  </>
                )}
              </div>
            </div>
          ) : (
            null
          )}
        </div>
      )}
      <div>
        <div className={isOpen ? "block" : "hidden"}>


          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <p className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </p>
              <p
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </p>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <button
            // size="large"
            className="mt-6"
            onClick={handleSubmit}
            // isLoading={isLoading}
            disabled={
              (isStripeLike(selectedPaymentMethod) && !cardComplete) ||
              (!selectedPaymentMethod && !paidByGiftcard)
            }
            data-testid="submit-payment-button"
          >
            {!activeSession && isStripeLike(selectedPaymentMethod)
              ? " Enter card details"
              : "Continue to review"}
          </button>
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment
