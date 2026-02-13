import { useEffect, useState } from "react"

export function useIsMobileNavigator(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const userAgent = navigator.userAgent

    const mobileRegex =
      /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i

    setIsMobile(mobileRegex.test(userAgent))
  }, [])

  return isMobile
}
