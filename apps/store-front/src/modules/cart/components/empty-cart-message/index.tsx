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
  )
}

export default EmptyCartMessage
