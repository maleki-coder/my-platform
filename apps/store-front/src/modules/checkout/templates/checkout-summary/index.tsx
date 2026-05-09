import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import { FileSpreadsheet } from "lucide-react"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col mt-4 small:mt-0 gap-y-4 small:py-0">
      <div className="flex flex-col gap-y-2 rounded-2xl p-6 bg-white shadow-custom md:mb-0 mb-4">

      <div className="w-full bg-white flex flex-col gap-y-2">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
            <FileSpreadsheet className="text-blue-600" />
            صورتحساب
          </h2>
        </div>
        <CartTotals totals={cart} />
      </div>
      </div>
        <DiscountCode cart={cart} />
    </div>
  )
}

export default CheckoutSummary
