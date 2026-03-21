import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { HttpTypes, StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { BaseProductOrderParams, BaseProductSearchParams, OptionsProductSearchParams, ProductSearchParams, StandardProductQueryParams } from "@lib/types"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<
    ProductSearchParams
  >
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
  const queryParams = await props.searchParams
  const urlParams = await props.params

  if (!urlParams.category || !urlParams.countryCode) {
    notFound()
  }

  // const standardParams = [
  //   "order",
  //   "page",
  //   "limit",
  //   "in_stock",
  //   "min_price",
  //   "max_price",
  // ]

  // const optionsFilters: OptionsProductSearchParams = {}

  // // extract option filters from query params
  // Object.keys(queryParams).forEach((key) => {
  //   if (!standardParams.includes(key) && queryParams[key]) {
  //     const paramValue = queryParams[key] as any;

  //     if (typeof paramValue === "string") {
  //       optionsFilters[key] = paramValue.split(",")
  //     } else if (Array.isArray(paramValue)) {
  //       optionsFilters[key] = paramValue.flatMap((v) => v.split(","))
  //     }
  //   }
  // })
  // // for saftey reason
  // const inStock = queryParams.in_stock === "true"
  // const minPriceStr = queryParams.min_price as string | undefined
  // const minPrice =
  //   minPriceStr && !isNaN(parseInt(minPriceStr, 10))
  //     ? parseInt(minPriceStr, 10)
  //     : undefined

  // const maxPriceStr = queryParams.max_price as string | undefined
  // const maxPrice =
  //   maxPriceStr && !isNaN(parseInt(maxPriceStr, 10))
  //     ? parseInt(maxPriceStr, 10)
  //     : undefined
  // // setting standard filters
  // let standardFilters: ProductSearchParams = {}
  // standardFilters = {
  //   order: queryParams.order,
  //   page: queryParams.page! || 1,
  //   limit: queryParams.limit! || 100,
  //   min_price: minPrice!,
  //   max_price: maxPrice!,
  // }
  // if (inStock) {
  //   standardFilters = {
  //     in_stock: String(inStock),
  //     ...standardFilters,
  //   }
  // }
  return (
    <CategoryTemplate
      categoryHandle={urlParams.category}
      countryCode={urlParams.countryCode}
      queryParams={queryParams}
      // standardFilters={standardFilters}
      // optionsFilters={optionsFilters}
    />
  )
}
