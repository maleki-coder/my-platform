import { ShoppingCart } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import { Suspense } from "react"
import HeaderSearchInput from "@modules/layout/components/search-input"
import HeaderIconBox from "@modules/layout/components/icon-box"
import HeaderNavBarBottom from "@modules/layout/components/navbar-bottom"
import HeaderNavBarBottomContent from "@modules/layout/components/navbar-bottom-content"
import { UserStatusButton } from "@modules/layout/components/user-status-button"
import { getDevice } from "@lib/util/get-device"
import Thumbnail from "@modules/products/components/thumbnail"

export default async function Header() {
  const { isMobile } = await getDevice()
  return (
    <header className="fixed max-h-32 w-full left-0 right-0 top-0 z-100 flex flex-col border-b border-brand-border bg-white">
      <div className="w-full mx-auto px-4 lg:px-8">
        <div className="flex w-full flex-col items-center justify-between py-1 md:pt-4">
          <div className="flex w-full items-center justify-between md:pb-2.5">
            <div className="flex w-full items-center">
              <div
                className={`flex w-full items-center gap-1 md:gap-9 ${
                  isMobile ? "justify-between" : ""
                }`}
              >
                <LocalizedClientLink href="/store">
                  <Thumbnail
                    className="w-[60px]"
                    thumbnail={
                      "https://www.technolife.com/image/static_logo_techno_new.svg"
                    }
                    images={null}
                    rounded={false}
                    objectFit="contain"
                  />
                </LocalizedClientLink>
                <HeaderSearchInput />
              </div>
            </div>
            {!isMobile && (
              <nav className="flex flex-start items-stretch h-9 gap-4">
                <UserStatusButton />
                <HeaderIconBox>
                  <Suspense
                    fallback={
                      <LocalizedClientLink
                        className="flex gap-2"
                        href="/cart"
                        data-testid="nav-cart-link"
                      >
                        <ShoppingCart
                          size={20}
                          className="text-indigo-500"
                        ></ShoppingCart>
                      </LocalizedClientLink>
                    }
                  >
                    <CartButton />
                  </Suspense>
                </HeaderIconBox>
              </nav>
            )}
          </div>
          {!isMobile && (
            <HeaderNavBarBottom>
              <HeaderNavBarBottomContent />
            </HeaderNavBarBottom>
          )}
        </div>
      </div>
    </header>
  )
}
