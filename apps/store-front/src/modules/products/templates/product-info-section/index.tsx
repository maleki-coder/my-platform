import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductOptionsList from "@modules/products/components/product-options-list"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfoSection = ({ product }: ProductInfoProps) => {
  return (
    <div
      id="product-info"
      // We use a CSS Grid here. 1 column on mobile, 2 perfectly equal columns on large screens!
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-w-142 grow rounded-2xl border-gray-200 xl:min-w-185.5 2xl:min-w-0 2xl:max-w-300 bg-white shadow-custom border p-6 mx-auto"
    >
      {/* LEFT COLUMN: Image Gallery */}
      {/* RIGHT COLUMN: Product Details */}
      <div className="flex flex-col gap-y-6 w-full">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        
        <h2
          className="text-3xl leading-10 font-bold text-gray-900"
          data-testid="product-title"
        >
          {product.title}
        </h2>

        <p
          className="text-medium whitespace-pre-line text-gray-600 leading-relaxed"
          data-testid="product-description"
        >
          {product.description}
        </p>

        {/* Separator line for visual hierarchy */}
        <hr className="border-t border-gray-100 my-2" />

        <div className="mt-4">
            <ProductOptionsList product={product} />
        </div>
      </div>
      <div className="w-full flex flex-col">
        <ImageGallery images={product.images!} title={product.title} />
      </div>

    </div>
  )
}

export default ProductInfoSection
