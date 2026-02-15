import { FC } from "react"

interface VariantTagScrollProps {
  /**
   * The variant title to display (e.g. "Large", "Red", "XL / Blue")
   */
  variantTitle: string | undefined | null

  /**
   * Optional custom className for the outer container
   */
  className?: string

  /**
   * Optional className for the individual tag
   */
  tagClassName?: string

  /**
   * Optional className for the text inside the tag
   */
  textClassName?: string
}

/**
 * A horizontally scrollable single tag component that displays a variant title.
 * Useful in cart items, product summaries, order reviews, etc.
 * Scrolls smoothly on mobile when content might overflow.
 */
export const VariantTagScroll: FC<VariantTagScrollProps> = ({
  variantTitle,
  className = "",
  tagClassName = "",
  textClassName = "",
}) => {
  // Early return if no title to show
  if (!variantTitle) {
    return null
  }

  return (
    <div className={`relative flex w-full items-center ${className}`}>
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex items-center scroll-smooth lg:pr-0">
          <div className="flex items-center gap-2.5 w-fit flex-nowrap">
            <div
              className={`
                flex w-max items-center border p-0.75 h-6.5 rounded-sm lg:rounded-md
                ${tagClassName}
              `}
            >
              <p
                className={`
                  mx-2 select-none max-w-45 overflow-x-auto whitespace-nowrap text-xs leading-5 
                  font-bold text-gray-700
                  ${textClassName}
                `}
              >
                {variantTitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
