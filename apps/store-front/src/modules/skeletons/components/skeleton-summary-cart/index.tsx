const SkeletonSummaryCart = () => {
  return (
    <div className="flex flex-col gap-y-2 md:mb-0 mb-40 animate-pulse">
      {/* Header */}
      <div className="px-4">
        <div className="h-6 w-28 bg-gray-200 rounded" />
      </div>

      {/* Cart Totals Skeleton */}
      <div className="flex flex-col gap-y-3 px-4 py-3">
        {/* subtotal */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>

        {/* shipping */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-14 bg-gray-200 rounded" />
        </div>

        {/* tax */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-14 bg-gray-200 rounded" />
        </div>

        {/* divider */}
        <div className="h-px w-full bg-gray-200 my-2" />

        {/* total */}
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 bg-gray-300 rounded" />
          <div className="h-5 w-24 bg-gray-300 rounded" />
        </div>
      </div>

      {/* Desktop Button */}
      <div className="md:block hidden px-4">
        <div className="h-13 w-full rounded-sm bg-gray-200" />
      </div>

      {/* Mobile Fixed Button */}
      <div className="md:hidden block">
        <div className="fixed bottom-20 right-0 z-20 w-full border-t border-gray-300 bg-gray-100 px-6 py-4">
          <div className="h-13 w-full rounded-sm bg-gray-200" />
        </div>
      </div>
    </div>
  )
}

export default SkeletonSummaryCart
