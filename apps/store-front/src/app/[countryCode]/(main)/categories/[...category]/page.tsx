import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/categories/components/category-order-filter"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
  )

  const categoryHandles = product_categories.map(
    (category: any) => category.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string | undefined) =>
      categoryHandles.map((handle: any) => ({
        countryCode,
        category: [handle],
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    const productCategory = await getCategoryByHandle(params.category)

    const title = productCategory.name + " | Medusa Store"

    const description = productCategory.description ?? `${title} category.`

    return {
      title: `${title} | Medusa Store`,
      description,
      alternates: {
        canonical: `${params.category.join("/")}`,
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params

  // بررسی وجود دسته‌بندی پیش از هر پردازشی
  if (!params.category) {
    notFound()
  }

  const sortBy = searchParams.sortBy as SortOptions // فرض بر این است که SortOptions تایپ شده است
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1

  // ۱. اضافه کردن فیلترهای جدید به لیست پارامترهای سیستمی (رزرو شده)
  // این کار مانع از این می‌شود که کلیدهای قیمت و موجودی وارد optionsFilters (مثل رنگ و سایز) شوند
  const standardParams = [
    "sortBy",
    "page",
    "countryCode",
    "in_stock",
    "min_price",
    "max_price",
  ]
  
  const optionsFilters: Record<string, string[]> = {}

  // ۲. استخراج فیلترهای گزینه‌ای (رنگ، سایز و ...)
  Object.keys(searchParams).forEach((key) => {
    if (!standardParams.includes(key) && searchParams[key]) {
      const paramValue = searchParams[key]

      if (typeof paramValue === "string") {
        optionsFilters[key] = paramValue.split(",")
      } else if (Array.isArray(paramValue)) {
        optionsFilters[key] = paramValue.flatMap((v) => v.split(","))
      }
    }
  })

  // ۳. استخراج فیلتر موجودی (تبدیل مستقیم به Boolean)
  const inStock = searchParams.in_stock === "true"

  // ۴. استخراج و تبدیل فیلترهای قیمت به Number (همراه با اعتبارسنجی)
  const minPriceStr = searchParams.min_price as string | undefined
  const minPrice = minPriceStr && !isNaN(parseInt(minPriceStr, 10))
    ? parseInt(minPriceStr, 10)
    : undefined

  const maxPriceStr = searchParams.max_price as string | undefined
  const maxPrice = maxPriceStr && !isNaN(parseInt(maxPriceStr, 10))
    ? parseInt(maxPriceStr, 10)
    : undefined

  // ۵. ارسال تمام داده‌های پردازش‌شده به CategoryTemplate
  return (
    <CategoryTemplate
      categoryHandle={params.category}
      sortBy={sortBy}
      page={String(page)}
      optionsFilters={optionsFilters}
      countryCode={params.countryCode}
      // پاس دادن فیلترهای جدید به عنوان Props
      inStock={inStock}
      minPrice={minPrice!}
      maxPrice={maxPrice!}
    />
  )
}
