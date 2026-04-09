import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@lib/components/ui/item"
import { MessageCircleQuestionIcon } from "lucide-react"

import Link from "next/link"
import CategoryButton from "../category-button"

interface HeaderNavBarBottomContentProps {
  className?: string
}
export const headerItemsMap: Record<string, any> = {
  inquiry: {
    translation: "استعلام قطعه",
    icon: <MessageCircleQuestionIcon className="size-4" />,
    href: "/ir/inquiry-cart",
  },
}
export default function HeaderNavBarBottomContent({
  className = "",
}: HeaderNavBarBottomContentProps) {
  return (
    <ul className={`flex h-8 items-center text-center gap-2 ${className}`}>
      <CategoryButton />
      {Object.entries(headerItemsMap).map(([key, value]) => (
        <Item key={key} variant="default" size={"sm"} asChild>
          <Link href={value.href}>
            <ItemMedia>{value.icon}</ItemMedia>
            <ItemContent>
              <ItemTitle className="text-sm font-bold transition-colors text-gray-900">{value.translation}</ItemTitle>
            </ItemContent>
          </Link>
        </Item>
      ))}
    </ul>
  )
}
