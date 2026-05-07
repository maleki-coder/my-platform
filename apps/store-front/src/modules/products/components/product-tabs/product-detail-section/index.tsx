import { ProductTabsProps } from "@modules/products/components/product-tabs"

// Product Details Section Component
export const ProductDetailsSection = ({ product }: ProductTabsProps) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4 md:p-0 px-4">جزئیات محصول</h3>
      <div className="border md:rounded-xl p-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <span className="font-semibold text-gray-700 block mb-1">
                جنس ساخت
              </span>
              <p className="text-gray-600">
                {product.material ? product.material : "-"}
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-700 block mb-1">
                کشور سازنده
              </span>
              <p className="text-gray-600">
                {product.origin_country ? product.origin_country : "-"}
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-700 block mb-1">
                نوع
              </span>
              <p className="text-gray-600">
                {product.type ? product.type.value : "-"}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <span className="font-semibold text-gray-700 block mb-1">
                وزن
              </span>
              <p className="text-gray-600">
                {product.weight ? `${product.weight} g` : "-"}
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-700 block mb-1">
                ابعاد
              </span>
              <p className="text-gray-600">
                {product.length && product.width && product.height
                  ? `${product.length}L x ${product.width}W x ${product.height}H`
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}