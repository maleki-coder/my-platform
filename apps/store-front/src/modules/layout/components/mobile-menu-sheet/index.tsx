"use client"

import {
  SheetContent,
  SheetTitle,
  Sheet,
  SheetClose,
} from "@lib/components/ui/sheet"
import { useSideBarSheet } from "@lib/hooks/use-side-bar-sheet"
import { X } from "lucide-react"
import { CategoryImage, CategoryWithImages } from "types/global"
import Image from "next/image"
import { useState } from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion"
type SheetSidebarProps = {
  categories: CategoryWithImages[]
}
export function MobileMenuSheet({ categories }: SheetSidebarProps) {
  const { open, setOpen } = useSideBarSheet()
  const [activeCategory, setActiveCategory] = useState<CategoryWithImages | null>(null)
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
        style={{ top: "2.6rem", height: "calc(100vh - 8rem)" }}
        className="min-w-full overflow-y-scroll [&>button]:hidden gap-0"
      >
        <SheetTitle>
          <div className="flex items-center justify-end pe-2 border-b">
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
        <div className="flex flex-1 w-full overflow-y-auto">
          <ul className="w-20 h-full bg-white border-l-2 overflow-y-auto">
            {categories!.filter(hasChildrenAndImage).flatMap((item) => {
              const img = item.product_category_image[0]
              return (
                <li
                  onClick={() => setActiveCategory(item)}
                  key={img.id}
                  className={`border-b-2 flex justify-center items-center w-full min-h-24 gap-3 flex-col px-4 py-2 text-center cursor-pointer
                    ${activeCategory?.id === item.id ? "bg-muted" : ""}
                  `}
                >
                  <Image
                    width={24}
                    height={24}
                    src={img.url}
                    alt={img.type || "category image"}
                  />
                  <span className="text-xs">{item.name}</span>
                </li>
              )
            })}
          </ul>
          <div
            style={{ width: "calc(100% - 5rem)" }}
            className="relative h-full overflow-y-auto"
          >
            {activeCategory && (
              <Accordion type="single" collapsible className="w-full">
                {activeCategory.category_children?.map((child: any) => (
                  <AccordionItem key={child.id} value={child.id}>
                    <AccordionTrigger className="text-sm font-semibold">
                      {child.name}
                    </AccordionTrigger>

                    <AccordionContent className="pl-4">
                      {child.category_children?.length ? (
                        <ul className="space-y-2">
                          {child.category_children.map((grandChild: any) => (
                            <li key={grandChild.id}>
                              <a
                                href={`/categories/${grandChild.handle}`}
                                className="text-sm text-gray-600 hover:underline"
                                onClick={() => setOpen(false)}
                              >
                                {grandChild.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <a
                          href={`/categories/${child.handle}`}
                          className="text-sm text-gray-600 hover:underline"
                          onClick={() => setOpen(false)}
                        >
                          View {child.name}
                        </a>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
