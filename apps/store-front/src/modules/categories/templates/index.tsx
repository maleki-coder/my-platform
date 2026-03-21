import { notFound } from "next/navigation"
import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import CategoryPaginatedProducts from "@modules/categories/components/category-paginated-products"
import BreadCrumbs from "@modules/common/components/bread-crumbs"
import { getDeviceFromCookie } from "@lib/util/get-deivce-from-cookie"
import CategorySidebarWrapper from "@modules/categories/components/category-filter-sidebar-wrapper"
import { SortOptions } from "@modules/categories/components/category-order-filter"
import ChildCategpryChips from "@modules/common/components/child-category-chips"
import { ProductSearchParams } from "@lib/types"

export default async function CategoryTemplate({
  categoryHandle,
  countryCode,
  queryParams
}: {
  categoryHandle: string[]
  countryCode: string
  queryParams: ProductSearchParams
}) {
  const { isMobile } = await getDeviceFromCookie()

  if (!categoryHandle || !countryCode) notFound()

  return (
    <div
      className="mx-auto w-full max-w-screen-2xl px-4 lg:px-20"
      data-testid="category-container"
    >
      <BreadCrumbs data-testid="bread-crumb" categoryHandle={categoryHandle} />
      <ChildCategpryChips categoryHandle={categoryHandle}/>
      <div className="mt-4 md:mt-8 flex gap-4">
        <CategorySidebarWrapper
          categoryHandle={categoryHandle}
          isMobile={isMobile}
          order={queryParams.order as SortOptions}
        >
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={isMobile ? 2 : 3}
                isMobile={isMobile}
              />
            }
          >
            <CategoryPaginatedProducts
              categoryHandle={categoryHandle}
              countryCode={countryCode}
              queryParams={queryParams}
              isMobile={isMobile} 
              />
          </Suspense>
        </CategorySidebarWrapper>
      </div>
    </div>
  )
}
