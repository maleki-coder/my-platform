import repeat from "@lib/util/repeat"
import SkeletonMobileProductPreview from "@modules/skeletons/components/skeleton-mobile-product-preview"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

const SkeletonProductGrid = ({
  numberOfProducts = 8,
  isMobile
}: {
  numberOfProducts?: number,
  isMobile: boolean
}) => {
  const SkeletonComponent = isMobile
    ? SkeletonMobileProductPreview
    : SkeletonProductPreview
  return (
    <ul
      className="w-full grid grid-cols-1 small:grid-cols-3 medium:grid-cols-3 gap-2"
      data-testid="products-list-loader"
    >
      {repeat(numberOfProducts).map((index) => (
        <li key={index}>
          <SkeletonComponent />
        </li>
      ))}
    </ul>
  )
}

export default SkeletonProductGrid
