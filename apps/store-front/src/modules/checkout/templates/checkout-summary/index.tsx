import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0">
      <div className="w-full bg-white flex flex-col gap-y-2">
        <header className="flex text-lg font-bold md:px-3">صورتحساب</header>
        <CartTotals totals={cart} />
        {/* <ItemsPreviewTemplate cart={cart} /> */}
        <DiscountCode cart={cart} />
      </div>
    </div>
  )
}

export default CheckoutSummary
