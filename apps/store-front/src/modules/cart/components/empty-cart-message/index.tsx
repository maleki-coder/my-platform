import { Button } from "@lib/components/ui/button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"

const EmptyCartMessage = () => {
  return (
    <div className="flex flex-col items-center gap-8.5 pb-15.5 pt-10.5 lg:gap-13 lg:pb-25 lg:pt-17">
      <div className="h-42.5 w-47 lg:h-63.5 lg:w-70.5">
        <Thumbnail
          thumbnail={"/images/empty-cart.jpg"}
          images={null}
          size="square"
        />
      </div>
      <div className="flex flex-col items-center">
        <p className="text-base font-semibold leading-4 text-gray-700 lg:text-[22px]">
          سبد خرید شما خالی است.
        </p>
      </div>
      <LocalizedClientLink href="/">
        <Button className="cursor-pointer">مشاهده محصولات</Button>
      </LocalizedClientLink>
    </div>
    // <div className="lg:border rounded-2xl w-full flex py-11 flex-col items-center">
    //   <div className="max-w-48 w-48 h-48 mb-2.5 mt-11">
    //     <div className="w-full relative">
    //       <div className="absolute inset-0 w-full h-full">
    //         <Thumbnail
    //           thumbnail={"/images/empty-cart.jpg"}
    //           images={null}
    //           size="square"
    //         />
    //       </div>
    //     </div>
    //   </div>
    //   <div className="text-center">
    //     <p className="font-bold text-2xl mb-2">سبد خرید شما خالیه!</p>
    //     <p className="text-xl text-gray-600 font-medium">
    //       <LocalizedClientLink href="/store">
    //         <Button className="cursor-pointer">مشاهده محصولات</Button>
    //       </LocalizedClientLink>
    //     </p>
    //   </div>
    // </div>
  )
}

export default EmptyCartMessage
