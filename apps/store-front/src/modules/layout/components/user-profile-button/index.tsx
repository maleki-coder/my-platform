"use client"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@lib/components/ui/item"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@lib/components/ui/popover"
import { useCustomer } from "@lib/context/customer-context"
import { signout } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  ChevronLeftIcon,
  Edit2Icon,
  FileIcon,
  ListOrderedIcon,
  LogOutIcon,
  User2Icon,
  UserRoundPlusIcon,
} from "lucide-react"
import { useParams } from "next/navigation"
import React from "react"
import { useEffect, useState } from "react"

export const UserProfileButton = () => {
  const { countryCode } = useParams() as { countryCode: string }
  const { refreshCustomer } = useCustomer()
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timeout | undefined>(
    undefined
  )
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  const open = () => setProfileDropdownOpen(true)
  const close = () => setProfileDropdownOpen(false)

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }
    open()
  }
  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const handleLogout = async () => {
    await signout(countryCode)
    await refreshCustomer()
  }

  const profileItems = [
    {
      name: "حساب کاربری",
      redirectUrl: "/account",
      icon: <UserRoundPlusIcon size={16} />,
    },
    {
      name: "ویرایش مشخصات فردی",
      redirectUrl: "/account/profile",
      icon: <Edit2Icon size={16} />,
    },
    {
      name: "لیست علاقه مندی",
      redirectUrl: "/account/like",
      icon: <FileIcon size={16} />,
    },
    {
      name: "سفارش های من",
      redirectUrl: "/account/orders",
      icon: <ListOrderedIcon size={16} />,
    },
  ]
  return (
    <div onMouseEnter={openAndCancel} onMouseLeave={close}>
      <Popover open={profileDropdownOpen}>
        <PopoverTrigger id="profile-popover-trigger">
          <LocalizedClientLink href="/account" data-testid="nav-cart-link">
            <div className="flex items-center relative top-0.5">
              <User2Icon size={20} className="text-indigo-500"></User2Icon>
            </div>
          </LocalizedClientLink>
        </PopoverTrigger>

        <PopoverContent
          id="profile-popover-content"
          onOpenAutoFocus={(e) => e.preventDefault()}
          align="center"
          side="bottom"
          style={{ width: "300px", maxHeight: "calc(100vh - 10rem)" }}
          className="rounded-xl shadow-[0_4px_14px_-3px_rgba(0,0,0,0.22)] left-18 top-4 border z-200 overflow-auto py-4 px-0 m-0 relative flex flex-col gap-2"
        >
          {profileItems.map((item, index) => (
            <Item
              key={index}
              className="text-gray-500 rounded-none"
              variant="default"
              size="sm"
              asChild
            >
              <LocalizedClientLink
                href={item.redirectUrl}
                data-testid="profile-links"
                className="group"
              >
                {React.cloneElement(item.icon, {
                  className: "group-hover:text-blue-500 transition-colors",
                })}
                <ItemContent>
                  <ItemTitle>{item.name}</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <ChevronLeftIcon className="size-4 group-hover:text-blue-500 transition-colors" />
                </ItemActions>
              </LocalizedClientLink>
            </Item>
          ))}
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
        </PopoverContent>
      </Popover>
    </div>
  )
}
