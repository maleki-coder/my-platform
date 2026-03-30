"use client"

import { usePathname } from "next/navigation"
import MobileBottomNav from "@modules/layout/templates/mobile-bottom-nav"
import { HttpTypes } from "@medusajs/types"
import { CategoryWithImages } from "types/global"
import { MobileMenuSheet } from "../mobile-menu-sheet"
import {
  MOBILE_FOOTER_HEIGHT_NAV_ROUTE,
  MOBILE_FOOTER_MARGIN,
} from "@lib/util/constants"

interface Props {
  cart: HttpTypes.StoreCart
  categories: CategoryWithImages[]
  isMobile: boolean
  // پراپ جدید برای دریافت فوتر از سمت سرور
  footerNode: React.ReactNode 
}

export default function LayoutFooterController({
  cart,
  categories, 
  isMobile,
  footerNode, // دریافت از والد
}: Props) {
  const pathname = usePathname() || "/"
  const normalizedPath = pathname.replace(/^\/(ir|en|de)(\/|$)/, "/")
  const MOBILE_NAV_ROUTES = ["/checkout", "/cart"]
  const isMobileNavRoute = MOBILE_NAV_ROUTES.some(
    (route) =>
      normalizedPath === route || normalizedPath.startsWith(route + "/")
  )
  
  const showFooter = !isMobile || (isMobile && !isMobileNavRoute)
  const footerBottomMargin =
    isMobile && !isMobileNavRoute
      ? MOBILE_FOOTER_HEIGHT_NAV_ROUTE
      : MOBILE_FOOTER_MARGIN
      
  const showMobileBottomNav = isMobile

  return (
    <>
      {/* رندر شرطی فوتر کلاینت، اما خود فوتر در سرور تولید شده است */}
      {showFooter && (
        <div className="max-w-screen-2xl w-full"  style={{ marginBottom: footerBottomMargin }}>
          {footerNode}
        </div>
      )}
      {showMobileBottomNav && <MobileBottomNav cart={cart} />}
      <MobileMenuSheet categories={categories} />
    </>
  )
}
