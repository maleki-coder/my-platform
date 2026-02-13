"use client"

import { useParams, usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  ListOrderedIcon,
  UserRoundPlusIcon,
  Edit2Icon,
  FileIcon,
  ChevronLeftIcon,
  LogOutIcon,
  BadgeCheckIcon,
} from "lucide-react"
import {
  Item,
  ItemContent,
  ItemActions,
  ItemTitle,
  ItemMedia,
} from "@lib/components/ui/item"
import { signout } from "@lib/data/customer"
import { useCustomer } from "@lib/context/customer-context"

const profileItems = [
  {
    name: "سفارش های من",
    redirectUrl: "/account/orders",
    icon: ListOrderedIcon,
  },
  {
    name: "ویرایش مشخصات فردی",
    redirectUrl: "/account/profile",
    icon: Edit2Icon,
  },
  { name: "لیست علاقه مندی", redirectUrl: "/account/edit", icon: FileIcon },
  { name: "نشانی ها", redirectUrl: "/account/addresses", icon: FileIcon },
]

export default function AccountSidebar() {
  const pathname = usePathname()
  const { countryCode } = useParams() as { countryCode: string }
  const { refreshCustomer } = useCustomer()
  const isAccountHome = pathname === "/account" || pathname === "/account/"
  const handleLogout = async () => {
    await signout(countryCode)
    await refreshCustomer()
  }
  return (
    <>
      {profileItems.map((item, i) => {
        const Icon = item.icon
        const isActive = pathname.startsWith("/ir" + item.redirectUrl)
        return (
          <Item
            key={i}
            size="sm"
            className={`rounded-none ${
              isActive ? "text-blue-600" : "text-gray-500"
            }`}
            asChild
          >
            <LocalizedClientLink href={item.redirectUrl} className="group">
              <Icon
                size={16}
                className={
                  isActive ? "text-blue-600" : "group-hover:text-blue-500"
                }
              />
              <ItemContent>
                <ItemTitle>{item.name}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <ChevronLeftIcon
                  className={
                    isActive ? "text-blue-600" : "group-hover:text-blue-500"
                  }
                />
              </ItemActions>
            </LocalizedClientLink>
          </Item>
        )
      })}
      <Item
        className="rounded-none border-t border-gray-300 border-x-0 border-b-0"
        variant="default"
        size="sm"
        asChild
        onClick={handleLogout}
      >
        <div className="group flex items-center gap-2 px-4 py-2 w-full cursor-pointer">
          <ItemMedia>
            <LogOutIcon className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="group-hover:text-blue-500 transition-colors">
              خروج
            </ItemTitle>
          </ItemContent>
        </div>
      </Item>
    </>
  )
}
