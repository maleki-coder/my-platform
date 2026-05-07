import { ProductTabsProps } from "@modules/products/components/product-tabs"
import { useState, useMemo } from "react"

// Technical Specifications Section Component
export const TechnicalSpecificationsSection = ({ product }: ProductTabsProps) => {
  const [showAll, setShowAll] = useState(false)

  const variantOptionIds = useMemo(() => {
    const ids = new Set<string>()
    product.variants?.forEach((variant) => {
      variant.options?.forEach((option) => {
        ids.add(option.option_id!)
      })
    })
    return ids
  }, [product.variants])

  const nonVariantOptions =
    product.options?.filter((option) => !variantOptionIds.has(option.id)) || []

  const INITIAL_DISPLAY_COUNT = 5
  const hasMoreOptions = nonVariantOptions.length > INITIAL_DISPLAY_COUNT
  const displayedOptions = showAll
    ? nonVariantOptions
    : nonVariantOptions.slice(0, INITIAL_DISPLAY_COUNT)

  if (nonVariantOptions.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 md:p-0 px-4">مشخصات فنی</h3>
        <div className="border rounded-xl p-6 bg-gray-50 text-center text-gray-500">
          مشخصات فنی برای این محصول موجود نیست
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4 md:p-0 px-4">مشخصات فنی</h3>
      <div className="border md:rounded-xl overflow-hidden bg-white">
        <div className="divide-y divide-gray-200">
          {displayedOptions.map((option) => (
            <div
              key={option.id}
              className="grid grid-cols-1 md:grid-cols-2 hover:bg-gray-50 transition-colors"
            >
              <div className="px-6 py-4 bg-gray-50 md:bg-transparent">
                <span className="font-semibold text-gray-900 text-sm">
                  {option.title}
                </span>
              </div>
              <div className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {option.values && option.values.length > 0 ? (
                    option.values.map((value) => (
                      <span
                        key={value.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {value.value}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">-</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMoreOptions && (
          <div className="border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full px-6 py-4 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              {showAll ? (
                <>
                  <span>نمایش کمتر</span>
                  <svg
                    className="w-4 h-4 transform rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </>
              ) : (
                <>
                  <span>نمایش بیشتر</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}