"use client"
import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import ReviewCartItem from "../review-cart-item"
import { CheckoutStepHeader } from "../checkout-step-header"
import Divider from "@modules/common/components/divider"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="bg-white flex flex-col gap-y-2">
      <div className="flex flex-row items-center justify-between">
        <CheckoutStepHeader isOpen={isOpen} title={"سفارش در یک نگاه"} />
        {isOpen && previousStepsCompleted &&
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        }
      </div>
      {isOpen && previousStepsCompleted && (
          <ReviewCartItem cart={cart} />
      )}
      <Divider className="mt-4" />
    </div>
  )
}

export default Review
