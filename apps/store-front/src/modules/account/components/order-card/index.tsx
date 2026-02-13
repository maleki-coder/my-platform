import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { formatShamsiDate } from "@lib/util/format-shamsi-date"
import { ChevronDown } from "lucide-react"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <li key={order.id} data-testid="order-wrapper" data-value={order.id}>
      <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
        <div className="bg-gray-50 flex justify-between items-center p-4">
          <div className="grid grid-cols-3 grid-rows-2 text-small-regular gap-x-4 flex-1">
            <span className="font-semibold">تاریخ ثبت</span>
            <span className="font-semibold">شماره سفارش</span>
            <span className="font-semibold">مبلغ کل</span>
            <span data-testid="order-created-date">
              {formatShamsiDate(order.created_at, {
                includeTime: true,
              })}
            </span>
            <span data-testid="order-id" data-value={order.display_id}>
              #{order.display_id}
            </span>
            <div data-testid="order-amount">
              {convertToLocale({
                amount: order.total,
              })}
              <span className="ps-1">تومان</span>
            </div>
          </div>
          <ChevronDown className="rotate-90" />
        </div>
      </LocalizedClientLink>
    </li>
  )
}

export default OrderCard
