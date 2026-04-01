// modules/layout/components/inquiry-cart-dropdown/index.tsx
"use client"

import { Badge } from "@lib/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@lib/components/ui/popover"
import { useCustomer } from "@lib/context/customer-context"
import { convertToLocale } from "@lib/util/money"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ClipboardList } from "lucide-react" // 🎨 Changed Icon!
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState, useTransition } from "react"
import CartDropdownHeader from "@modules/common/components/cart-dropdown-header"
import CartDropdownItem from "@modules/cart/components/cart-dropdown-item"
import CartDropdownFooter from "@modules/cart/components/cart-dropdown-footer"
import EmptyCart from "@modules/common/components/empty-cart"
import { getTotalQuantity } from "@lib/util/get-total-quantity"

const InquiryCartDropdown = ({
  cart: cartState,
}: {
  cart?: any | null // Replace 'any' with your InquiryCart type
}) => {
  const router = useRouter()
  const { customer, isLoading, error } = useCustomer()
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timeout | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)
  const [isNavigating, startTransition] = useTransition()

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  // Calculate mathematically: $N_{total} = \sum_{i=1}^{n} quantity_i$
  const totalItems =
    cartState?.items?.reduce(
      (acc: number, item: any) => acc + item.quantity,
      0
    ) || 0
  const total = (cartState?.total ?? 0) - (cartState?.shipping_total ?? 0)

  const itemRef = useRef<number>(totalItems || 0)
  const pathname = usePathname()

  const timedOpen = () => {
    open()
    const timer = setTimeout(close, 5000)
    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) clearTimeout(activeTimer)
    // Don't open if we are already on the inquiry cart page
    if (!pathname.includes("ir/inquiry-cart")) {
      open()
    }
  }

  useEffect(() => {
    return () => {
      if (activeTimer) clearTimeout(activeTimer)
    }
  }, [activeTimer])

  useEffect(() => {
    if (
      itemRef.current !== totalItems &&
      !pathname.includes("ir/inquiry-cart")
    ) {
      timedOpen()
    }
    itemRef.current = totalItems
  }, [totalItems, pathname])

  const handleSubmitInquiry = () => {
    // Navigating to the inquiry submission page instead of standard checkout
    if (isLoading || error || !customer) {
      startTransition(() => {
        router.push("/account") // Or an inquiry-specific login
      })
    } else {
      startTransition(() => {
        router.push("/inquiry-checkout") // Update this route to your actual inquiry checkout page!
      })
    }
  }

  return (
    <div onMouseEnter={openAndCancel} onMouseLeave={close}>
      <Popover open={cartDropdownOpen}>
        <PopoverTrigger id="inquiry-cart-popover-trigger">
          <LocalizedClientLink
            href="/inquiry-cart"
            data-testid="nav-inquiry-cart-link"
          >
            <div className="flex items-center relative top-0.5">
              <ClipboardList size={25} className="text-orange-500" />{" "}
              {/* Different color/icon! */}
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute left-4 top-4 w-5 h-5 bg-orange-500"
                >
                  {totalItems}
                </Badge>
              )}
            </div>
          </LocalizedClientLink>
        </PopoverTrigger>

        <PopoverContent
          id="inquiry-cart-popover-content"
          onOpenAutoFocus={(e) => e.preventDefault()}
          align="center"
          side="bottom"
          style={{ width: "400px", maxHeight: "calc(100vh - 10rem)" }}
          className="rounded-xl left-6 top-4 shadow-custom border z-200 overflow-auto p-0 m-0 relative flex flex-col"
        >
          {/* Reusing your header, but you might want to pass a title prop if it says "Cart" hardcoded inside */}
          <CartDropdownHeader
            cartState={cartState}
            getTotalQuantity={getTotalQuantity}
            title="لیست استعلام شما"
            actionTitle="مشاهده لیست استعلام"
            href="/inquiry-cart"
          />

          {cartState && cartState.items?.length ? (
            <>
              <div className="max-w-full flex flex-col pb-2 px-4 md:px-8 overflow-x-hidden">
                {cartState.items
                  .sort((a: any, b: any) =>
                    (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                  )
                  .map((item: any) => (
                    <CartDropdownItem key={item.id} cartItem={item} />
                  ))}
              </div>
              <CartDropdownFooter
                total={total}
                isNavigating={isNavigating}
                isLoading={isLoading}
                error={error}
                customer={customer}
                convertToLocale={convertToLocale}
                handleLoginOrOrder={handleSubmitInquiry}
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

export default InquiryCartDropdown
