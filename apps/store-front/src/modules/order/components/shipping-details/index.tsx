import { formatShamsiDate } from "@lib/util/format-shamsi-date"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Ship } from "lucide-react"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div className="flex flex-col">
      <h2 className="w-full flex gap-1 mt-4 items-center  text-sm font-medium lg:font-bold leading-5 mb-2">
        <Ship size={14} />
        مشخصات گیرنده و مقصد
      </h2>
      <div className="w-full border border-gray-300 rounded-lg p-4">
        <div className="w-full">
          <div className="flex flex-wrap gap-2 divide-x">
            <div className="flex w-fit items-start justify-between mb-4 pe-4 lg:w-fit!">
              <p className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6">
                شماره تماس :
              </p>
              <div className="flex items-center flex-wrap">
                <p className="ms-2 text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                  {order.shipping_address?.phone}
                </p>
              </div>
            </div>
            <div className="flex w-fit items-start justify-between pe-4 mb-4 lg:w-fit!">
              <p className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6">
                تحویل گیرنده :
              </p>
              <div className="flex items-center flex-wrap">
                <p className="ms-2 text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                  {order.shipping_address?.first_name}{" "}
                  {order.shipping_address?.last_name}
                </p>
              </div>
            </div>
          </div>
          <div className="flex w-fit items-start justify-between mb-4 lg:mb-0! lg:w-fit!">
            <p className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6">
              ارسال به:
            </p>
            <div className="flex items-center flex-wrap">
              <p className="ms-2  text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                {order.shipping_address?.province}/{" "}
                {order.shipping_address?.city}/{" "}
                {order.shipping_address?.address_1}/{" "}
                {order.shipping_address?.address_2}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingDetails
