const SkeletonProductPreview = () => {
  return (
    <div className="animate-pulse">
      <section className="relative w-full rounded-md bg-white pt-13 border shadow-custom">
        {/* Discount badge placeholder */}

        <div className="absolute top-4 w-full px-5">
          <div className="h-5 w-full bg-gray-200 rounded"></div>
        </div>

        {/* Image area */}

        <div className="mb-5.5 flex h-51.5 gap-2.25">
          <div className="relative mx-auto">
            <div className="w-51.5 h-51.5 bg-gray-200 rounded-md"></div>
          </div>
        </div>

        {/* Title */}

        <div className="px-4 pt-2.5">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>

            <div className="h-4 bg-gray-200 rounded w-5/6"></div>

            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>

        {/* Price */}

        <div className="flex items-center gap-x-2 px-4 pt-3 pb-4">
          <div className="h-5 w-16 bg-gray-200 rounded"></div>

          <div className="h-5 w-12 bg-gray-200 rounded"></div>
        </div>
      </section>
    </div>
  )
}

export default SkeletonProductPreview
