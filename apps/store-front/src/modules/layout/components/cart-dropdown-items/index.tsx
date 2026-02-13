"use client"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { BadgePercent, BoxIcon } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import { QuantitySelector } from "@modules/cart/components/quantity-selector"
import { getDiscountPercent } from "@lib/util/get-discount-percent"
import { isVariantDiscounted } from "@lib/util/is-variant-discounted"
import { convertToLocale } from "@lib/util/money"
import { useParams } from "next/navigation"

type Props = {
  cartState: HttpTypes.StoreCart
}


const CartDropdownItems = ({ cartState }: Props) => {
  const { countryCode } = useParams() as { countryCode: string }

  return (
    <div className="max-w-full flex flex-col pb-2 pr-8 pl-8 overflow-x-hidden">
      {cartState
        ?.items!.sort((a, b) =>
          (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
        )
        .map((item) => (
          <div
            key={item.id}
            className="w-full pb-6 border-b mt-1 border-gray-200 last:border-none"
          >
            <div className="flex w-full items-stretch">
              <div className="flex w-2/3 flex-col gap-1">
                <div className="h-5 w-15">
                  {isVariantDiscounted(item) && (
                    <BadgePercent className="text-red-700" />
                  )}
                </div>

                <div className="flex flex-col justify-between pl-4">
                  <h2 className="text-xs font-semiBold leading-6.5 text-primary-shade-1 wrap-break-word">
                    {item.title}
                  </h2>

                  <div className="mt-2.5 flex flex-col">
                    <div className="flex items-center">
                      <div className="flex h-2 w-5 items-center justify-center">
                        <span className="circle-dot bg-primary-tint-1"></span>
                      </div>
                    </div>

                    <div className="flex items-center text-indigo-500">
                      <div className="me-2 flex h-5 w-5 items-center justify-center">
                        <BoxIcon size={18} />
                      </div>
                      <p className="text-xs font-semiBold">موجود در انبار</p>
                    </div>
                  </div>
                </div>
              </div>

              <LocalizedClientLink
                href={`/products/${item.product_handle}`}
                className="w-1/3 pt-3"
              >
                <Thumbnail
                  thumbnail={item.thumbnail}
                  images={item.variant?.product?.images}
                  size="square"
                />
              </LocalizedClientLink>
            </div>

            <div className="mt-3.5 w-full flex flex-col">
              <div className="flex items-stretch">
                <div className="flex flex-1 flex-col justify-between">
                  <div className="relative flex items-center">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center border p-[3px] h-6.5 rounded-[5px] border-primary-shade">
                        <div className="max-w-[180px] overflow-x-auto pb-1">
                          <p className="px-3 whitespace-nowrap select-none text-xs leading-5 font-semiBold text-gray-900">
                            {item.variant?.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-8"></div>

                  <div className="relative flex justify-between">
                    <QuantitySelector item={item} countryCode={countryCode} />
                  </div>
                </div>

                {/* PRICE SECTION */}
                <div className="flex flex-1 flex-col justify-end pr-4">
                  <div className="flex flex-col items-end justify-end">
                    {isVariantDiscounted(item) && (
                      <>
                        <div className="flex flex-row-reverse gap-1 bg-red-700 text-white p-0.5 rounded-sm text-xs">
                          <span>{getDiscountPercent(item)?.toFixed(0)}</span>
                          <span>%</span>
                        </div>

                        <div className="mb-1 mt-2 text-xs flex gap-1 text-grey-40">
                          <span className="line-through">
                            {convertToLocale({
                              amount: item.total! + item.discount_total!,
                            })}
                          </span>
                          <span>تومان</span>
                        </div>
                      </>
                    )}

                    <div className="flex gap-1">
                      <p className="font-semibold">
                        {convertToLocale({ amount: item.total! })}
                      </p>
                      <span className="text-xs self-center">تومان</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default CartDropdownItems
