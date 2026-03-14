"use client"

import {
  SheetContent,
  SheetTitle,
  Sheet,
  SheetClose,
} from "@lib/components/ui/sheet"
import { useSideBarSheet } from "@lib/hooks/use-side-bar-sheet"
import { ChevronLeft, LayoutGrid, X } from "lucide-react"
import { CategoryImage, CategoryWithImages } from "types/global"
import Image from "next/image"
import { useState } from "react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion"
import { MOBILE_FOOTER_HEIGHT, MOBILE_HEADER_HEIGHT } from "@lib/util/constants"

type SheetSidebarProps = {
  categories: CategoryWithImages[]
}

export function MobileMenuSheet({ categories }: SheetSidebarProps) {
  const { open, setOpen } = useSideBarSheet()
  const [activeCategory, setActiveCategory] =
    useState<CategoryWithImages | null>(null)

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

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={true}>
      <SheetContent
        style={{
          top: MOBILE_HEADER_HEIGHT,
          height: `calc(100dvh - ${MOBILE_FOOTER_HEIGHT} - ${MOBILE_HEADER_HEIGHT})`,
        }}
        className="min-w-full flex flex-col overflow-hidden [&>button]:hidden gap-0 p-0"
      >
        <div className="shrink-0 w-full bg-white z-10">
          <SheetTitle asChild>
            <div className="flex items-center justify-end pe-2 border-b h-12">
              <SheetClose asChild>
                <button
                  type="button"
                  aria-label="Close search"
                  className="shrink-0 rounded-md p-2 hover:bg-muted transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </SheetClose>
            </div>
          </SheetTitle>
        </div>

        <div className="flex flex-1 w-full overflow-hidden relative">
          <ul className="w-20 shrink-0 h-full bg-white border-l-2 overflow-y-auto pb-28 custom-scrollbar relative">
            {categories!.filter(hasChildrenAndImage).flatMap((item) => {
              const img = item.product_category_image[0]
              return (
                <li
                  onClick={() => setActiveCategory(item)}
                  key={img.id}
                  className={`border-b-2 flex justify-center items-center w-full min-h-24 gap-3 flex-col px-1 text-center cursor-pointer transition-colors
                    ${
                      activeCategory?.id === item.id
                        ? "bg-muted"
                        : "hover:bg-gray-50"
                    }
                  `}
                >
                  <Image
                    width={24}
                    height={24}
                    src={img.url}
                    alt={img.type || "category image"}
                    className="object-contain"
                  />
                  <span className="text-xs">{item.name}</span>
                </li>
              )
            })}
          </ul>
          <div className="flex-1 h-full overflow-y-auto pb-28 bg-white custom-scrollbar relative">
            {activeCategory && (
              <div className="flex flex-col h-full">
                <div className="flex text-black whitespace-nowrap shadow-sm py-5 px-4 text-base font-semibold gap-1 border-b shrink-0">
                  <span>دسته‌بندی‌های </span>
                  <span>{activeCategory.name}</span>
                </div>

                <a
                  className="w-fit font-semibold text-sm gap-2 whitespace-nowrap text-blue-500 flex items-center p-4 shrink-0"
                  href={`/categories/${activeCategory.handle}`}
                  onClick={() => setOpen(false)}
                >
                  <div className="flex gap-1">
                    <span>همه محصولات</span> <span>{activeCategory.name}</span>
                  </div>
                  <ChevronLeft size={16} />
                </a>

                <Accordion type="single" collapsible className="mx-2 pb-4">
                  {activeCategory.category_children?.map(
                    (child: CategoryWithImages) => (
                      <AccordionItem key={child.id} value={child.id}>
                        <AccordionTrigger className="text-sm p-4 items-center justify-between text-gray-700 font-semibold w-full flex bg-blue-50/50 rounded-t mt-2 border border-b-0 border-blue-100">
                          {child.name}
                        </AccordionTrigger>

                        <AccordionContent className="bg-blue-50/30 rounded-b flex flex-col border border-t-0 border-blue-100">
                          <div className="border-t border-gray-200 mx-4"></div>
                          <ul className="grid gap-4 justify-start items-start grid-cols-3 p-4">
                            <li>
                              <a
                                className="flex flex-col items-center justify-start text-xs gap-2 text-center h-full"
                                href={`/categories/${child.handle}`}
                                onClick={() => setOpen(false)}
                              >
                                <span className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center p-3">
                                  <LayoutGrid
                                    size={24}
                                    className="text-gray-500"
                                  />
                                </span>
                                <span className="text-gray-600 font-medium line-clamp-2">
                                  همه کالاها
                                </span>
                              </a>
                            </li>

                            {child.category_children.map(
                              (grandChild: CategoryWithImages) => (
                                <li key={grandChild.id} className="h-full">
                                  <a
                                    className="flex flex-col items-center justify-start text-xs gap-2 text-center h-full"
                                    href={`/categories/${grandChild.handle}`}
                                    onClick={() => setOpen(false)}
                                  >
                                    <span className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden p-1">
                                      {grandChild.product_category_image!
                                        ?.length > 0 &&
                                      grandChild.product_category_image![0]
                                        ?.url ? (
                                        <Image
                                          src={
                                            grandChild.product_category_image![0]
                                              .url
                                          }
                                          fetchPriority="low"
                                          alt={grandChild.name}
                                          width={56}
                                          height={56}
                                          className="object-contain w-full h-full p-1"
                                        />
                                      ) : null}
                                    </span>
                                    <span className="text-gray-600 font-medium line-clamp-2">
                                      {grandChild.name}
                                    </span>
                                  </a>
                                </li>
                              )
                            )}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  )}
                </Accordion>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
