import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

// Shipping & Returns Section Component
export const ShippingReturnsSection = () => {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4 md:p-0 px-4">
        ارسال و بازگشت کالا
      </h3>
      <div className="border md:rounded-xl p-6 bg-white space-y-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg">
            <FastDelivery />
          </div>
          <div>
            <span className="font-semibold text-gray-900 block mb-1">
              Fast delivery
            </span>
            <p className="text-sm text-gray-600">
              Your package will arrive in 3-5 business days at your pick up
              location or in the comfort of your home.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-green-50 rounded-lg">
            <Refresh />
          </div>
          <div>
            <span className="font-semibold text-gray-900 block mb-1">
              Simple exchanges
            </span>
            <p className="text-sm text-gray-600">
              Is the fit not quite right? No worries - we&apos;ll exchange your
              product for a new one.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-purple-50 rounded-lg">
            <Back />
          </div>
          <div>
            <span className="font-semibold text-gray-900 block mb-1">
              Easy returns
            </span>
            <p className="text-sm text-gray-600">
              Just return your product and we&apos;ll refund your money. No
              questions asked – we&apos;ll do our best to make sure your return
              is hassle-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}