import { headers } from "next/headers"

/**
 * Reusable utility to detect device type on the Server Side.
 * Usage: const { isMobile, userAgent } = await getDevice();
 */
export async function getDevice() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") || ""

  // A more robust regex covering modern mobile browsers and tablets
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)

  return {
    isMobile,
    userAgent,
    isDesktop: !isMobile,
  }
}