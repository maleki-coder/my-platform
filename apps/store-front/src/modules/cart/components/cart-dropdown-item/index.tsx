"use client"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { BadgePercent, BoxIcon } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import { QuantitySelector } from "@modules/cart/components/quantity-selector"
import { VariantTagScroll } from "@modules/cart/components/variant-tag-scroll"
import { getDiscountPercent } from "@lib/util/get-discount-percent"
import { isVariantDiscounted } from "@lib/util/is-variant-discounted"
import { convertToLocale } from "@lib/util/money"
import { useParams } from "next/navigation"

type Props = {
  cartItem: HttpTypes.StoreCartLineItem
}

const CartDropdownItem = ({ cartItem }: Props) => {
  const { countryCode } = useParams() as { countryCode: string }

  return (
      <div
        key={cartItem.id}
        className="w-full pb-6 border-b mt-1 border-gray-200 last:border-none"
      >
        <div className="flex w-full items-stretch">
          <div className="flex w-2/3 flex-col gap-1">
            <div className="h-5 w-15">
              {isVariantDiscounted(cartItem) && (
                <BadgePercent className="text-red-700" />
              )}
            </div>

            <div className="flex flex-col justify-between pl-4">
              <h2 className="text-xs font-semibold leading-6.5 wrap-break-word">
                {cartItem.title}
              </h2>
              <div className="mt-2.5 flex flex-col">
                <div className="flex items-center text-indigo-500">
                  <div className="me-2 flex h-5 w-5 items-center justify-center">
                    <BoxIcon size={18} />
                  </div>
                  <p className="text-xs font-semibold">موجود در انبار</p>
                </div>
              </div>
            </div>
          </div>

          <LocalizedClientLink
            href={`/products/${cartItem.product_handle}`}
            className="w-1/3 pt-3"
          >
            <Thumbnail
              thumbnail={cartItem.thumbnail}
              images={cartItem.variant?.product?.images}
              size="square"
            />
          </LocalizedClientLink>
        </div>

        <div className="w-full flex flex-col">
          <div className="flex items-stretch">
            <div className="flex flex-1 flex-col justify-between">
              <VariantTagScroll variantTitle={cartItem.variant?.title} />

              <div className="h-8"></div>

              <div className="relative flex justify-between">
                <QuantitySelector item={cartItem} countryCode={countryCode} />
              </div>
            </div>

            {/* PRICE SECTION */}
            <div className="flex flex-1 flex-col justify-end pr-4 pb-2">
              <div className="flex flex-col items-end justify-end">
                {isVariantDiscounted(cartItem) && (
                  <>
                    <div className="flex flex-row-reverse gap-1 bg-red-700 text-white p-0.5 rounded-sm text-xs">
                      <span>{getDiscountPercent(cartItem)?.toFixed(0)}</span>
                      <span>%</span>
                    </div>
                    <div className="mb-1 mt-2 text-xs flex gap-1 text-grey-40">
                      <span className="line-through">
                        {convertToLocale({
                          amount: cartItem.total! + cartItem.discount_total!,
                        })}
                      </span>
                      <span>تومان</span>
                    </div>
                  </>
                )}

                <div className="flex gap-1">
                  <p className="font-semibold">
                    {convertToLocale({ amount: cartItem.total! })}
                    {cartItem.variant?.calculated_price?.calculated_amount}
                  </p>
                  <span className="text-xs self-center">تومان</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default CartDropdownItem
