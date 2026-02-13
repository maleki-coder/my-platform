import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { User2Icon } from "lucide-react"
import { formatShamsiDate } from "@lib/util/format-shamsi-date"
import OrderCard from "../order-card"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  return (
    <div data-testid="overview-page-wrapper" className="w-full">
      <div className="text-2xl-semi flex justify-start items-center mb-4">
        <span data-testid="welcome-message" data-value={customer?.first_name}>
          <User2Icon className="text-indigo-500" />
        </span>
        <span className="ms-4">سلام {customer?.first_name}</span>
      </div>
      <div className="flex flex-col py-8 border-t border-gray-200">
        <div className="flex flex-col gap-y-4 h-full col-span-1 row-span-2 flex-1">
          <div className="flex items-start gap-x-16 mb-6">
            <div className="flex flex-col gap-y-4">
              <h3 className="text-large-semi">پروفایل</h3>
              <div className="flex items-end gap-x-2">
                <span
                  className="text-3xl-semi leading-none"
                  data-testid="customer-profile-completion"
                  data-value={getProfileCompletion(customer)}
                >
                  {getProfileCompletion(customer)}%
                </span>
                <span className="uppercase text-base-regular text-ui-fg-subtle">
                  تکمیل شده
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-y-4">
              <h3 className="text-large-semi">نشانی ها</h3>
              <div className="flex items-end gap-x-2">
                <span
                  className="text-3xl-semi leading-none"
                  data-testid="addresses-count"
                  data-value={customer?.addresses?.length || 0}
                >
                  {customer?.addresses?.length || 0}
                </span>
                <span className="uppercase text-base-regular text-ui-fg-subtle">
                  ذخیره شده
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-y-4">
            <div className="flex items-center gap-x-2">
              <h3 className="text-large-semi">سفارشات اخیر</h3>
            </div>
            <ul className="flex flex-col gap-y-4" data-testid="orders-wrapper">
              {orders && orders.length > 0 ? (
                orders.slice(0, 3).map((order) => {
                  return (
                    <OrderCard key={order.id} order={order} />
                  )
                })
              ) : (
                <span data-testid="no-orders-message">سفارشی ثبت نشده است</span>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
