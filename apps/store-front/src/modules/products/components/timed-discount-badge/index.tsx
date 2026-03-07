export default async function TimedDiscountBadge({}: //   product,
{
  //   product: HttpTypes.StoreProduct
}) {
  return (
    <div className="mb-3.5 h-5 w-full lg:mb-4">
      <div
        className="flex items-center justify-between pt-0.5 text-red-500"
        // style="--badge-text: #DA1E28;"
      >
        <p className="font-semibold leading-4 text-xs lg:text-[15px] lg:leading-5! line-clamp-1 max-w-[60%]">
          تخفیف
        </p>
        <time className="whitespace-nowrap text-base font-semibold leading-4! lg:text-lg lg:leading-5!">
          ۱۲۱۲۱۲۱
        </time>
      </div>
      <div
        className="relative mt-0.75 lg:mt-1.25 flex h-0.75 w-full justify-end overflow-hidden rounded-[10px] bg-gray-300 lg:h-1"
        // style="--badge-text: #DA1E28;"
      >
        <div
          className="w-full h-0.75 rounded-[10px] lg:h-1 bg-red-500"
          //   style="width: 100%;"
        ></div>
      </div>
    </div>
  )
}
