import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0 ">
      <div className="w-full bg-white flex flex-col">
        <header className="flex md:px-2 px-8">
          <p className="text-lg font-bold">صورتحساب</p>
        </header>
        <CartTotals totals={cart} />
        {/* <ItemsPreviewTemplate cart={cart} /> */}
        <DiscountCode cart={cart} />
      </div>
    </div>
  )
}

export default CheckoutSummary
