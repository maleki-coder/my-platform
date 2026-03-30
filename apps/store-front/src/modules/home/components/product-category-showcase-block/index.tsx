import { getCategoryByHandle } from "@lib/data/categories"
import { listProductsWithSort } from "@lib/data/products"
import { ProductSearchParams } from "@lib/types"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { ProductCategoryShowcaseData, ProductCategoryType } from "types/global"

// کامپوننت‌های کاروسل سفارشی شما
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@lib/components/ui/carousel"

import { StoreProductCategory } from "@medusajs/types"
import ProductCarouselPreview from "@modules/products/components/product-carousel-preview"

type ProductCategoryShowcaseBlockProps = {
  data: ProductCategoryShowcaseData
  countryCode: string
}

export default async function ProductCategoryShowcaseBlock({
  data,
  countryCode,
}: ProductCategoryShowcaseBlockProps) {
  let productCategory: StoreProductCategory
  const queryParams: ProductSearchParams = {}
  if (data.type == ProductCategoryType.CATEGORY) {
    productCategory = await getCategoryByHandle([
      data.category_handle,
    ] as string[])
    if (productCategory!.id) {
      queryParams.category_id = productCategory!.id
    }
  }
  queryParams.order = "created_at"
  queryParams.limit = data.limit
  queryParams.in_stock = "true"
  queryParams.page = 1

  let {
    response: { products },
  } = await listProductsWithSort({
    queryParams,
    countryCode,
  })

  if (!products || products.length === 0) {
    return null
  }

  const title = data.title
  const searchParam = "?" + data.search_param
  let viewAllLink: string
  if (data.search_param) {
    viewAllLink = data?.category_handle
      ? `/${countryCode}/categories/${data?.category_handle}${searchParam}`
      : "#"
  } else {
    viewAllLink = data?.category_handle
      ? `/${countryCode}/categories/${data?.category_handle}`
      : "#"
  }

  return (
    <section className="rounded-xl md:border border-gray-600 pb-6 overflow-hidden">
      <div className="flex flex-col">
        <div className="flex items-center justify-between pl-2.5 pr-4 lg:px-10.5 pb-4 lg:py-6">
          <h2 className="flex items-center gap-1 text-base font-semibold leading-6 lg:gap-2 lg:text-xl lg:leading-8">
            {title}
          </h2>
          <Link href={viewAllLink}>
            <div className="flex cursor-pointer items-center text-gray-600 hover:text-black lg:gap-2 transition-colors">
              <p className="text-xs font-semibold lg:text-sm">مشاهده همه</p>
              <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
            </div>
          </Link>
        </div>
      </div>
      <div className="w-full px-4 lg:px-10.5">
        <Carousel
          opts={{
            align: "start",
            direction: "rtl",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((p, index) => (
              <CarouselItem
                key={index}
                // کلاس‌های basis تعیین می‌کنند در هر سایز صفحه چند محصول نمایش داده شود
                // موبایل: تقریباً 2 محصول (کمی از محصول بعدی پیداست)
                // تبلت: 3 محصول
                // دسکتاپ: 4 یا 5 محصول
                className="border-l-2 px-2 md:px-4 h-fit basis-[45%] sm:basis-1/3 md:basis-1/4 lg:basis-1/5 last:border-l-0"
              >
                {/* <div className="p-1 h-full"> */}
                <ProductCarouselPreview product={p} />
                {/* </div> */}
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* دکمه‌های کنترل کاروسل - معمولاً در موبایل مخفی و فقط در دسکتاپ با قابلیت Hover نمایش داده می‌شوند */}
          <CarouselPrevious className="hidden lg:flex cursor-pointer -left-4 bg-white/90 hover:bg-white" />
          <CarouselNext className="hidden lg:flex cursor-pointer -right-4 bg-white/90 hover:bg-white" />
        </Carousel>
      </div>
    </section>
  )
}
