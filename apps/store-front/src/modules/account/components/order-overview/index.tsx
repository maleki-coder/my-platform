"use client"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@lib/components/ui/button"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
       <ul className="flex flex-col gap-y-4" data-testid="orders-wrapper">
        {orders.map((order) => (
          <div
            key={order.id}
            className="last:pb-0 last:border-none"
          >
            <OrderCard order={order} />
          </div>
        ))}
      </ul>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center gap-y-4"
      data-testid="no-orders-container"
    >
      <h2 className="text-large-semi">هنوز سفارشی ثبت نکرده اید!</h2>
      <div className="mt-4">
      <p className="text-xl text-gray-600 font-medium">
          <LocalizedClientLink href="/store">
            <Button className="cursor-pointer">مشاهده محصولات</Button>
          </LocalizedClientLink>
        </p>
      </div>
    </div>
  )
}

export default OrderOverview
