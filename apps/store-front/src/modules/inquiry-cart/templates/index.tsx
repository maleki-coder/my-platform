import ItemsTemplate from "@modules/inquiry-cart/templates/items"
import Summary from "@modules/inquiry-cart/templates/summary"
import EmptyCartMessage from "@modules/inquiry-cart/components/empty-cart-message"
import InquiryCartDropdownItem from "@modules/inquiry-cart/components/inquiry-cart-dropdown-item"
import { InquiryCartResponse } from "types/global"

const InquiryCartTemplate = ({
  cart,
}: {
  cart: InquiryCartResponse | null
}) => {
  return (
    <div
      className="content-container md:px-12 px-0 mt-2 md:mt-8"
      data-testid="cart-container"
    >
      {cart?.items?.length ? (
        <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-16">
          <div className="flex flex-col bg-white gap-y-6">
            <div className="md:block hidden">
              <ItemsTemplate cart={cart} />
            </div>
            <div className="md:hidden block">
              <div className="max-w-full flex flex-col pb-2 px-4 md:px-8 overflow-x-hidden">
                {cart
                  ?.items!.sort((a, b) =>
                    (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                  )
                  .map((item) => (
                    <InquiryCartDropdownItem key={item.id} cartItem={item} />
                  ))}
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="flex flex-col gap-y-8 sticky top-12">
              {cart && cart.region && (
                <div className="bg-white">
                  <Summary cart={cart} />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <EmptyCartMessage />
        </div>
      )}
    </div>
  )
}

export default InquiryCartTemplate
