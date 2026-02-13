import React from "react"
import { HttpTypes } from "@medusajs/types"
import { ArrowRightIcon, User2Icon } from "lucide-react"
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@lib/components/ui/item"
import AccountSidebar from "../components/account-side-bar"
import { MobileAccountContent } from "../components/mobile-account-content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1" data-testid="account-page">
      <div className="mx-auto w-full max-w-7xl lg:px-28">
        <div className="flex flex-col items-stretch gap-3 py-2 lg:flex-row lg:flex-wrap lg:py-6">
          <div className="w-full lg:w-[168px] xl:w-[268px] flex items-center">
            <Item variant="default" size="sm">
              <LocalizedClientLink href={"/account"}>
                <div className="lg:hidden cursor-pointer">
                  <ArrowRightIcon />
                </div>
              </LocalizedClientLink>
              <LocalizedClientLink className="flex" href={"/account"}>
                <ItemMedia className="pe-2">
                  <User2Icon className="size-5" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="font-bold text-lg">
                    {customer?.first_name + " " + customer?.last_name}
                  </ItemTitle>
                </ItemContent>
              </LocalizedClientLink>
            </Item>
          </div>
        </div>
        <div className="hidden justify-between lg:mb-5 lg:flex">
          <div className="hidden w-full flex-col lg:flex lg:w-[180px] xl:w-[280px] lg:gap-1">
            <AccountSidebar />
          </div>
          <div className="px-4 mx-auto w-full max-w-screen-2xl hidden grow border bg-white lg:block lg:max-w-[calc(100%-180px)] xl:max-w-[calc(100%-280px)] rounded-sm">
            <div className="lg:p-6 p-0 flex flex-col items-center">
              {children}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col lg:hidden">
          <MobileAccountContent>{children}</MobileAccountContent>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
