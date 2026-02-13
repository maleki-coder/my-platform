// components/mobile-account-content.tsx
"use client"

import { usePathname } from "next/navigation"
import AccountSidebar from "../account-side-bar"

interface MobileAccountContentProps {
  children: React.ReactNode
}

export function MobileAccountContent({ children }: MobileAccountContentProps) {
  const pathname = usePathname()
  const isAccountHome = pathname === "/account" || pathname === "/ir/account"

  return isAccountHome ? (
    <AccountSidebar />
  ) : (
    <div className="px-4 mx-auto w-full lg:px-2 xl:px-4 max-w-screen-2xl grow border py-4 bg-white md:rounded-sm">
      <div className="lg:p-4 p-0 flex flex-col items-center">{children}</div>
    </div>
  )
}
