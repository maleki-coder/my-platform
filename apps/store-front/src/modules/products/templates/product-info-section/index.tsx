import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MainCharacterOptions from "@modules/products/components/main-product-options"
import ProductGallery from "@modules/products/components/product-gallery"
import ProductOptionsList from "@modules/products/components/product-options-list"
type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfoSection = ({ product }: ProductInfoProps) => {
  return (
    <div
      id="product-info"
      // We use a CSS Grid here. 1 column on mobile, 2 perfectly equal columns on large screens!
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 grow rounded-2xl border-gray-200 xl:min-w-185.5 2xl:min-w-0 2xl:max-w-300 bg-white shadow-custom border p-0 md:p-6 mx-auto"
    >
      {/* LEFT COLUMN (Top on Mobile): Image Gallery */}
      <div className="w-full z-0">
        <ProductGallery product={product} />
      </div>

      {/* RIGHT COLUMN (Bottom on Mobile): Product Details */}
      <div className="flex flex-col gap-y-4 w-full md:p-0 p-4">
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

        {/* Your shiny new Main Character component! */}

        {/* Separator line for visual hierarchy */}
        {/* <hr className="border-t border-gray-100 my-2" /> */}

        {/* <div className="mt-4"> */}
        <ProductOptionsList product={product} />
        <MainCharacterOptions productId={product.id} />
        {/* </div> */}
      </div>
    </div>
  )
}

export default ProductInfoSection
