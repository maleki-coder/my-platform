import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@lib/components/ui/item"
import { BadgeCheckIcon, MessageCircleQuestionIcon } from "lucide-react"

import Link from "next/link"
import CategoryButton from "../category-button"

interface HeaderNavBarBottomContentProps {
  className?: string
}
export const headerItemsMap: Record<string, any> = {
  "installment-purchase": {
    translation: "خرید اقساطی",
    icon: <BadgeCheckIcon className="size-4" />,
    href: "test",
  },
  inquiry: {
    translation: "استعلام",
    icon: <MessageCircleQuestionIcon className="size-4" />,
    href: "second",
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
              <ItemTitle className="text-xs">{value.translation}</ItemTitle>
            </ItemContent>
          </Link>
        </Item>
      ))}
    </ul>
  )
}
