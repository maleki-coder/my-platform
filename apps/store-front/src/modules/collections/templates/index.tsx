import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import CategoryPaginatedProducts from "@modules/categories/components/category-paginated-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/categories/components/category-order-filter"

export default function CollectionTemplate({
  order,
  collection,
  page,
  countryCode,
  isMobile,
}: {
  order?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
  isMobile: boolean
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = order || "created_at"

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 max-w-screen-2xl">
      {/* <RefinementList order={order} /> */}
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
          {/* <CategoryPaginatedProducts
            order={order}
            page={pageNumber}
            collectionId={collection.id}
            countryCode={countryCode}
            isMobile={isMobile} categoryHandle={[]}          /> */}
        </Suspense>
      </div>
    </div>
  )
}
