"use client"

import { createPortal } from "react-dom"
import { useEffect, useState } from "react"
import { CategoryWithImages } from "types/global"
import { AppSidebar } from "../sidebar"

type Props = {
  categories: CategoryWithImages[]
}

export function SidebarPortal({ categories }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <AppSidebar categories={categories} />,
    document.body
  )
}
