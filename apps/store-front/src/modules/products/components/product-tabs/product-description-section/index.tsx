import { ProductTabsProps } from "@modules/products/components/product-tabs"

// Product Description Section Component
export const ProductDescriptionSection = ({ product }: ProductTabsProps) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4 md:p-0 px-4">شرح</h3>
      <div className="border md:rounded-xl p-6 bg-gray-50">
        {product.description}
      </div>
    </div>
  )
}