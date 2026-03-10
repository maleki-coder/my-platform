const SkeletonLineItemMobile = () => {
  return (
    <div className="w-full pb-6 border-b mt-1 border-gray-200 animate-pulse">
      {/* top section */}
      <div className="flex w-full items-stretch">
        {/* left content */}
        <div className="flex w-2/3 flex-col gap-2">
          <div className="h-5 w-10 bg-gray-200 rounded" />

          <div className="flex flex-col pl-4 gap-3">
            {/* title */}
            <div className="h-4 w-32 bg-gray-200 rounded" />

            {/* stock row */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        {/* image */}
        <div className="w-1/3 pt-3 flex justify-end">
          <div className="w-20 h-20 bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* bottom section */}
      <div className="w-full flex flex-col mt-3">
        <div className="flex items-stretch">
          {/* variant + quantity */}
          <div className="flex flex-1 flex-col gap-4">
            {/* variant tags */}
            <div className="flex gap-2">
              <div className="h-4 w-12 bg-gray-200 rounded" />
              <div className="h-4 w-10 bg-gray-200 rounded" />
            </div>

            {/* quantity selector */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded" />
              <div className="w-6 h-4 bg-gray-200 rounded" />
              <div className="w-8 h-8 bg-gray-200 rounded" />
            </div>
          </div>

          {/* price column */}
          <div className="flex flex-1 flex-col items-end justify-end pr-4 pb-2 gap-2">
            <div className="h-4 w-10 bg-gray-200 rounded" />
            <div className="h-5 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonLineItemMobile
