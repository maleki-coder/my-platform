import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PreviewPrice from "../product-preview/price"
import TimedDiscountBadge from "../timed-discount-badge"
import Image from "next/image"
export default async function MobileProductPreview({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })
  const hasValidTimedDiscount =
    cheapestPrice?.percentage_diff &&
    parseInt(cheapestPrice.percentage_diff) > 0 &&
    cheapestPrice?.ends_at

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <section
        key={product.id}
        className="w-full border-b mt-1 border-gray-200 last:border-none"
      >
        {hasValidTimedDiscount ? (
          <TimedDiscountBadge
            startsAt={cheapestPrice.starts_at}
            endsAt={cheapestPrice.ends_at!}
          />
        ) : null}
        <div className="flex w-full items-stretch">
          <div className="flex w-2/3 flex-col gap-1">
            <div className="flex flex-col justify-between pl-4">
              <h2 className="text-xs font-semibold leading-6.5 wrap-break-word">
                {product.title}
              </h2>
              <div className="mt-2.5 flex flex-col">
                <div className="flex items-center">
                  <div className="flex h-2 w-5 items-center justify-center">
                    <span className="circle-dot bg-primary-tint-1"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Image
            src={product.thumbnail || (product.images?.[0]?.url as string)}
            alt="Thumbnail"
            draggable={false}
            quality={50}
            loading="lazy"
            width={118}
            height={118}
          />
        </div>
        <div className="flex items-center gap-x-2 mt-4">
          {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
        </div>
      </section>
    </LocalizedClientLink>
  )
}
