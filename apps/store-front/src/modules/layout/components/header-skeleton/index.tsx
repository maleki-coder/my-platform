// Header Skeleton
export const HeaderSkeleton = () => (
  <div className="fixed max-h-32 w-full left-0 right-0 top-0 z-100 flex flex-col border-b border-brand-border bg-white">
    <div className="w-full mx-auto px-4 md:px-8">
      <div className="flex w-full flex-col items-center justify-between py-1 md:pt-4">
        <div className="flex w-full items-center justify-between md:pb-2.5">
          <div className="flex w-full items-center gap-2">
            <div className="w-15 h-8.5 bg-gray-200 animate-pulse rounded" />
            <div className="flex-1 h-10 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="hidden md:flex items-stretch h-9 gap-4">
            <div className="w-20 h-9 bg-gray-200 animate-pulse rounded" />
            <div className="w-10 h-9 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
        <div className="hidden md:block w-full h-12 bg-gray-200 animate-pulse rounded" />
      </div>
    </div>
  </div>
)