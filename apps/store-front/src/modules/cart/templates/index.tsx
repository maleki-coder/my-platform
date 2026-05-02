"use client"
import ItemsTemplate from "@modules/cart/templates/items"
import Summary from "@modules/cart/templates/summary"
import EmptyCartMessage from "@modules/cart/components/empty-cart-message"
import { HttpTypes } from "@medusajs/types"
import CartDropdownItem from "@modules/cart/components/cart-dropdown-item"
import { useScrollVisibility } from "@lib/hooks/use-scroll-visibility"

const CartTemplate = ({
  cart,
}: {
  cart:
    | (HttpTypes.StoreCart & {
        promotions: HttpTypes.StorePromotion[]
      })
    | null
}) => {
  const isVisible = useScrollVisibility(10)
  return (
    <div
      className="max-w-screen-2xl px-4 mt-2 md:mt-8"
      data-testid="cart-container"
    >
      {cart?.items?.length ? (
        <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-16 gap-y-8">
          <div className="md:block hidden">
            <div className="flex flex-col bg-white gap-y-1">
              <ItemsTemplate cart={cart} />
            </div>
          </div>
          <div className="md:hidden block">
            <div className="max-w-full flex flex-col pb-2 px-4 md:px-8 overflow-x-hidden">
              {cart
                ?.items!.sort((a, b) =>
                  (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                )
                .map((item) => (
                  <CartDropdownItem key={item.id} cartItem={item} />
                ))}
            </div>
          </div>
          <div className="relative">
            <div
              style={isVisible ? { top: "8.5rem" } : { top: "5.5rem" }}
              className="flex flex-col gap-y-8 sticky"
            >
              {cart && cart.region && <Summary cart={cart} />}
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
