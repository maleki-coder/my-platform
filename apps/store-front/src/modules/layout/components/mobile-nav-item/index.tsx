"use client"

import { usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useSideBarSheet } from "@lib/hooks/use-side-bar-sheet"

type NavItemProps = {
  href: string
  icon: React.ReactNode
  label: string
  badge?: React.ReactNode
}

export function NavItem({ href, icon, label, badge }: NavItemProps) {
  const { open, closeSheet } = useSideBarSheet()
  const pathname = usePathname()
  const isActive =
    !open &&
    (href === "/" ? pathname === "/ir" : pathname.startsWith("/ir" + href))

  return (
    <LocalizedClientLink
      onClick={() => {
        if (open) closeSheet()
      }}
      href={href}
    >
      <div
        className={`relative flex flex-col gap-3 items-center justify-center grow min-w-20 max-[390px]:min-w-12 py-3.5 text-xs leading-4 font-medium border-t-2 transition-colors
          ${
            isActive
              ? "border-t-sky-700 bg-gray-100"
              : "text-gray-400 border-t-transparent"
          }
        `}
      >
        {icon}
        {badge}
        <span>{label}</span>
      </div>
    </LocalizedClientLink>
  )
}
