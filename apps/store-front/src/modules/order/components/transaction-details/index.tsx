import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@lib/components/ui/table"
import { formatShamsiDate } from "@lib/util/format-shamsi-date"
import { convertToLocale } from "@lib/util/money"

import { HttpTypes } from "@medusajs/types"
import { History } from "lucide-react"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
}

const TransactionDetails = ({ order }: OrderDetailsProps) => {
  if ((!order.payment_collections || order.payment_collections.length === 0) && ((!order.transactions || order.transactions.length === 0))) {
    return (
      <div className="flex flex-col">
        <h2 className="w-full flex gap-1 mt-4 items-center  text-sm font-medium lg:font-bold leading-5 mb-2">
          <History size={14} />
          تاریخچه تراکنش ها
        </h2>
        {order.payment_status}
        <div className="w-full border border-gray-300 rounded-lg p-4">
          اطلاعاتی جهت نمایش وجود ندارد!
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col">
      <h2 className="w-full flex gap-1 mt-4 items-center  text-sm font-medium lg:font-bold leading-5 mb-2">
        <History size={14} />
        تاریخچه تراکنش ها
      </h2>
      <div className="w-full border border-gray-300 rounded-lg p-0!">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6 text-right">تاریخ</TableHead>
              <TableHead className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6 text-right">وضعیت</TableHead>
              <TableHead className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6 text-right">مبلغ</TableHead>
              <TableHead className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6 text-right">روش پرداخت</TableHead>
              <TableHead className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6 text-right">شماره پیگیری</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.payment_collections && order.payment_collections!.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                  {formatShamsiDate(transaction.created_at!, {
                    includeTime: true,
                  })}
                </TableCell>
                <TableCell className="text-xs font-bold leading-5 lg:text-sm lg:leading-6">{transaction.status}</TableCell>
                <TableCell className="text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                  <span>
                    {convertToLocale({amount :transaction.captured_amount!})}
                  </span>
                  <span className="text-xs ps-1">
                    تومان
                  </span>
                  </TableCell>
                <TableCell className="text-xs font-bold leading-5 lg:text-sm lg:leading-6">کارت به کارت</TableCell>
                <TableCell className="text-xs font-bold leading-5 lg:text-sm lg:leading-6">-</TableCell>
              </TableRow>
            ))}
            {order.transactions && order.transactions!.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                  {formatShamsiDate(transaction.created_at!, {
                    includeTime: true,
                  })}
                </TableCell>
                <TableCell className="text-xs font-bold leading-5 lg:text-sm lg:leading-6">{order.status}</TableCell>
                <TableCell className="text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                  <span>
                    {convertToLocale({amount :transaction.amount!})}
                  </span>
                  <span className="text-xs ps-1">
                    تومان
                  </span>
                  </TableCell>
                <TableCell className="text-xs font-bold leading-5 lg:text-sm lg:leading-6">درگاه</TableCell>
                <TableCell className="text-xs font-bold leading-5 lg:text-sm lg:leading-6">{transaction.reference_id!}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default TransactionDetails
