"use client"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Footer from "@modules/layout/templates/footer"
import MobileBottomNav from "@modules/layout/templates/mobile-bottom-nav"
import { StoreCollection } from "@medusajs/types"
import { CategoryWithImages } from "types/global"
import { MobileMenuSheet } from "../mobile-menu-sheet"

interface Props {
  cart: any
  categories: CategoryWithImages[]
  collections: StoreCollection[]
}

export default function LayoutFooterController({
  cart,
  categories,
  collections,
}: Props) {
  const pathname = usePathname() || "/"
  const normalizedPath = pathname.replace(/^\/(ir|en|de)(\/|$)/, "/")
  const MOBILE_NAV_ROUTES = ["/checkout", "/cart"]
  const isMobileNavRoute = MOBILE_NAV_ROUTES.some(
    (route) =>
      normalizedPath === route || normalizedPath.startsWith(route + "/")
  )

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent
      setIsMobile(
        /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
          userAgent
        )
      )
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const showFooter = !isMobile || (isMobile && !isMobileNavRoute);
  const footerBottomMargin = (isMobile && !isMobileNavRoute) ? '7rem' : "2rem";
  const showMobileBottomNav = isMobile;

  return (
    <>
      {showFooter && (
        <Footer bottomMargin={footerBottomMargin} categories={categories} collections={collections} />
      )}
      {showMobileBottomNav && <MobileBottomNav cart={cart}/>}
      <MobileMenuSheet categories={categories}/>
    </>
  )
}
