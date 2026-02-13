import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function Orders() {
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-4 lg:mt-0 mt-4 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">سفارشات</h1>
      </div>
      <div>
        <OrderOverview orders={orders} />
        {/* <Divider className="my-16" />
        <TransferRequestForm /> */}
      </div>
    </div>
  )
}
