import repeat from "@lib/util/repeat"
import SkeletonMobileProductPreview from "@modules/skeletons/components/skeleton-mobile-product-preview"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

interface SkeletonProductGridProps {
  numberOfProducts?: number
  mobileLimit?: number // How many items to show on mobile before hiding the rest
}

const SkeletonProductGrid = ({
  numberOfProducts = 8,
  mobileLimit = 8, // Default to showing all on mobile unless specified
}: SkeletonProductGridProps) => {
  return (
    <ul
      className="w-full grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-0 md:gap-2"
      data-testid="products-list-loader"
    >
      {repeat(numberOfProducts).map((index) => {
        // Mathematical logic: If the current index (0-based) is greater than or equal 
        // to our mobile limit, we hide the entire <li> wrapper on mobile! ($index \ge 2$)
        const isHiddenOnMobile = index >= mobileLimit;

        return (
          <li 
            key={index} 
            className={isHiddenOnMobile ? "hidden md:block" : "block"}
          >
            {/* MOBILE SKELETON: Visible only on small screens */}
            <div className="block md:hidden">
              <SkeletonMobileProductPreview />
            </div>

            {/* DESKTOP SKELETON: Visible only on md screens and up */}
            <div className="hidden md:block">
              <SkeletonProductPreview />
            </div>
          </li>
        );
      })}
    </ul>
  )
}

export default SkeletonProductGrid
