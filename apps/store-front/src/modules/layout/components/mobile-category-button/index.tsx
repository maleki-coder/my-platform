"use client"
import { useSideBarSheet } from "@lib/hooks/use-side-bar-sheet"
import { MenuIcon } from "lucide-react"
export default function MobileCategoryButton() {
  const { toggleSheet, open } = useSideBarSheet()
  return (
    <div
      onClick={() => {
        toggleSheet()
      }}
      className={`flex flex-col gap-3 items-center justify-center min-w-20 py-3.5 pb-8 text-xs leading-4 font-medium border-t-2 transition-colors
        ${
          open
            ? "border-t-sky-700 bg-gray-100"
            : "text-gray-400 border-t-transparent"
        }
      `}
    >
      <MenuIcon />
      <span>دسته بندی</span>
    </div>
  )
}
