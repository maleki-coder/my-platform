import { formatShamsiDate } from "@lib/util/format-shamsi-date"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { ReceiptText } from "lucide-react"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
  return (
    <div className="flex flex-col">
      <h2 className="w-full flex gap-1 mt-4 items-center  text-sm font-medium lg:font-bold leading-5 mb-2">
        <ReceiptText size={14} />
        مشخصات سفارش
      </h2>
      <div className="w-full border border-gray-300 rounded-lg p-4">
        <div className="flex w-fit justify-between mb-4 items-center lg:w-fit!">
          <p className="whitespace-nowrap  text-xs  leading-5 text-gray-600  lg:text-sm lg:leading-6">
            کد پیگیری سفارش:
          </p>
          <div className="flex items-center flex-wrap">
            <p className="ms-2  text-xs font-bold leading-5  lg:text-sm lg:leading-6 pt-0.5">
              #{order.display_id}
            </p>
          </div>
        </div>
        <div className="flex w-fit justify-between mb-4 items-center lg:w-fit!">
          <p className="whitespace-nowrap  text-xs  leading-5 text-gray-600  lg:text-sm lg:leading-6">
            تاریخ ثبت سفارش:
          </p>
          <div className="flex items-center flex-wrap">
            <p className="ms-2  text-xs font-bold leading-5  lg:text-sm lg:leading-6 pt-0.5">
              {formatShamsiDate(order.created_at, { includeTime: true })}
            </p>
          </div>
        </div>
        <div className="w-full border-t border-t-gray-300 pt-4">
          <div className="flex flex-wrap gap-2 divide-x">
            <div className="flex w-fit items-start justify-between mb-4 pe-4 lg:w-fit!">
              <p className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6">
                مبلغ کل:
              </p>
              <div className="flex items-center flex-wrap">
                <p className="ms-2 text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                  {convertToLocale({
                    amount: order.original_total - order.shipping_subtotal,
                  })}
                </p>
                <span className="text-xs font-medium mr-1 text-gray-600!">
                  تومان
                </span>
              </div>
            </div>
            <div className="flex w-fit items-start justify-between pe-4 mb-4 lg:w-fit!">
              <p className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6">
                هزینه بسته بندی و ارسال:
              </p>
              <div className="flex items-center flex-wrap">
                <p className="ms-2 text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                  {convertToLocale({
                    amount: order.shipping_subtotal,
                  })}
                </p>
                <span className="text-xs font-medium mr-1 text-gray-600!">
                  تومان
                </span>
              </div>
            </div>
            <div className="flex w-fit items-start justify-between mb-4 lg:w-fit!">
              <p className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6">
                مبلغ تخفیف:
              </p>
              <div className="flex items-center flex-wrap">
                <p className="ms-2 text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                  {convertToLocale({
                    amount: order.discount_total,
                  })}
                </p>
                <span className="text-xs font-medium mr-1 text-gray-600! ">
                  تومان
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-fit items-start justify-between mb-4 lg:mb-0! lg:w-fit!">
            <p className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6">
              مبلغ پرداخت شده:
            </p>
            <div className="flex items-center flex-wrap ">
              <p className="ms-2 text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                {convertToLocale({
                  amount: order.total,
                })}
              </p>
              <span className="text-xs font-medium mr-1 text-gray-600! ">
                تومان
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
