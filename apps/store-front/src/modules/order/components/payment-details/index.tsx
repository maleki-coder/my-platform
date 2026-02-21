import { paymentInfoMap } from "@lib/constants"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import UploadReceiptForm from "@modules/order/components/upload-receipt-form"
import { CoinsIcon } from "lucide-react"
import { formatShamsiDate } from "@lib/util/format-shamsi-date"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0].payments?.[0]

  return (
    <div className="flex flex-col">
      <h2 className="w-full flex gap-1 mt-4 items-center  text-sm font-medium lg:font-bold leading-5 mb-2">
        <CoinsIcon size={14} />
        مشخصات پرداخت
      </h2>
      {payment &&
        <div className="w-full border border-gray-300 rounded-lg p-4">
          <div className="w-full">
            <div className="flex flex-wrap gap-2 divide-x">
              <div className="flex w-fit items-start justify-between mb-4 pe-4 lg:w-fit!">
                <p className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6">
                  روش پرداخت :
                </p>
                <div className="flex items-center flex-wrap">
                  <span className="ms-2 text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                    {paymentInfoMap[payment.provider_id].title}
                  </span>
                  <span className="ms-2 text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                    {paymentInfoMap[payment.provider_id].icon}
                  </span>
                </div>
              </div>
              <div className="flex w-fit items-start justify-between pe-4 mb-4 lg:w-fit!">
                <p className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6">
                  مبلغ پرداخت :
                </p>
                <div className="flex items-center flex-wrap">
                  <p className="ms-2 text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                    {convertToLocale({
                      amount: payment.amount
                    })}
                  </p>
                  <span className=" text-xs font-medium mr-1 text-gray-600!">
                    تومان
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 divide-x! items-baseline">
              <div className="flex w-fit items-start justify-between pe-4 mb-4 lg:w-fit!">
                <p className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6">
                  تاریخ پرداخت :
                </p>
                <div className="flex items-center flex-wrap">
                  <p className="ms-2  text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                    {formatShamsiDate(payment.created_at as string, { includeTime: true })}
                  </p>
                </div>
              </div>
              <div className="flex w-fit items-start justify-between mb-4 lg:mb-0! lg:w-fit!">
                <div className="flex items-center flex-wrap">
                  <UploadReceiptForm orderId={order.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
    // <div>
    //   <h2  className="flex flex-row text-3xl-regular my-6">
    //     Payment
    //   </h2>
    //   <div>
    //     {payment && (
    //       <div className="flex items-start gap-x-1 w-full">
    //         <div className="flex flex-col w-1/3">
    //           <p className="txt-medium-plus text-ui-fg-base mb-1">
    //             Payment method
    //           </p>
    //           <p
    //             className="txt-medium text-ui-fg-subtle"
    //             data-testid="payment-method"
    //           >
    //             {paymentInfoMap[payment.provider_id].title}
    //           </p>
    //         </div>
    //         <div className="flex flex-col w-2/3">
    //           <p className="txt-medium-plus text-ui-fg-base mb-1">
    //             Payment details
    //           </p>
    //           <div className="flex gap-2 txt-medium text-ui-fg-subtle items-center">
    //             <div className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
    //               {paymentInfoMap[payment.provider_id].icon}
    //             </div>
    //             <p data-testid="payment-amount">
    //               {isStripeLike(payment.provider_id) && payment.data?.card_last4
    //                 ? `**** **** **** ${payment.data.card_last4}`
    //                 : `${convertToLocale({
    //                     amount: payment.amount
    //                   })} paid at ${new Date(
    //                     payment.created_at ?? ""
    //                   ).toLocaleString()}`}
    //             </p>
    //           </div>
    //         </div>
    //         <UploadReceiptForm orderId={order.id} />
    //       </div>
    //     )}
    //   </div>

    //   <Divider className="mt-8" />
    // </div>
  )
}

export default PaymentDetails
