// modules/layout/components/header/index.tsx
import { Suspense } from "react"
import { ClipboardList, ShoppingCart } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/cart/components/cart-button"
import HeaderSearchInput from "@modules/layout/components/search-input"
import HeaderIconBox from "@modules/layout/components/icon-box"
import HeaderNavBarBottom from "@modules/layout/components/navbar-bottom"
import HeaderNavBarBottomContent from "@modules/layout/components/navbar-bottom-content"
import { UserStatusButton } from "@modules/layout/components/user-status-button"
import Thumbnail from "@modules/products/components/thumbnail"
import { DESKTOP_HEADER_HEIGHT } from "@lib/util/constants"
import InquiryCartButton from "@modules/inquiry-cart/components/inquiry-cart-button"

const LOGO_URL = "https://www.technolife.com/image/static_logo_techno_new.svg"

// Desktop navigation component (Hidden on mobile via Tailwind)
const DesktopNavigation = () => (
  <nav className="hidden md:flex flex-start items-stretch gap-4">
    <UserStatusButton />

    {/* Inquiry Cart Engine */}
    <HeaderIconBox>
      <Suspense fallback={<InquiryCartFallback />}>
        <InquiryCartButton />
      </Suspense>
    </HeaderIconBox>

    <HeaderIconBox>
      <Suspense fallback={<CartFallback />}>
        <CartButton />
      </Suspense>
    </HeaderIconBox>
  </nav>
)

const InquiryCartFallback = () => (
  <LocalizedClientLink
    className="flex gap-2"
    href="/inquiry-cart"
    data-testid="nav-inquiry-cart-link"
  >
    <ClipboardList size={20} className="text-orange-500" />
  </LocalizedClientLink>
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
  <LocalizedClientLink href="/">
    <Thumbnail
      className="min-w-32 min-h-10"
      thumbnail={LOGO_URL}
      images={null}
      rounded={false}
      objectFit="contain"
    />
  </LocalizedClientLink>
)

// Desktop bottom navbar component (Hidden on mobile via Tailwind)
const DesktopBottomNavBar = () => (
  <div className="hidden md:block w-full">
    <HeaderNavBarBottom>
      <HeaderNavBarBottomContent />
    </HeaderNavBarBottom>
  </div>
)

// Main Header component
export default function Header() {
  return (
    <header
      className={`mx-auto w-full max-w-screen-2xl fixed max-h-${DESKTOP_HEADER_HEIGHT} w-full left-0 right-0 top-0 z-100 flex flex-col border-b border-brand-border bg-white`}
    >
      <div className="w-full mx-auto px-4 md:px-8">
        <div className="flex w-full flex-col items-center justify-between py-1 md:pt-4">
          {/* Top header section */}
          <div className="flex w-full items-center justify-between gap-4 md:pb-2.5">
            
            {/* Left section - Logo and Search (Merged logic for CSS responsiveness) */}
            <div className="flex w-full items-center justify-between md:justify-start md:gap-8">
              <LogoLink />
              <HeaderSearchInput />
            </div>

            {/* Right section - Desktop navigation */}
            <DesktopNavigation />
            
          </div>

          {/* Bottom navbar - Desktop only */}
          <DesktopBottomNavBar />
        </div>
      </div>
    </header>
  )
}
