import { Badge } from "@lib/components/ui/badge"
import { HttpTypes } from "@medusajs/types"
import MobileCategoryButton from "@modules/layout/components/mobile-category-button"
import { NavItem } from "@modules/layout/components/mobile-nav-item"
import { BookAIcon, HomeIcon, ShoppingCart, UserIcon } from "lucide-react"
import { CategoryWithImages } from "types/global"

export default function MobileBottomNav({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) {
  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0
  return (
    <div className="fixed bottom-0 left-0 w-full border-t-2 border-gray-300 bg-white z-2000">
      <div className="w-full mx-auto max-w-480 min-h-20">
        <div className="flex w-full justify-between items-center">
          <NavItem href="/" icon={<HomeIcon />} label="خانه" />
          <MobileCategoryButton />
          <NavItem
            href="/cart"
            icon={<ShoppingCart />}
            label="سبد خرید"
            badge={
              totalItems > 0 ? (
                <Badge className="absolute top-6.5 left-8 w-5 h-5">
                  {totalItems}
                </Badge>
              ) : null
            }
          />
          <NavItem href="/blog" icon={<BookAIcon />} label="بلاگ" />
          <NavItem href="/account" icon={<UserIcon />} label="حساب" />
        </div>
      </div>
    </div>
  )
}
