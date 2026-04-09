import Thumbnail from "@modules/products/components/thumbnail"
export default function NoProductFound() {
  return (
    <div className="flex flex-col items-center gap-8.5 pb-15.5 pt-10.5 lg:gap-13 lg:pb-25 lg:pt-17 border rounded-md shadow-custom">
      <div className="h-42.5 w-47 lg:h-63.5 lg:w-70.5">
        <Thumbnail
          thumbnail={"/images/static_not-found-product.webp"}
          images={null}
          size="square"
        />
    
      </div>
      <div className="flex flex-col items-center">
        <p className="text-base font-semibold leading-4 text-gray-700 lg:text-[22px]">
          کالایی یافت نشد.
        </p>
        <p className="pb-4 pt-3 text-xs font-medium leading-4 text-gray-700 lg:pb-6 lg:pt-4 lg:text-base">
          لطفا فیلترها را ویرایش کنید یا واژه دیگری را جستجو کنید.
        </p>
      </div>
    </div>
  )
}
