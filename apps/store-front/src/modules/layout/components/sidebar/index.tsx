"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@lib/components/ui/sidebar"
import { useScrollLock } from "@lib/hooks/use-scroll-lock"
import { ChevronLeftIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { CategoryImage, CategoryWithImages } from "types/global"

type AppSidebarProps = {
  categories: CategoryWithImages[]
}

export function AppSidebar({ categories }: AppSidebarProps) {
  const { open, setOpen } = useSidebar()
  useScrollLock(open)

  const sidebarRef = useRef<HTMLDivElement>(null)
  const [sidebarWidth, setSidebarWidth] = useState<number>(0)

  // Stack of currently opened sidebars; each element is a category
  const [sidebarStack, setSidebarStack] = useState<CategoryWithImages[]>([])

  useEffect(() => {
    if (sidebarRef.current) {
      setSidebarWidth(sidebarRef.current.offsetWidth)
    }
    setSidebarStack([])
  }, [open])

  // Narrowing helper
  function hasChildrenAndImage(
    item: CategoryWithImages
  ): item is CategoryWithImages & {
    category_children: any[]
    product_category_image: CategoryImage[]
  } {
    return (
      Array.isArray(item.category_children) &&
      item.category_children.length > 0 &&
      Array.isArray(item.product_category_image) &&
      item.product_category_image.length > 0
    )
  }

  const handleHover = (category: CategoryWithImages, level: number) => {
    setSidebarStack((prev) => {
      const newStack = [...prev]
      newStack[level] = category
      return newStack.slice(0, level + 1) // remove deeper sidebars
    })
  }

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-5"
        onClick={() => setOpen(false)}
      />

      {/* Root Sidebar */}
      <Sidebar
        style={{ top: "7.5rem", height: "calc(100vh - 7.5rem)" }}
        side="right"
        className="w-60"
        variant="floating"
        collapsible="offcanvas"
      >
        <SidebarContent ref={sidebarRef}>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {categories.filter(hasChildrenAndImage).map((item, index) => {
                  const img = item.product_category_image[0]
                  return (
                    <SidebarMenuItem
                      key={item.id}
                      className="h-12 flex items-center justify-between w-full gap-0"
                      onMouseEnter={() => handleHover(item, 0)}
                    >
                      <SidebarMenuButton
                        asChild
                        size="lg"
                        className="border-b rounded-none text-xs"
                      >
                        <Link
                          href={`/categories/${item.handle}`}
                          className="flex items-center w-full"
                          onClick={() => setOpen(false)}
                        >
                          <Image
                            width={24}
                            height={24}
                            src={img.url}
                            alt={img.type || "category image"}
                          />
                          <span className="font-semibold text-gray-600">{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                      <ChevronLeftIcon size={18} className="mr-4 shrink-0" />
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Render child sidebars recursively */}
      {sidebarStack.map((category, level) => {
        if (!category.category_children?.length) return null
        const width = 230
        const gap = 10
        const right = width * (level + 1) - gap * (level > 0 ? level : 0)
        return (
          <Sidebar
            key={category.id}
            style={{
              top: "7.5rem",
              height: "calc(100vh - 7.5rem)",
              right: `${right}px`,
              width: `${width}px`,
            }}
            side="right"
            variant="floating"
          >
            <SidebarContent>
              {/* Parent title */}
              <div className="flex w-full bg-sky-50 rounded-t-md p-4 border-b text-sm font-semibold">
                {category.name}
              </div>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {category.category_children.map((child: any) => (
                      <SidebarMenuItem
                        key={child.id}
                        className="h-12 flex items-center justify-between w-full gap-0"
                        onMouseEnter={() => handleHover(child, level + 1)}
                      >
                        <SidebarMenuButton
                          asChild
                          size="lg"
                          className="border-b rounded-none text-xs"
                        >
                          <Link
                            href={`/categories/${child.handle}`}
                            className="flex items-center w-full"
                            onClick={() => setOpen(false)}
                          >
                            <span className="font-semibold text-gray-600">{child.name}</span>
                          </Link>
                        </SidebarMenuButton>
                        {child.category_children?.length ? (
                          <ChevronLeftIcon
                            size={18}
                            className="mr-4 shrink-0"
                          />
                        ) : null}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        )
      })}
    </>
  )
}
