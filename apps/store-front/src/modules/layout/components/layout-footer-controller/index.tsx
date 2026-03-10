"use client"
import { usePathname } from "next/navigation"
import Footer from "@modules/layout/templates/footer"
import MobileBottomNav from "@modules/layout/templates/mobile-bottom-nav"
import { HttpTypes, StoreCollection } from "@medusajs/types"
import { CategoryWithImages } from "types/global"
import { MobileMenuSheet } from "../mobile-menu-sheet"
import {
  MOBILE_FOOTER_HEIGHT_NAV_ROUTE,
  MOBILE_FOOTER_MARGIN,
} from "@lib/util/constants"

interface Props {
  cart: HttpTypes.StoreCart
  categories: CategoryWithImages[]
  collections: StoreCollection[]
  isMobile: boolean
}

export default function LayoutFooterController({
  cart,
  categories,
  collections,
  isMobile,
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
      {showFooter && (
        <Footer
          bottomMargin={footerBottomMargin}
          categories={categories}
          collections={collections}
        />
      )}
      {showMobileBottomNav && <MobileBottomNav cart={cart} />}
      <MobileMenuSheet categories={categories} />
    </>
  )
}
