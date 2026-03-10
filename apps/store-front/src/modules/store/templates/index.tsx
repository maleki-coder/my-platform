import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

import PaginatedProducts from "./paginated-products"
import { SortOptions } from "@modules/categories/components/category-order-filter"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  isMobile,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  isMobile: boolean
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      {/* <RefinementList sortBy={sort} /> */}
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1 data-testid="store-page-title">All products</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid isMobile={isMobile} />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            isMobile={isMobile}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
