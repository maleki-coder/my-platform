// lib/util/get-device-from-cookie.ts
import { cookies } from 'next/headers'

export async function getDeviceFromCookie() {
  const cookieStore = await cookies()
  const deviceCookie = cookieStore.get('device')
  
  const isMobile = deviceCookie?.value === 'mobile'
  
  return {
    isMobile,
    isDesktop: !isMobile,
    deviceType: deviceCookie?.value || 'desktop', // default to desktop if no cookie
  }
}