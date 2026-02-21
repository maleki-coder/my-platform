// modules/layout/components/header/index.tsx
import { Suspense } from "react"
import { ShoppingCart } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import HeaderSearchInput from "@modules/layout/components/search-input"
import HeaderIconBox from "@modules/layout/components/icon-box"
import HeaderNavBarBottom from "@modules/layout/components/navbar-bottom"
import HeaderNavBarBottomContent from "@modules/layout/components/navbar-bottom-content"
import { UserStatusButton } from "@modules/layout/components/user-status-button"
import Thumbnail from "@modules/products/components/thumbnail"
import { getDeviceFromCookie } from "@lib/util/get-deivce-from-cookie"

const LOGO_URL = "https://www.technolife.com/image/static_logo_techno_new.svg"

// Mobile header component
const MobileHeader = () => (
  <div className="flex w-full items-center justify-between">
    <LogoLink />
    <HeaderSearchInput />
  </div>
)

// Desktop navigation component
const DesktopNavigation = () => (
  <nav className="flex flex-start items-stretch h-9 gap-4">
    <UserStatusButton />
    <HeaderIconBox>
      <Suspense fallback={<CartFallback />}>
        <CartButton />
      </Suspense>
    </HeaderIconBox>
  </nav>
)

// Cart fallback for Suspense
const CartFallback = () => (
  <LocalizedClientLink
    className="flex gap-2"
    href="/cart"
    data-testid="nav-cart-link"
  >
    <ShoppingCart size={20} className="text-indigo-500" />
  </LocalizedClientLink>
)

// Logo link component
const LogoLink = () => (
  <LocalizedClientLink href="/store">
    <Thumbnail
      className="w-[60px]"
      thumbnail={LOGO_URL}
      images={null}
      rounded={false}
      objectFit="contain"
    />
  </LocalizedClientLink>
)

// Desktop bottom navbar component
const DesktopBottomNavBar = () => (
  <HeaderNavBarBottom>
    <HeaderNavBarBottomContent />
  </HeaderNavBarBottom>
)

// Main Header component
export default async function Header() {
  const { isMobile } = await getDeviceFromCookie()

  return (
    <header className="fixed max-h-32 w-full left-0 right-0 top-0 z-100 flex flex-col border-b border-brand-border bg-white">
      <div className="w-full mx-auto px-4 lg:px-8">
        <div className="flex w-full flex-col items-center justify-between py-1 md:pt-4">
          
          {/* Top header section */}
          <div className="flex w-full items-center justify-between md:pb-2.5">
            
            {/* Left section - Logo and Search */}
            <div className="flex w-full items-center">
              {isMobile ? (
                <MobileHeader />
              ) : (
                <div className="flex w-full items-center gap-1 md:gap-9">
                  <LogoLink />
                  <HeaderSearchInput />
                </div>
              )}
            </div>

            {/* Right section - Desktop navigation */}
            {!isMobile && <DesktopNavigation />}
          </div>

          {/* Bottom navbar - Desktop only */}
          {!isMobile && <DesktopBottomNavBar />}
          
        </div>
      </div>
    </header>
  )
}