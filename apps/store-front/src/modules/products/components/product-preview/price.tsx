import { convertToLocale } from "@lib/util/money"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <div
      className={`flex w-full px-4 ${
        Number(price?.percentage_diff) > 0 ? "justify-between" : "justify-end"
      }`}
    >
      {Number(price?.percentage_diff) > 0 ? (
        <div className="min-w-6 lg:min-w-7 flex h-4.25 items-center! justify-center gap-1 rounded-sm px-1 lg:h-4.75 bg-red-700">
          <span className="text-white">%</span>
          <span className="flex items-center justify-center pt-px text-center text-sm font-semibold leading-4 text-white lg:pt-0.75">
            {convertToLocale({ amount: Number(price?.percentage_diff) })}
          </span>
        </div>
      ) : null}
      <div className="flex flex-col items-end gap-1.5">
        <p className="text-xl font-semibold leading-5">
          {price?.calculated_price}
          <span className="text-xs mr-1 font-medium leading-5">تومان</span>
        </p>
        <div
          className={`mb-1 mt-2 text-sm flex gap-1 ${
            Number(price?.percentage_diff) > 0 ? "visible" : "invisible"
          }`}
        >
          <span className="text-grey-40 line-through">
            {price?.original_price}
          </span>
          <span className="text-grey-40 text-xs leading-5">تومان</span>
        </div>
      </div>
    </div>
  )
}
