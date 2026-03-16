"use client"
import { ChevronUp } from "lucide-react"

export default function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <button 
      onClick={scrollToTop}
      className="transition-all relative rounded-xl p-4 bg-primary-shade text-white cursor-pointer flex h-9! w-full! items-center gap-2 justify-center bg-white! 2md:!h-12 px-5.5! 2md:!px-8"
      aria-label="بازگشت به بالای صفحه"
    >
      <ChevronUp className="fill-primary w-4 h-4 md:w-7 md:h-7" />
      <span className="select-none pt-1 lg:font-medium text-primary text-sm leading-4.5">
        بازگشت به بالا
      </span>
    </button>
  )
}
