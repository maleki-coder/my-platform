import repeat from "@lib/util/repeat"
import SkeletonLineItemDesktop from "@modules/skeletons/components/skeleton-line-item-desktop"
import SkeletonLineItemMobile from "@modules/skeletons/components/skeleton-line-item-mobile"
import SkeletonSummaryCart from "@modules/skeletons/components/skeleton-summary-cart"

export default function Loading() {
  return (
    <div
      className="max-w-screen-2xl px-4 mt-2 md:mt-8"
      data-testid="cart-container"
    >
      <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-16">
        <div className="flex flex-col bg-white gap-y-6">
          <div className="md:block hidden">
            {repeat(3).map((i) => {
              return <SkeletonLineItemDesktop key={i} />
            })}
          </div>
          <div className="md:hidden block">
            <div className="max-w-full flex flex-col pb-2 px-4 md:px-8 overflow-x-hidden">
              {repeat(3).map((i) => {
                return <SkeletonLineItemMobile key={i} />
              })}
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="flex flex-col gap-y-8 sticky top-12">
            <div className="bg-white">
              <SkeletonSummaryCart />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
