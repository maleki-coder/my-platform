"use client"
import { useSideBarSheet } from "@lib/hooks/use-side-bar-sheet"
import { MenuIcon } from "lucide-react"
type MobileCategoryButtonProps = {
  className?: string
}
export default function MobileCategoryButton({ className }: MobileCategoryButtonProps) {
  const { toggleSheet, open } = useSideBarSheet()
  return (
    <div
      onClick={() => {
        toggleSheet()
      }}
      className={`cursor-pointer flex flex-col gap-3 items-center justify-center min-w-20 max-[390px]:min-w-10 py-3.5 text-xs leading-4 font-medium border-t-2 transition-colors
        ${open
          ? "border-t-sky-700 bg-gray-100"
          : "text-gray-400 border-t-transparent"
        }
        ${className}
      `}
    >
      <MenuIcon />
      <span>دسته بندی</span>
    </div>
  )
}
