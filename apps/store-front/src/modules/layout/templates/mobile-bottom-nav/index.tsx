import { Badge } from "@lib/components/ui/badge"
import { MOBILE_FOOTER_HEIGHT } from "@lib/util/constants"
import { HttpTypes } from "@medusajs/types"
import MobileCategoryButton from "@modules/layout/components/mobile-category-button"
import { NavItem } from "@modules/layout/components/mobile-nav-item"
import { ClipboardList, HomeIcon, ShoppingCart, UserIcon } from "lucide-react"
import { InquiryCartResponse } from "types/global"

export default function MobileBottomNav({
  cart: cartState,
  cartInquiry: cartInquiry
}: {
  cart?: HttpTypes.StoreCart | null
  cartInquiry? : InquiryCartResponse
}) {
  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0
  const totalInquiryItems =
    cartInquiry?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0
  return (
    <div className={`min-h-${MOBILE_FOOTER_HEIGHT} fixed bottom-0 left-0 right-0 w-full border-t-2 border-gray-300 bg-white z-2000`}>
      <div className="w-full mx-auto max-w-480">
        <div className="flex w-full justify-between items-center">
          <NavItem href="/" icon={<HomeIcon />} className="flex-1" label="خانه" />
          <MobileCategoryButton className="flex-1" />
          <NavItem
            className="flex-1"
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
          <NavItem
            className="flex-1"
            href="/inquiry-cart"
            icon={<ClipboardList className="text-orange-500" />}
            label="لیست استعلام"
            badge={
              totalInquiryItems > 0 ? (
                <Badge className="absolute top-6.5 left-8 w-5 h-5 bg-orange-500">
                  {totalInquiryItems}
                </Badge>
              ) : null
            }
          />
          {/* <NavItem className="flex-1" href="/blog" icon={<BookAIcon />} label="بلاگ" /> */}
          <NavItem className="flex-1" href="/account" icon={<UserIcon />} label="حساب" />
        </div>
      </div>
    </div>
  )
}
