const SkeletonMobileProductPreview = () => {
  return (
    <section className="w-full border-y-2 mt-1 border-gray-200 animate-pulse py-4">
      <div className="flex w-full items-stretch justify-between mt-4">
        <div className="flex w-2/3 flex-col gap-1">
          <div className="flex flex-col justify-between pl-4">
            <div className="flex flex-col gap-2">
              <div className="h-5 w-full bg-gray-200 rounded"></div>
              <div className="h-5 w-2/3 bg-gray-200 rounded"></div>
            </div>

            <div className="mt-2.5 flex flex-col">
              <div className="flex items-center">
                <div className="h-2 w-5 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-29.5 h-29.5 bg-gray-200 rounded shrink-0"></div>
      </div>
      <div className="flex items-center gap-x-2 mt-4 pl-4">
        <div className="h-6 w-24 bg-gray-200 rounded"></div>
        <div className="h-6 w-16 bg-gray-100 rounded"></div>
      </div>
    </section>
  )
}

export default SkeletonMobileProductPreview
