import { MOBILE_REGEX } from "@lib/util/constants"
import { useEffect, useState } from "react"

export function useIsMobileNavigator(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const userAgent = navigator.userAgent

    setIsMobile(MOBILE_REGEX.test(userAgent))
  }, [])

  return isMobile
}
