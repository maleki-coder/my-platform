"use client"

import { usePathname } from "next/navigation"
import MobileBottomNav from "@modules/layout/templates/mobile-bottom-nav"
import { HttpTypes } from "@medusajs/types"
import { CategoryWithImages } from "types/global"
import { MobileMenuSheet } from "../mobile-menu-sheet"

interface Props {
  cart: HttpTypes.StoreCart
  categories: CategoryWithImages[]
  footerNode: React.ReactNode 
}

export default function LayoutFooterController({
  cart,
  categories, 
  footerNode,
}: Props) {
  const pathname = usePathname() || "/"
  const normalizedPath = pathname.replace(/^\/(ir|en|de)(\/|$)/, "/")
  const MOBILE_NAV_ROUTES = ["/checkout", "/cart"]
  
  // We keep this JS logic because it depends on the URL route, not the screen size!
  const isMobileNavRoute = MOBILE_NAV_ROUTES.some(
    (route) =>
      normalizedPath === route || normalizedPath.startsWith(route + "/")
  )

  return (
    <>
      {/* 
        FOOTER CONTAINER 
        - Visibility: Hidden on mobile IF it's a nav route. ALWAYS visible on desktop.
        - Margins: Dynamically injected via CSS variables to avoid Tailwind compiler issues!
      */}
      <div 
        className={`max-w-screen-2xl w-full p-4 ${
          isMobileNavRoute ? "hidden md:block " : "block md:mb-0 mobile-footer-nav-route-bottom-margin"
        }`}
      >
        {footerNode}
      </div>

      {/* 
        MOBILE BOTTOM NAV 
        - Visibility: Native CSS ensures this is strictly hidden on Desktop! 
      */}
      <div className="block md:hidden">
        <MobileBottomNav cart={cart} />
      </div>

      {/* Assuming MobileMenuSheet handles its own responsive visibility internally */}
      <MobileMenuSheet categories={categories} />
    </>
  )
}
