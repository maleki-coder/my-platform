import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PreviewPrice from "./price"
import { getDeviceFromCookie } from "@lib/util/get-deivce-from-cookie"
import Image from "next/image"
import TimedDiscountBadge from "../timed-discount-badge"

export default async function ProductPreview({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  // const { isMobile } = getDeviceFromCookie()
  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <section
        className="relative w-full rounded-md bg-white pt-13 border shadow-custom"
        data-testid="product-wrapper"
      >
        <div className="mb-5.5 flex h-51.5 gap-2.25">
          <div className="relative mx-auto">
            <Image
              src={product.thumbnail || (product.images?.[0]?.url as string)}
              alt="Thumbnail"
              draggable={false}
              quality={50}
              loading="lazy"
              width={206}
              height={206}
            />
          </div>
        </div>
        <div className="px-4 pt-2.5">
          <h2 className="line-clamp-3 h-18.75 overflow-hidden text-sm font-medium leading-6.5 text-gray-800">
            {product.title}
          </h2>
        </div>
        <div className="flex items-center gap-x-2">
          {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
        </div>
        <div className="absolute top-4 w-full px-5">
          <TimedDiscountBadge/>
        </div>
      </section>
    </LocalizedClientLink>
  )
}
