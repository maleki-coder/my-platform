import { HttpTypes } from "@medusajs/types"
import MainCharacterOptions from "@modules/products/components/main-product-options"
import ProductGallery from "@modules/products/components/product-gallery"
import ProductOptionsList from "@modules/products/components/product-options-list"
import ProductTabs from "@modules/products/components/product-tabs"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfoSection = ({ product }: ProductInfoProps) => {
  return (
    <div
      id="product-info"
      className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-6 grow md:rounded-2xl border-gray-200 xl:min-w-185.5 2xl:min-w-0 2xl:max-w-300 bg-white shadow-custom border p-0 md:p-6 mx-auto"
    >
      {/* LEFT COLUMN (Top on Mobile): Image Gallery */}
      <div className="w-full z-0">
        <ProductGallery product={product} />
      </div>

      {/* RIGHT COLUMN (Bottom on Mobile): Product Details */}
      <div className="flex flex-col gap-y-4 w-full">
        <h2
          className="text-sm leading-6.5 wrap-break-word md:text-lg font-bold text-gray-900 md:p-0 px-4"
          data-testid="product-title"
        >
          {product.title}
        </h2>

        <p
          className="text-medium whitespace-pre-line text-gray-600 leading-relaxed md:p-0 px-4"
          data-testid="product-description"
        >
          {product.description}
        </p>
        <div className="md:p-0 px-4">
          <ProductOptionsList product={product} />
        </div>
          <MainCharacterOptions productId={product.id} />
      </div>

      {/* ProductTabs spans full width across both columns */}
      <div className="col-span-1 lg:col-span-2">
        <ProductTabs product={product} />
      </div>
    </div>
  )
}

export default ProductInfoSection
