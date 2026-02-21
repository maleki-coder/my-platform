// components/device-detector.tsx
"use client"

import { useEffect } from 'react'

export function DeviceDetector() {
  useEffect(() => {
    const updateDeviceCookie = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      document.cookie = `device=${isMobile ? 'mobile' : 'desktop'}; path=/; max-age=3600`
    }

    // Update on mount and resize
    updateDeviceCookie()
    window.addEventListener('resize', updateDeviceCookie)

    return () => window.removeEventListener('resize', updateDeviceCookie)
  }, [])

  return null // This component doesn't render anything
}