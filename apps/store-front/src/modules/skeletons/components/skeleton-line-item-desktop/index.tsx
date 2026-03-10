const SkeletonLineItemDesktop = () => {
  return (
    <div className="relative mb-6 flex w-full flex-col rounded-2xl border px-11 pb-11 pt-6 animate-pulse">
      
      {/* discount icon placeholder */}
      <div className="absolute h-6 w-15 top-3 bg-gray-200 rounded" />

      {/* delete button */}
      <div className="absolute p-2 left-3 top-2 border rounded-4xl">
        <div className="w-4 h-4 bg-gray-200 rounded-full" />
      </div>

      {/* top section */}
      <div className="flex w-full justify-between">
        <div className="flex w-0 grow flex-col pt-5">
          
          {/* title */}
          <div className="w-56 h-5 bg-gray-200 rounded mb-6" />

          {/* stock row */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded" />
            <div className="w-24 h-4 bg-gray-200 rounded" />
          </div>
        </div>

        {/* product image */}
        <div className="w-36 h-36 bg-gray-200 rounded-lg" />
      </div>

      {/* bottom section */}
      <div className="flex w-full flex-col justify-end gap-8 pt-6 lg:flex-row">
        <div className="w-full lg:min-w-91">
          <div className="flex h-full justify-between gap-2 rounded-lg border bg-white py-8 pl-6 pr-4 flex-col xl:flex-row lg:flex-col">

            {/* variant + price */}
            <div className="flex grow items-center justify-between">
              
              {/* variant tags */}
              <div className="flex gap-2">
                <div className="w-16 h-5 bg-gray-200 rounded" />
                <div className="w-12 h-5 bg-gray-200 rounded" />
              </div>

              {/* price area */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-4 bg-gray-200 rounded" />
                <div className="w-16 h-5 bg-gray-200 rounded" />
              </div>
            </div>

            {/* quantity selector */}
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded" />
                <div className="w-8 h-4 bg-gray-200 rounded" />
                <div className="w-10 h-10 bg-gray-200 rounded" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonLineItemDesktop
