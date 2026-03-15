"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { formatShamsiDate } from "@lib/util/format-shamsi-date"
import { ChevronLeft, Loader2 } from "lucide-react"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(() => {
      router.push(`/account/orders/details/${order.id}`)
    })
  }

  return (
    <li data-testid="order-wrapper" data-value={order.id}>
      <button onClick={handleClick} className="w-full text-right cursor-pointer">
        <div className="bg-gray-50 flex justify-between items-center p-4 rounded">
          <div className="grid grid-cols-3 grid-rows-2 text-small-regular gap-x-4 flex-1">
            <span className="font-semibold">تاریخ ثبت</span>
            <span className="font-semibold">شماره سفارش</span>
            <span className="font-semibold">مبلغ کل</span>

            <span data-testid="order-created-date">
              {formatShamsiDate(order.created_at, { includeTime: true })}
            </span>

            <span data-testid="order-id" data-value={order.display_id}>
              #{order.display_id}
            </span>

            <div data-testid="order-amount">
              {convertToLocale({ amount: order.total })}
              <span className="ps-1">تومان</span>
            </div>
          </div>

          {isPending ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </div>
      </button>
    </li>
  )
}

export default OrderCard
