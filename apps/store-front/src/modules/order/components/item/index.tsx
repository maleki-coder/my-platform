import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { VariantTagScroll } from "@modules/cart/components/variant-tag-scroll"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
}

const Item = ({ item }: ItemProps) => {
  return (
    <div className="flex w-full items-start gap-4 py-4">
      <div className="relative h-20 w-20">
        <div className="w-full relative">
          <div className="absolute inset-0 w-full h-full">
            <LocalizedClientLink href={`/products/${item.product_handle}`}>
              <Thumbnail
                thumbnail={item.product?.thumbnail!}
                images={item.variant?.product?.images}
                size="square"
              />
            </LocalizedClientLink>
          </div>
        </div>
        <span className="absolute bottom-0 right-0 flex h-5.5 w-5.5 items-center justify-center rounded-md border border-gray-300 bg-white text-smm leading-4 text-gray-700">
          {item.quantity}
        </span>
      </div>
      <div className="relative flex grow flex-col gap-2">
        <LocalizedClientLink href={`/products/${item.product_handle}`}>
          <strong className="mb-2 text-sm font-medium leading-6 text-gray-700">
            {item.title}
          </strong>
        </LocalizedClientLink>
        <VariantTagScroll variantTitle={item.variant?.title} />
        <div className="absolute bottom-0 left-0">
          <div className="flex w-auto flex-col items-end">
            <div className="flex items-center">
              <p className="text-base font-semiBold leading-4.5 text-gray-700">
                {convertToLocale({
                  amount: item.original_total! - item.discount_total!,
                })}
              </p>
              <span className="text-primary-shade-1 text-xs font-medium mr-1 leading-4.5 text-gray-600">
                تومان
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item
