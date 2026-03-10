import ItemsTemplate from "@modules/cart/templates/items"
import Summary from "@modules/cart/templates/summary"
import EmptyCartMessage from "@modules/cart/components/empty-cart-message"
import { HttpTypes } from "@medusajs/types"
import CartDropdownItem from "@modules/layout/components/cart-dropdown-item"

const CartTemplate = ({
  cart,
}: {
  cart:
    | (HttpTypes.StoreCart & {
        promotions: HttpTypes.StorePromotion[]
      })
    | null
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
                    <CartDropdownItem cartItem={item} />
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

export default CartTemplate
