"use client"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { BadgePercent, BoxIcon } from "lucide-react"
import { QuantitySelector } from "@modules/inquiry-cart/components/quantity-selector"
import { VariantTagScroll } from "@modules/cart/components/variant-tag-scroll"
import { getDiscountPercent } from "@lib/util/get-discount-percent"
import { isVariantDiscounted } from "@lib/util/is-variant-discounted"
import { convertToLocale } from "@lib/util/money"
import { useParams } from "next/navigation"
import { InquiryCartItem } from "types/global"

type Props = {
  cartItem: InquiryCartItem
}

const InquiryCartDropdownItem = ({ cartItem }: Props) => {
  const { countryCode } = useParams() as { countryCode: string }

  return (
    <div
      key={cartItem.id}
      className="w-full pb-6 border-b mt-1 border-gray-200 last:border-none"
    >
      <div className="flex w-full items-stretch">
        <div className="flex w-2/3 flex-col gap-1">
          <div className="h-3 w-15"></div>
          <div className="flex flex-col justify-between pl-4">
            <h2 className="text-xs font-semibold leading-6.5 wrap-break-word">
              {cartItem.title}
            </h2>
          </div>
        </div>
        {cartItem.product_handle ? (
          <LocalizedClientLink
            href={`/products/${cartItem.product_handle}`}
            className="w-1/3 pt-3"
          >
            <Thumbnail thumbnail={cartItem.thumbnail} size="square" />
          </LocalizedClientLink>
        ) : (
          <Thumbnail thumbnail={cartItem.thumbnail} size="square" />
        )}
      </div>
      <div className="h-8"></div>
      <div className="w-full flex flex-col">
        <div className="flex items-stretch">
          <div className="flex flex-1 flex-col justify-between">
            {/* <VariantTagScroll variantTitle={cartItem.variant?.title} /> */}

            <div className="relative flex justify-between">
              <QuantitySelector item={cartItem} countryCode={countryCode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InquiryCartDropdownItem
