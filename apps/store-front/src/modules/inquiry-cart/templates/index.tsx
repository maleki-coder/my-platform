import ItemsTemplate from "@modules/inquiry-cart/templates/items"
import { InquiryCartResponse } from "types/global"
import InquirySummary from "@modules/inquiry-cart/templates/inquiry-summary"

const InquiryCartTemplate = ({
  cart,
}: {
  cart: InquiryCartResponse | null
}) => {
  return (
    <div
      className="max-w-screen-2xl px-4 mt-8 md:mb-0 mb-24"
      data-testid="cart-container"
    >
      <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-16 gap-y-8">
        <div className="flex flex-col bg-white gap-y-1">
          <ItemsTemplate cart={cart || ([] as any)} />
        </div>
        <div className="relative">
          <div className="flex flex-col gap-y-8 sticky top-12">
            <InquirySummary cart={cart} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default InquiryCartTemplate
