"use client"

import { useCallback, useState } from "react"
import { Item, ItemContent, ItemTitle } from "@lib/components/ui/item"
import { CheckIcon, Layers, X } from "lucide-react"
import { Button } from "@lib/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@lib/components/ui/sheet"
import { Badge } from "@lib/components/ui/badge"
import { useSidebar } from "@lib/components/ui/sidebar"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { MOBILE_FOOTER_HEIGHT } from "@lib/util/constants"

interface CategoryOrderFilterProps {
  className?: string
  isMobile: boolean
  sortBy: SortOptions
}

export type SortOptions = "price_asc" | "price_desc" | "created_at"

export const sortOptions: Record<string, any> = {
  // "best-selling": {
  //   translation: "پرفروش ترین",
  // },
  created_at: {
    translation: "جدیدترین",
  },
  price_desc: {
    translation: "بیشترین قیمت",
  },
  price_asc: {
    translation: "کمترین قیمت",
  },
  // "highest-off": {
  //   translation: "بیشترین تخفیف",
  // },
}

const CategoryOrderFilter: React.FC<CategoryOrderFilterProps> = ({
  className,
  isMobile,
  sortBy,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<string>(sortBy)
  const [sheetOpen, setSheetOpen] = useState(false)
  const { openMobile, setOpenMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const handleOrderSelect = (key: string) => {
    setSelectedOrder(key)
    setSheetOpen(false)
    setQueryParams("sortBy", key)
    // You can add additional logic here for order change
  }

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  // Desktop view
  if (!isMobile) {
    return (
      <div
        className={`relative flex h-6 items-center justify-start bg-blue-100 rounded-lg gap-4 pl-6 pr-3.5 ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <Layers className="h-4 w-4" />
          <p className="flex items-center text-sm font-semibold leading-4 text-gray-800">
            ترتیب:
          </p>
        </div>
        <nav>
          <ul className="flex items-center gap-1">
            {Object.entries(sortOptions).map(([key, value]) => (
              <Item
                className={`cursor-pointer whitespace-nowrap font-normal ${
                  selectedOrder === key
                    ? "text-blue-600 font-semibold"
                    : "text-gray-800"
                }`}
                key={key}
                variant={selectedOrder === key ? "default" : "default"}
                size={"sm"}
                asChild
                onClick={() => handleOrderSelect(key)}
              >
                <ItemContent>
                  <ItemTitle className="text-xs">{value.translation}</ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </ul>
        </nav>
      </div>
    )
  }

  // Mobile view
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* ترتیب Button that opens bottom sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 h-9 px-3"
          >
            <Layers className="h-4 w-4" />
            <span>ترتیب</span>
            {selectedOrder && (
              <Badge variant="secondary" className="mr-1 h-5 px-1.5">
                {sortOptions[selectedOrder]?.translation}
              </Badge>
            )}
          </Button>
        </SheetTrigger>

        {/* Bottom Sheet Content */}
        <SheetContent
          side="bottom"
          className={`h-auto max-h-[80vh] p-0 rounded-t-xl bottom-20`}
        >
          <SheetHeader className="p-4 border-b sticky top-0 bg-white">
            <SheetTitle className="text-center text-gray-900">
              مرتب‌ سازی
            </SheetTitle>
          </SheetHeader>

          <div className="overflow-y-auto p-2">
            {Object.entries(sortOptions).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleOrderSelect(key)}
                className={`w-full text-right p-4 border-b last:border-b-0 hover:bg-gray-50 text-xs leading-4 transition-colors ${
                  selectedOrder === key ? "bg-blue-50" : ""
                }`}
              >
                <span
                  className={
                    selectedOrder === key
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                  }
                >
                  {value.translation}
                </span>
                {selectedOrder === key && (
                  <CheckIcon className="float-left text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      {/* Additional button that triggers parent event */}
      <Button
        variant="secondary"
        size="icon"
        className="h-9 w-9"
        onClick={() => setOpenMobile(!openMobile)}
      >
        <X className="h-4 w-4 rotate-45" />
      </Button>
    </div>
  )
}

export default CategoryOrderFilter
