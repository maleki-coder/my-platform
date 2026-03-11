import { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  getCategoryByHandle,
  getProductCategoryOptions,
  listCategories,
} from "@lib/data/categories"
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
  const sortBy = searchParams.sortBy as SortOptions
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1

  const productCategory = await getCategoryByHandle(params.category)
  const filterOptions = await getProductCategoryOptions(productCategory.id)
  if (!productCategory) {
    notFound()
  }
  const standardParams = ["sortBy", "page", "countryCode"]
  const optionsFilters: Record<string, string[]> = {}

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
  return (
    <CategoryTemplate
      category={productCategory}
      sortBy={sortBy}
      filterOptions={filterOptions}
      page={String(page)}
      optionsFilters={optionsFilters}
      countryCode={params.countryCode}
    />
  )
}
