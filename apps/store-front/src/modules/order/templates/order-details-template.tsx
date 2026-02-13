"use client"

import { ChevronRight } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import TransactionDetails from "@modules/order/components/transaction-details"
import React from "react"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  return (
    <div className="w-full">
      <div className="flex gap-2 justify-start items-center border-b pb-4">
        <LocalizedClientLink
          href="/account/orders"
          data-testid="back-to-overview-button"
        >
          <ChevronRight />
        </LocalizedClientLink>
        <h1 className="text-lg font-black">جزییات سفارش</h1>
      </div>
      <div
        className="flex flex-col gap-4 h-full bg-white w-full"
        data-testid="order-details-container"
      >
        <OrderDetails order={order} showStatus />
        <TransactionDetails order={order} />
        <ShippingDetails order={order} />
        <Items order={order} />
        {/* <OrderSummary order={order} /> */}
        {/* <Help /> */}
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
