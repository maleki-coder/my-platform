"use client"

import React, { useEffect, useState, useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@lib/components/ui/sidebar"
import {
  FilterIcon,
  XIcon,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { CategoryOption } from "types/global"
import { Input } from "@lib/components/ui/input"
import { Label } from "@lib/components/ui/label"
import { Button } from "@lib/components/ui/button"
import { Switch } from "@lib/components/ui/switch"

interface CategoryFilterSidebarProps {
  filterOptions: CategoryOption[]
}

const CategoryFilterSidebar: React.FC<CategoryFilterSidebarProps> = ({
  filterOptions = [],
}) => {
  const { toggleSidebar } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScroll, setLastScroll] = useState(0)
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    const active: string[] = []
    if (searchParams.get("in_stock")) active.push("availability")
    if (searchParams.get("min_price") || searchParams.get("max_price"))
      active.push("price")
    filterOptions.forEach((opt) => {
      if (searchParams.get(opt.title)) active.push(opt.title)
    })
    return active
  })

  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "")

  useEffect(() => {
    setMinPrice(searchParams.get("min_price") || "")
    setMaxPrice(searchParams.get("max_price") || "")
  }, [searchParams])

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY
      if (currentScroll < 0) return
      setIsVisible(currentScroll < lastScroll || currentScroll === 0)
      setLastScroll(currentScroll)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScroll])

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionName)
        ? prev.filter((s) => s !== sectionName)
        : [...prev, sectionName]
    )
  }
  // Helper function for smooth scrolling to top
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }
  const toggleFilter = useCallback(
    (optionTitle: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      const currentValues = params.get(optionTitle)?.split(",") || []
      const isCurrentlySelected = currentValues.includes(value)

      let newValues: string[]
      if (isCurrentlySelected) {
        newValues = currentValues.filter((v) => v !== value)
      } else {
        newValues = [...currentValues, value]
      }

      if (newValues.length > 0) {
        params.set(optionTitle, newValues.join(","))
      } else {
        params.delete(optionTitle)
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false })
      scrollToTop()
    },
    [searchParams, pathname, router]
  )

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY
      if (currentScroll < 0) return
      setIsVisible(currentScroll < lastScroll || currentScroll === 0)
      setLastScroll(currentScroll)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScroll])

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (minPrice) params.set("min_price", minPrice)
    else params.delete("min_price")
    if (maxPrice) params.set("max_price", maxPrice)
    else params.delete("max_price")
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const isFilterSelected = (optionTitle: string, value: string) => {
    const currentValues = searchParams.get(optionTitle)?.split(",") || []
    return currentValues.includes(value)
  }

  const AccordionHeader = ({ title, id }: { title: string; id: string }) => {
    const isOpen = expandedSections.includes(id)
    return (
      <button
        onClick={() => toggleSection(id)}
        className="flex w-full items-center cursor-pointer justify-between mb-2 px-2 py-1 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
      >
        <span className="text-right">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
    )
  }

  return (
    <Sidebar
      side="right"
      style={
        isVisible
          ? { top: "8.5rem", height: "calc(100vh - 8.5rem)" }
          : { top: "5.5rem", height: "calc(100vh - 5.5rem)" }
      }
      className={`md:sticky p-0 md:z-1 z-5000 ${
        isVisible ? "md:top-34" : "md:top-22"
      }`}
      variant="floating"
      collapsible="offcanvas"
    >
      <SidebarContent className="bg-white rounded-md shadow-sm overflow-y-auto h-full pb-24 overscroll-contain">
        <SidebarHeader className="sticky rounded-t-md h-fit top-12 md:top-0 z-1 bg-white border-b-2 w-full flex-row! flex-nowrap! flex justify-between px-4 py-3.5">
          <div className="flex gap-1.5 items-center">
            <FilterIcon className="fill-gray-700 w-4 h-4" />
            <p className="text-xs font-semibold leading-4 text-gray-800">
              فیلترها
            </p>
          </div>
          <button
            onClick={toggleSidebar}
            className="md:hidden block text-gray-500 hover:text-gray-900"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupContent>
            <div className="mb-4 mt-12 md:mt-0 flex items-center justify-between border-b border-gray-100 pb-4 px-2">
              <Label
                htmlFor="in-stock-toggle"
                className="text-sm font-semibold text-gray-700 cursor-pointer select-none"
              >
                فقط کالاهای موجود
              </Label>
              <Switch
                id="in-stock-toggle"
                checked={isFilterSelected("in_stock", "true")}
                onCheckedChange={() => toggleFilter("in_stock", "true")}
              />
            </div>

            <div className="mb-4 border-b border-gray-100">
              <AccordionHeader title="فیلتر بر اساس قیمت" id="price" />
              {expandedSections.includes("price") && (
                <div className="px-4 pt-2 flex flex-col gap-3">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="min_price">محدوده قیمت از</Label>
                      <div className="relative w-full">
                        <Input
                          id="min_price"
                          name="min_price"
                          value={
                            minPrice
                              ? Number(minPrice).toLocaleString("en-US")
                              : ""
                          }
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, "")
                            setMinPrice(rawValue)
                          }}
                          className="pl-14 pr-3 text-left rtl:text-right"
                          dir="ltr"
                          data-testid="min-price-input"
                          placeholder="0"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                          تومان
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="max_price">محدوده قیمت تا</Label>
                      <div className="relative w-full">
                        <Input
                          id="max_price"
                          name="max_price"
                          value={
                            maxPrice
                              ? Number(maxPrice).toLocaleString("en-US")
                              : ""
                          }
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, "")
                            setMaxPrice(rawValue)
                          }}
                          className="pl-14 pr-3 text-left rtl:text-right"
                          dir="ltr"
                          data-testid="max-price-input"
                          placeholder="0"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                          تومان
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button className="cursor-pointer" onClick={applyPriceFilter}>اعمال قیمت</Button>
                </div>
              )}
            </div>

            {filterOptions.length === 0
              ? null
              : filterOptions.map((option) => (
                  <div
                    key={option.title}
                    className="mb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0"
                  >
                    <AccordionHeader title={option.title} id={option.title} />

                    {expandedSections.includes(option.title) && (
                      <div className="mt-1">
                        <SidebarMenu>
                          {option.values.map((val) => {
                            const selected = isFilterSelected(option.title, val)
                            return (
                              <SidebarMenuItem key={val}>
                                <SidebarMenuButton
                                  onClick={() =>
                                    toggleFilter(option.title, val)
                                  }
                                  className={`flex items-center gap-2.5 transition-colors cursor-pointer hover:bg-gray-50 rounded-md p-2 ${
                                    selected
                                      ? "text-blue-600 bg-blue-50/50"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {selected ? (
                                    <CheckSquare className="w-10 h-10 text-blue-600" />
                                  ) : (
                                    <Square className="w-10 h-10 text-gray-400" />
                                  )}
                                  <span
                                    className={`text-sm ${
                                      selected ? "font-semibold" : "font-normal"
                                    }`}
                                  >
                                    {val}
                                  </span>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            )
                          })}
                        </SidebarMenu>
                      </div>
                    )}
                  </div>
                ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default CategoryFilterSidebar
