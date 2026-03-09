import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getDeviceFromCookie } from "@lib/util/get-deivce-from-cookie"
import { SortOptions } from "@modules/categories/components/category-order-filter"
import MobileProductPreview from "@modules/products/components/mobile-product-preview"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryIds,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryIds?: string[]
  productsIds?: string[]
  countryCode: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryIds && categoryIds.length > 0) {
    queryParams.category_id = categoryIds
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page: 1,
    queryParams,
    sortBy,
    countryCode,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)
  const { isMobile } = await getDeviceFromCookie()
  return (
    <>
      <ul
        className="w-full grid grid-cols-1 small:grid-cols-3 medium:grid-cols-3 gap-2"
        data-testid="products-list"
      >
        {products
          // .concat(products[0])
          // .concat(products[0])
          // .concat(products[0])
          // .concat(products[0])
          // .concat(products[0])
          // .concat(products[0])
          // .concat(products[0])
          // .concat(products[0])
          // .concat(products[0])
          // .concat(products[0])
          // .concat(products[0])
          // .concat(products[0])
          // .concat(products[0])
          // .concat(products[0])
          // .concat(products[0])
          // .concat(products[0])
          .map((p) => {
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
      {/* {totalPages > 1 && ( */}
      <Pagination
        data-testid="product-pagination"
        page={page}
        totalPages={totalPages}
      />
      {/* )} */}
    </>
  )
}
