import { convertToLocale } from "@lib/util/money"
import repeat from "@lib/util/repeat"
import { HttpTypes, StoreCartLineItem } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import { BadgePercent, BoxIcon } from "lucide-react"
import { QuantitySelector } from "@modules/cart/components/quantity-selector"
import DeleteButton from "@modules/common/components/delete-button"
import { getTotalQuantity } from "@lib/util/get-total-quantity"
import { VariantTagScroll } from "@modules/cart/components/variant-tag-scroll"
type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  const getDiscountPercent = (
    item: HttpTypes.StoreCartLineItem
  ): number | null => {
    if (!item.subtotal || !item.discount_total) return null

    const percent = (item.discount_total / item.subtotal) * 100
    return percent > 0 ? percent : null
  }
  const isVariantDiscounted = (item: HttpTypes.StoreCartLineItem) => {
    if (!item.subtotal || !item.discount_total) return null
    const percent = (item.discount_total / item.subtotal) * 100
    return percent > 0 ? true : false
  }

  return (
    <>
      <div className="flex w-full items-center justify-between px-4 pb-4 xl:px-6">
        <div className="flex items-center gap-x-1.5 xl:gap-x-3">
          <p className="text-sm font-bold xl:text-xl leading-5.5">
            سبد خرید شما
          </p>
        </div>
        <div className="flex items-center gap-x-0.5 xl:gap-x-1">
          <p className="text-xs font-medium lg:text-sm">
            <span>{getTotalQuantity(items)}</span> <span>عدد کالا</span>
          </p>
        </div>
      </div>
      <div>
        {items
          ? items
              .sort((a, b) =>
                (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              )
              .map((item: StoreCartLineItem) => (
                <div
                  key={item.id}
                  className="relative mb-6 flex w-full flex-col rounded-2xl border px-11 pb-11 pt-6 last:mb-0"
                >
                  <div className="absolute h-6 w-15 top-3">
                    {isVariantDiscounted(item) ? (
                      <BadgePercent className="text-red-700" />
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="absolute p-2 left-3 top-2 border rounded-4xl">
                    <DeleteButton id={item.id} />
                  </div>
                  <div className="flex w-full justify-between">
                    <div className="flex w-0 grow flex-col pt-5">
                      <LocalizedClientLink
                        href={`/products/${item.product_handle}`}
                      >
                        <p className="pb-7 text-lg font-bold leading-8.5 -tracking-0.5 text-primary-shade-2">
                          {item?.title}
                        </p>
                      </LocalizedClientLink>
                      <div className="relative flex flex-col gap-2 lg:gap-[18px] [&>div]:flex [&>div]:items-center [&>div]:gap-2.5 [&>div]:lg:gap-4">
                        <div className="items-start! text-indigo-500">
                          <div className="me-2 flex h-5 w-5 items-center justify-center">
                            <BoxIcon size={20} />
                          </div>
                          <p className="text-xs font-medium leading-5 text-primary-shade-2 lg:text-md">
                            موجود در انبار
                          </p>
                        </div>
                      </div>
                    </div>
                    <LocalizedClientLink
                      href={`/products/${item.product_handle}`}
                    >
                      <div className="w-36 h-36 relative">
                        <Thumbnail
                          thumbnail={item.product?.thumbnail!}
                          images={item.variant?.product?.images}
                          size="square"
                        />
                      </div>
                    </LocalizedClientLink>
                  </div>
                  <div className="flex w-full flex-col justify-end gap-8 pt-6 lg:flex-row">
                    <div className="w-full 3xl:w-auto lg:min-w-91 ll:max-w-[364px]">
                      <div className=" flex h-full justify-between gap-2 rounded-lg border bg-white py-8 pl-6 pr-4 flex-col xl:flex-row lg:flex-col">
                        <div className="flex grow items-center justify-between">
                          <div className="ml-4">
                            <VariantTagScroll variantTitle={item.variant?.title} />
                          </div>
                          <div className="mt-0 flex max-w-max flex-row items-center justify-between gap-0 3xl:w-full 3xl:max-w-none">
                            <div className="min-w-6 lg:min-w-7 flex h-[17px] items-center! justify-center gap-1 rounded-[3px] px-1 lg:h-[19px] bg-red-60">
                              {isVariantDiscounted(item) && (
                                <div className="flex flex-nowrap flex-row-reverse items-center gap-1 rounded-sm p-0.5 text-xs bg-red-700 text-white">
                                  <div className="flex flex-nowrap flex-row-reverse items-center gap-1 rounded-sm p-0.5 text-xs bg-red-700 text-white">
                                    <span>
                                      {getDiscountPercent(item)!.toFixed(0)}
                                    </span>
                                    <span>%</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className=" mr-4 flex flex-row items-center gap-2 3xl:mr-0">
                              {isVariantDiscounted(item) && (
                                <div className="mb-1 mt-2 text-sm flex gap-1 text-grey-40">
                                  <span className="line-through">
                                    {convertToLocale({
                                      amount:
                                        item.total! + item.discount_total!,
                                    })}
                                  </span>
                                </div>
                              )}
                              <div className="flex gap-1">
                                <p className="font-bold text-lg">
                                  {convertToLocale({
                                    amount: item.total!,
                                  })}
                                </p>
                                <span className="text-xs self-center">
                                  تومان
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className=" mr-5 flex items-center justify-end self-end">
                          <div className="w-44 xl:w-8/12">
                            <div className="relative flex w-full justify-end">
                              <QuantitySelector
                                item={item}
                                countryCode={"ir"}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          : repeat(5).map((i) => <SkeletonLineItem key={i} />)}
      </div>
    </>
  )
}
export default ItemsTemplate
