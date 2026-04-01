import { getCategoryByHandle } from "@lib/data/categories"
import { listProductsWithSort } from "@lib/data/products"
import MobileProductPreview from "@modules/products/components/mobile-product-preview"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/categories/components/category-product-pagination"
import NoProductFound from "@modules/categories/components/no-product-found"
import { CategoryPaginatedProductsProps } from "@lib/types"

export default async function CategoryPaginatedProducts({
  categoryHandle,
  countryCode,
  queryParams,
}: CategoryPaginatedProductsProps) {
  const productCategory = await getCategoryByHandle(categoryHandle)

  if (productCategory?.id) {
    queryParams.category_id = productCategory.id
  }

  const {
    response: { products },
    page,
    totalPages,
  } = await listProductsWithSort({
    queryParams,
    countryCode,
  })

  if (!products || products.length === 0) {
    return <NoProductFound />
  }

  return (
    <>
      <ul
        className="w-full grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-0 md:gap-2"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <div className="block md:hidden">
                <MobileProductPreview product={p} />
              </div>
              <div className="md:block hidden">
                <ProductPreview product={p} />
              </div>
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
