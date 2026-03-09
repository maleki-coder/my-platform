const SkeletonMobileProductPreview = () => {
  return (
    <div className="animate-pulse">
      <section className="relative w-full border-b mt-1 border-gray-200 last:border-none">
        {/* Discount badge */}

        <div className="pl-4 pt-2">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
        </div>

        <div className="flex w-full items-stretch mt-2">
          {/* Left content */}

          <div className="flex w-2/3 flex-col gap-1">
            <div className="flex flex-col justify-between pl-4">
              {/* Title lines */}

              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>

                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>

              {/* Small indicator */}

              <div className="mt-2.5 flex items-center">
                <div className="h-2 w-5 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          {/* Image */}

          <div className="ml-auto">
            <div className="w-29.5 h-29.5 bg-gray-200 rounded-md"></div>
          </div>
        </div>

        {/* Price */}

        <div className="flex items-center gap-x-2 mt-4 pl-4 pb-4">
          <div className="h-4 w-14 bg-gray-200 rounded"></div>

          <div className="h-4 w-10 bg-gray-200 rounded"></div>
        </div>
      </section>
    </div>
  )
}

export default SkeletonMobileProductPreview
