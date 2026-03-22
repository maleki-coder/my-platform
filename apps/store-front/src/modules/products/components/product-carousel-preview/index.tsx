// @modules/products/components/product-carousel-preview/index.tsx
import { getProductPrice, StitchedProduct } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PreviewPrice from "@modules/products/components/product-preview/price"
import Image from "next/image"
import TimedDiscountBadge from "@modules/products/components/timed-discount-badge"
import Link from "next/link"

export default async function ProductCarouselPreview({
  product,
}: {
  product: StitchedProduct // استفاده از تایپ توسعه‌یافته برای جلوگیری از خطای TS
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  // شرط امن برای نمایش تایمر: آیا تخفیف درصدی دارد و آیا تاریخ پایان برای آن ثبت شده است؟
  const hasValidTimedDiscount =
    cheapestPrice?.percentage_diff &&
    parseInt(cheapestPrice.percentage_diff) > 0 &&
    cheapestPrice?.ends_at

  return (
    <section className="relative w-full" data-testid="product-carousel-wrapper">
      <div className="mb-4 flex h-fit gap-2.25 pt-13">
        <div className="relative mx-auto">
          <Link href={`/products/${product.handle}`}>
            <Image
              src={product.thumbnail || (product.images?.[0]?.url as string)}
              alt="Thumbnail"
              draggable={false}
              quality={50}
              loading="lazy"
              width={160}
              height={160}
            />
          </Link>
        </div>
      </div>

      <Link
        href={`/products/${product.handle}`}
        className="line-clamp-2 px-0 md:px-4 h-12 w-full text-xs font-medium leading-6 -tracking-0.5  lg:h-12.5 lg:text-sm lg:leading-6.75"
      >
        {product.title}
      </Link>

      <div className="flex items-center gap-x-2 mt-6">
        {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
      </div>
      <div className="absolute top-0 w-full">
        {hasValidTimedDiscount ? (
          <TimedDiscountBadge
            startsAt={cheapestPrice.starts_at}
            endsAt={cheapestPrice.ends_at!}
          />
        ) : null}
      </div>
    </section>
  )
}
