import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import { HttpTypes } from "@medusajs/types"
import CartDropdownItems from "@modules/layout/components/cart-dropdown-items"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart:
    | (HttpTypes.StoreCart & {
        promotions: HttpTypes.StorePromotion[]
      })
    | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div
      className="content-container md:px-12 px-0 mt-8"
      data-testid="cart-container"
    >
      {cart?.items?.length ? (
        <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-16">
          <div className="flex flex-col bg-white gap-y-6">
            <div className="md:block hidden">
              <ItemsTemplate cart={cart} />
            </div>
            <div className="md:hidden block">
              <CartDropdownItems cartState={cart} />
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

export default CartTemplate
