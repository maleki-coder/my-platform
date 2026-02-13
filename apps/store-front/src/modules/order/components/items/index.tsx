import repeat from "@lib/util/repeat"
import { translateFulfillmentStatus } from "@lib/util/translate-fullfilment-status"
import { HttpTypes } from "@medusajs/types"
import Item from "@modules/order/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import { ReceiptText } from "lucide-react"

type ItemsProps = {
  order: HttpTypes.StoreOrder
}

const Items = ({ order }: ItemsProps) => {
  const items = order.items

  return (
    <div className="flex flex-col">
      <h2 className="w-full flex gap-1 mt-4 items-center text-sm font-medium lg:font-bold leading-5 mb-2">
        <ReceiptText size={14} />
        مرسوله
      </h2>
      <div className="w-full border border-gray-300 rounded-lg p-4">
        <div className="w-full">
          <div className="flex flex-wrap gap-2 divide-x">
            <div className="flex w-fit items-start justify-between pe-4 lg:w-fit!">
              <p className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6">
                وضعیت:
              </p>
              <div className="flex items-center flex-wrap">
                <p className="ms-2 text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                  {translateFulfillmentStatus(order.fulfillment_status)}
                </p>
              </div>
            </div>
            {order.fulfillments?.[0]?.labels?.[0]?.tracking_number && (
              <div className="flex w-fit items-start justify-between pe-4 lg:w-fit!">
                <p className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6">
                  کد رهگیری مرسوله
                </p>
                <div className="flex items-center flex-wrap">
                  <p className="ms-2 text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                    {order.fulfillments?.[0]?.labels?.[0]?.tracking_number ??
                      ""}
                  </p>
                </div>
              </div>
            )}
            {order.fulfillments?.[0]?.labels?.[0]?.tracking_url && (
              <div className="flex w-fit items-start justify-between lg:w-fit!">
                <p className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6">
                  لینک رهگیری:
                </p>
                <div className="flex items-center flex-wrap">
                  {order.fulfillments?.[0]?.labels?.[0]?.tracking_url && (
                    <a
                      href={
                        order.fulfillments?.[0]?.labels?.[0]?.tracking_url
                          ? order.fulfillments?.[0]?.labels?.[0]?.tracking_url.startsWith(
                              "http"
                            )
                            ? order.fulfillments?.[0]?.labels?.[0]?.tracking_url
                            : `https://${order.fulfillments?.[0]?.labels?.[0]?.tracking_url}`
                          : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ms-2 text-xs font-bold underline leading-5 lg:text-sm lg:leading-6"
                    >
                      مشاهده لینک رهگیری
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          {items?.length
            ? items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return <Item key={item.id} item={item} />
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </div>
      </div>
    </div>
  )
}

export default Items
