"use client"

import { StoreProductCategory } from "@medusajs/types"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"

type Props = {
  categories: StoreProductCategory[]
  "data-testid"?: string
}

export default function ChildCategoryChipsClient({
  categories,
  "data-testid": dataTestId,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return

    const amount = 200

    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  return (
    <nav
      data-testid={dataTestId}
      className="relative h-7.5 w-full mt-2"
      aria-label="child-category-chips"
    >
      <div ref={scrollRef} className="overflow-x-auto no-scrollbar cursor-auto">
        <ul className="flex h-7.5 gap-2.5 scroll-smooth">
          {categories.map((child) => (
            <li
              key={child.id}
              className="w-min cursor-pointer rounded-md border border-gray-300 xl:border-gray-400"
            >
              <Link
                className="block whitespace-nowrap px-6 pb-1.25 pt-1.75 text-xs text-gray-600"
                href={`/categories/${child.handle}`}
              >
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => scroll("left")}
        className="cursor-pointer absolute -left-8 top-0.75 hidden md:flex h-5.5 w-5.5 items-center justify-center rounded-full shadow-custom"
      >
        <ChevronLeft size={16} />
      </button>

      <button
        onClick={() => scroll("right")}
        className="cursor-pointer absolute -right-8 top-0.75 hidden md:flex h-5.5 w-5.5 items-center justify-center rounded-full shadow-custom"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  )
}
