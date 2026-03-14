import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PaginatedProducts from "@modules/categories/components/category-paginated-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/categories/components/category-order-filter"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
  isMobile,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
  isMobile: boolean
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
      {/* <RefinementList sortBy={sort} /> */}
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1>{collection.title}</h1>
        </div>
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={collection.products?.length}
              isMobile={isMobile}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            collectionId={collection.id}
            countryCode={countryCode}
            isMobile={isMobile}
          />
        </Suspense>
      </div>
    </div>
  )
}
