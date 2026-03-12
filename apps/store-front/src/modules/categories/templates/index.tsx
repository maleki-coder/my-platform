import { notFound } from "next/navigation"
import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import BreadCrumbs from "@modules/common/components/bread-crumbs"
import Divider from "@modules/common/components/divider"
import { getDeviceFromCookie } from "@lib/util/get-deivce-from-cookie"
import CategorySidebarWrapper from "@modules/categories/components/category-filter-sidebar-wrapper"
import { SortOptions } from "@modules/categories/components/category-order-filter"

export default async function CategoryTemplate({
  categoryHandle,
  sortBy,
  page,
  countryCode,
  optionsFilters,
  inStock, // دریافت پراپ جدید
  minPrice, // دریافت پراپ جدید
  maxPrice,
}: {
  categoryHandle: string[]
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionsFilters: Record<string, string[]>
  inStock: boolean // دریافت پراپ جدید
  minPrice: number // دریافت پراپ جدید
  maxPrice: number
}) {
  const { isMobile } = await getDeviceFromCookie()
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!categoryHandle || !countryCode) notFound()

  return (
    <div
      className="mx-auto w-full max-w-screen-2xl px-4 lg:px-20"
      data-testid="category-container"
    >
      <BreadCrumbs data-testid="bread-crumb" categoryHandle={categoryHandle} />
      <Divider />
      <div className="mt-4 md:mt-8 flex gap-4">
        <CategorySidebarWrapper
          categoryHandle={categoryHandle}
          isMobile={isMobile}
          sortBy={sort}
        >
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
              inStock={inStock}
              minPrice={minPrice}
              maxPrice={maxPrice}
              optionsFilters={optionsFilters}
              page={pageNumber}
              categoryHandle={categoryHandle}
              countryCode={countryCode}
              isMobile={isMobile}
            />
          </Suspense>
        </CategorySidebarWrapper>
      </div>
    </div>
  )
}
