"use client"
import {
  ItemMedia,
  ItemContent,
  ItemTitle,
  Item,
} from "@lib/components/ui/item"
import { useSidebar } from "@lib/components/ui/sidebar"
import { ListIcon } from "lucide-react"

export default function CategoryButton() {
  const { open, setOpen } = useSidebar()
  return (
    <Item
      onClick={() => setOpen(!open)}
      variant="default"
      size="sm"
      className="cursor-pointer"
    >
      <ItemMedia>
        <ListIcon className="size-4" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-xs">دسته‌بندی محصولات</ItemTitle>
      </ItemContent>
    </Item>
  )
}
