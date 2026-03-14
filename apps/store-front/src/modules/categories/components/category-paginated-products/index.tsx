import { getCategoryByHandle } from "@lib/data/categories"
import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { SortOptions } from "@modules/categories/components/category-order-filter"
import MobileProductPreview from "@modules/products/components/mobile-product-preview"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/categories/components/category-product-pagination"
import NoProductFound from "@modules/categories/components/no-product-found"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string
  id?: string[]
  order?: string
  in_stock?: string
  min_price?: number
  max_price?: number
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  productsIds,
  countryCode,
  isMobile,
  optionsFilters,
  categoryHandle,
  inStock,
  minPrice,
  maxPrice,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  productsIds?: string[]
  countryCode: string
  isMobile: boolean
  optionsFilters: Record<string, string[]>
  categoryHandle: string[]
  inStock?: boolean
  minPrice?: number
  maxPrice?: number
}) {
  const productCategory = await getCategoryByHandle(categoryHandle)
  const queryParams: PaginatedProductsParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (productCategory?.id) {
    queryParams.category_id = productCategory.id
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  if (inStock === true) {
    queryParams["in_stock"] = String(inStock)
  }

  if (minPrice) {
    queryParams["min_price"] = minPrice
  }

  if (maxPrice) {
    queryParams["max_price"] = maxPrice
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page: page,
    queryParams,
    sortBy,
    countryCode,
    optionsFilters,
  })

  if (!products || products.length === 0) {
   return <NoProductFound/>
  }

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <ul
        className="w-full grid grid-cols-1 small:grid-cols-3 medium:grid-cols-3 gap-2"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              {isMobile ? (
                <MobileProductPreview product={p} />
              ) : (
                <ProductPreview product={p} />
              )}
            </li>
          )
        })}
      </ul>

      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
