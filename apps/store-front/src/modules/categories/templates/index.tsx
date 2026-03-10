import { notFound } from "next/navigation"
import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import BreadCrumbs from "@modules/common/components/bread-crumbs"
import Divider from "@modules/common/components/divider"
import { getDeviceFromCookie } from "@lib/util/get-deivce-from-cookie"
import CategorySidebarWrapper from "@modules/categories/components/category-filter-sidebar-wrapper"
import { SortOptions } from "@modules/categories/components/category-order-filter"

export default async function CategoryTemplate({
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
    <div
      className="mx-auto w-full max-w-screen-2xl px-4 lg:px-20"
      data-testid="category-container"
    >
      <BreadCrumbs data-testid="bread-crumb" category={category} />
      <Divider />
      <div className="mt-4 md:mt-8 flex gap-4">
        <CategorySidebarWrapper isMobile={isMobile} sortBy={sort}>
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={isMobile ? 2 : 3}
                isMobile={isMobile}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryIds={categoryIds}
              countryCode={countryCode}
              isMobile={isMobile}
            />
          </Suspense>
        </CategorySidebarWrapper>
      </div>
    </div>
  )
}