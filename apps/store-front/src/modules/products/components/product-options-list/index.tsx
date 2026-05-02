"use client"

import { HttpTypes } from "@medusajs/types"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import Divider from "@modules/common/components/divider"
import { useProductSelection } from "@modules/products/components/product-selection-provider"

export default function ProductOptionsList({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const { options, setOptionValue } = useProductSelection()

  if ((product.variants?.length ?? 0) <= 1) return null

  return (
    <div className="flex flex-col gap-y-4 mt-8">
      <Divider />
      {(product.options || []).map((option) => (
        <div key={option.id}>
          <OptionSelect
            option={option}
            current={options[option.id]}
            updateOption={setOptionValue}
            title={option.title ?? ""}
            data-testid="product-options"
            disabled={false}
          />
        </div>
      ))}
    </div>
  )
}
