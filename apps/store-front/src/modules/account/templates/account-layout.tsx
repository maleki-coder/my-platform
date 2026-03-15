"use client"
import React from "react"

// Types
import { HttpTypes } from "@medusajs/types"

// Icons
import { ArrowRightIcon, User2Icon } from "lucide-react"

// UI Components
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@lib/components/ui/item"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Layout Components
import AccountSidebar from "../components/account-side-bar"
import { MobileAccountContent } from "../components/mobile-account-content"
import { usePathname } from "next/navigation"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  const firstName = customer?.first_name || ""
  const lastName = customer?.last_name || ""
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "کاربر"
  const pathname = usePathname() || ""
  const isAccountHome =
    pathname.endsWith("/account") || pathname.endsWith("/account/")
  return (
    <main className="flex-1" data-testid="account-page">
      <div className="mx-auto w-full max-w-7xl lg:px-28">
        {/* Header Section */}
        <header className="flex flex-col items-stretch gap-3 py-2 lg:flex-row lg:flex-wrap lg:py-6">
          <div className="flex w-full items-center lg:w-42 xl:w-67">
            <Item variant="default" size="sm">
              {/* return button*/}
              {!isAccountHome && (
                <LocalizedClientLink
                  href="/account"
                  aria-label="بازگشت به منوی حساب کاربری"
                >
                  <div className="cursor-pointer lg:hidden">
                    <ArrowRightIcon className="size-5" />
                  </div>
                </LocalizedClientLink>
              )}
              {/* user name and icon*/}
              <LocalizedClientLink
                href="/account"
                className="flex items-center"
              >
                <ItemMedia className="pe-2">
                  <User2Icon className="size-5" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="text-lg font-bold">
                    {fullName}
                  </ItemTitle>
                </ItemContent>
              </LocalizedClientLink>
            </Item>
          </div>
        </header>

        {/* Desktop Layout */}
        <div className="hidden justify-between lg:mb-5 lg:flex">
          {/* side bar */}
          <aside className="hidden w-full flex-col lg:flex lg:w-45 lg:gap-1 xl:w-70">
            <AccountSidebar />
          </aside>

          {/* main content */}
          <section className="mx-auto hidden w-full max-w-screen-2xl grow rounded-sm border bg-white px-4 lg:block lg:max-w-[calc(100%-180px)] xl:max-w-[calc(100%-280px)]">
            <div className="flex flex-col items-center p-0 lg:p-6">
              {children}
            </div>
          </section>
        </div>

        {/* Mobile Layout */}
        <div className="flex w-full flex-col lg:hidden">
          <MobileAccountContent>{children}</MobileAccountContent>
        </div>
      </div>
    </main>
  )
}

export default AccountLayout
