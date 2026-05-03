import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })
  const selectedPrice = variant ? variantPrice : cheapestPrice
  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }
  const original = Number(selectedPrice?.original_price_number ?? 0)
  const calculated = Number(selectedPrice?.calculated_price_number ?? 0)
  const calculatedDiscountPrice = convertToLocale({
    amount: original - calculated,
  })
  return (
    <div
      className={`flex w-full px-0 md:px-4 pb-4 ${
        Number(selectedPrice?.percentage_diff) > 0
          ? "justify-between"
          : "justify-end"
      }`}
    >
      {Number(selectedPrice?.percentage_diff) > 0 ? (
        <div className="min-w-6 text-white lg:min-w-7 flex h-4.25 items-center justify-center gap-1 rounded-sm px-2 py-3 lg:h-4.75 bg-red-700">
          <span className="text-small-semi md:text-large-semi flex justify-center">
            {calculatedDiscountPrice}
          </span>
          <span className="text-xs">تومان تخفیف</span>
        </div>
      ) : null}
      <div className="flex flex-col items-end gap-1.5">
        <p className="text-large-semi md:text-lg md:font-semibold leading-5">
          {selectedPrice?.calculated_price}
          <span className="text-xs mr-1 font-medium leading-5">تومان</span>
        </p>
        <div
          className={`text-large-regular flex items-end gap-1 ${
            Number(selectedPrice?.percentage_diff) > 0 ? "visible" : "invisible"
          }`}
        >
          <span className="text-grey-40 line-through">
            {selectedPrice?.original_price}
          </span>
          <span className="text-grey-40 text-xs leading-5">تومان</span>
        </div>
      </div>
    </div>
  )
}
