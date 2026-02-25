import { notFound } from "next/navigation"
import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import BreadCrumbs from "@modules/common/components/bread-crumbs"
import Divider from "@modules/common/components/divider"
import { getDeviceFromCookie } from "@lib/util/get-deivce-from-cookie"
import CategorySidebarWrapper from "../components/category-filter-sidebar-wrapper"

export default async function  CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const { isMobile } = await getDeviceFromCookie()
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)
  const categoryIds: string[] = [
    category.id,
    ...(category.category_children?.map((c) => c.id) ?? []),
  ]

  return (
    <div className="py-6 content-container" data-testid="category-container">
      <BreadCrumbs category={category} />
      <Divider />
      <div className="mt-8 flex gap-4">
        <CategorySidebarWrapper isMobile={isMobile}>
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={category.products?.length ?? 8}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryIds={categoryIds}
              countryCode={countryCode}
            />
          </Suspense>
        </CategorySidebarWrapper>
      </div>
    </div>
  )
}

      {/* <Divider/> */}
      {/* <article className="flex w-full items-start justify-between gap-8">
        <section className="flex min-w-142 grow rounded-2xl border-primary-tint-8 xl:min-w-185.5 2xl:min-w-0 2xl:max-w-292 2xl:border">
          <div className="relative flex w-[55%] flex-col items-start pb-10 pr-4 pt-6 2xl:pr-10.5 2xl:pt-10.5">
            <div className="flex w-full flex-wrap items-center gap-x-2.5">
              <h1 className="left-8 line-clamp-3 text-lg font-semibold leading-8.5 -tracking-0.5 text-primary-shade-1 xl:line-clamp-2">
                {}
              </h1>
            </div>
            <h2 className="mt-3 text-sm font-medium leading-5 -tracking-0.5 text-primary-tint-1"></h2>
            <div className="mt-2 flex items-center gap-2"></div>
            <div className="mb-6 mt-4 flex w-full flex-col"></div>
            <div className="mb-2 text-sm font-semiBold text-primary-shade-1"></div>
            <div className="rounded-md border border-solid border-primary-tint-8 bg-white py-3.5 pl-4 pr-4 lg:py-4.5 lg:pl-7.5 lg:pr-5 w-full"></div>
            <div className="w-full h-4"></div>
          </div>
          <section className="flex w-[45%] flex-col pb-10.5 pr-5 pt-7 2xl:pl-13 2xl:pr-11.5 2xl:pt-9.5"></section>
        </section>
        <section className="relative mt-10 w-77.25 pl-4 xl:w-98 2xl:mr-3 2xl:mt-0 2xl:min-h-169.5 2xl:w-96 2xl:pl-0"></section>
      </article> */}
      {/* <div className="w-full">
        <div className="flex flex-row mb-8 text-2xl-semi gap-4">
          {parents &&
            parents.map((parent) => (
              <span key={parent.id} className="text-ui-fg-subtle">
                <LocalizedClientLink
                  className="mr-4 hover:text-black"
                  href={`/categories/${parent.handle}`}
                  data-testid="sort-by-link"
                >
                  {parent.name}
                </LocalizedClientLink>
                /
              </span>
            ))}
          <h1 data-testid="category-page-title">{category.name}</h1>
        </div>
        {category.description && (
          <div className="mb-8 text-base-regular">
            <p>{category.description}</p>
          </div>
        )}
        {category.category_children && (
          <div className="mb-8 text-base-large">
            <ul className="grid grid-cols-1 gap-2">
              {category.category_children?.map((c) => (
                <li key={c.id}>
                  <InteractiveLink href={`/categories/${c.handle}`}>
                    {c.name}
                  </InteractiveLink>
                </li>
              ))}
            </ul>
          </div>
        )}
          */}
    // </div>
    // </div>
//   )
// }
