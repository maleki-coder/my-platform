"use client"

import { usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useSideBarSheet } from "@lib/hooks/use-side-bar-sheet"

type NavItemProps = {
  href: string
  icon: React.ReactNode
  label: string
  badge?: React.ReactNode
  className?: string
}

export function NavItem({ href, icon, label, badge, className }: NavItemProps) {
  const { open, closeSheet } = useSideBarSheet()
  const pathname = usePathname()
  const isActive =
    !open &&
    (href === "/" ? pathname === "/ir" : pathname.startsWith("/ir" + href))

  return (
    <LocalizedClientLink
      className="flex-1"
      onClick={() => {
        if (open) closeSheet()
      }}
      href={href}
    >
      <div
        className={`relative flex flex-col gap-3 items-center justify-center grow min-w-20 max-[390px]:min-w-12 py-3.5 text-xs leading-4 font-medium border-t-2 transition-colors
          ${isActive
            ? "border-t-sky-700 bg-gray-100"
            : "text-gray-400 border-t-transparent"
          }
          ${className}
        `}
      >
        <div className="relative">
          {icon}
          <span className="absolute -top-2 -left-2">{badge}</span>
        </div>
        <span>{label}</span>
      </div>
    </LocalizedClientLink>
  )
}
