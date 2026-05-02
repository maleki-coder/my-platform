import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductOptionsList from "@modules/products/components/product-options-list"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfoSection = ({ product }: ProductInfoProps) => {
  return (
    <div
      id="product-info"
      className="flex flex-col gap-y-6 min-w-142 grow rounded-2xl border-gray-200 xl:min-w-185.5 2xl:min-w-0 2xl:max-w-292 border p-6"
    >
      {product.collection && (
        <LocalizedClientLink
          href={`/collections/${product.collection.handle}`}
          className="text-medium"
        >
          {product.collection.title}
        </LocalizedClientLink>
      )}
      <h2
        className="text-3xl leading-10 "
        data-testid="product-title"
      >
        {product.title}
      </h2>

      <p
        className="text-medium whitespace-pre-line"
        data-testid="product-description"
      >
        {product.description}
      </p>

      <ProductOptionsList product={product} />
    </div>
  )
}

export default ProductInfoSection
