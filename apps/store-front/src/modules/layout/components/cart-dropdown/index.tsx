"use client"

import { Badge } from "@lib/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@lib/components/ui/popover"
import { useCustomer } from "@lib/context/customer-context"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ShoppingCart } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState, useTransition } from "react"
import CartDropdownHeader from "../cart-dropdown-header"
import CartDropdownItems from "../cart-dropdown-items"
import CartDropdownFooter from "../cart-dropdown-footer"
import EmptyCart from "@modules/common/components/empty-cart"
import { getTotalQuantity } from "@lib/util/get-total-quantity"
function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}
const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const step = getCheckoutStep(cartState!)
  const router = useRouter()
  const { customer, isLoading, error } = useCustomer()
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timeout | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)
  const [isNavigating, startTransition] = useTransition()
  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const total = cartState?.total ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

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

  return (
    <div onMouseEnter={openAndCancel} onMouseLeave={close}>
      <Popover open={true}>
        <PopoverTrigger id="cart-popover-trigger">
          <LocalizedClientLink href="/cart" data-testid="nav-cart-link">
            <div className="flex items-center relative top-0.5">
              <ShoppingCart
                size={20}
                className="text-indigo-500"
              ></ShoppingCart>
              {totalItems > 0 && (
                <Badge
                  variant="default"
                  className="absolute left-4 top-4 w-5 h-5"
                >
                  {totalItems}
                </Badge>
              )}
            </div>
          </LocalizedClientLink>
        </PopoverTrigger>

        <PopoverContent
          id="cart-popover-content"
          onOpenAutoFocus={(e) => e.preventDefault()}
          align="center"
          side="bottom"
          style={{ width: "400px", maxHeight: "calc(100vh - 10rem)" }}
          className="rounded-xl left-6 top-4 shadow-[0_4px_14px_-3px_rgba(0,0,0,0.22)] border z-200 overflow-auto p-0 m-0 relative flex flex-col"
        >
          <CartDropdownHeader
            cartState={cartState}
            getTotalQuantity={getTotalQuantity}
          />
          {cartState && cartState.items?.length ? (
            <>
              <CartDropdownItems cartState={cartState} />
              <CartDropdownFooter
                total={total}
                isNavigating={isNavigating}
                isLoading={isLoading}
                error={error}
                customer={customer}
                convertToLocale={convertToLocale}
                handleLoginOrOrder={handleLoginOrOrder}
              />
            </>
          ) : (
            <EmptyCart close={close} />
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default CartDropdown
