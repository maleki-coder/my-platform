"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import React from "react"

type LocalizedClientLinkProps = {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: () => void
  passHref?: true
  backTo?: boolean | string // true = auto-capture current path, string = custom path
  [x: string]: any
}

const LocalizedClientLink = ({
  children,
  href,
  className,
  backTo,
  ...props
}: LocalizedClientLinkProps) => {
  const { countryCode } = useParams()
  const pathname = usePathname()

  // Build the base URL with country code
  const baseHref = `/${countryCode}${href}`

  // Handle backTo query parameter
  let finalHref = baseHref
  if (backTo) {
    let backToPath: string

    if (typeof backTo === "string") {
      // Use custom path provided
      backToPath = backTo
    } else {
      // Auto-capture current path
      const accountPath = `/${countryCode}/account`

      if (pathname.startsWith(`${accountPath}/`)) {
        // Path is like /en/account/orders -> capture /orders
        backToPath = pathname.replace(accountPath, "") || "/"
      } else if (pathname === accountPath) {
        // Exactly at /en/account -> capture root
        backToPath = "/"
      } else {
        // Not in account section, capture full path
        backToPath = pathname
      }
    }

    const encodedBackTo = encodeURIComponent(backToPath)
    const separator = href.includes("?") ? "&" : "?"
    finalHref = `${baseHref}${separator}backTo=${encodedBackTo}`
  }

  return (
    <Link className={className} href={finalHref} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
