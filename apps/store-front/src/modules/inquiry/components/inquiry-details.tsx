import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@lib/components/ui/table"
import { formatShamsiDate } from "@lib/util/format-shamsi-date"

import { LinkIcon } from "lucide-react"
import { InquiryCartItem } from "types/global"

type OrderDetailsProps = {
  items: InquiryCartItem[]
}

const InquiryDetails = ({ items }: OrderDetailsProps) => {
  if (!items.length) {
    return (
      <div className="flex flex-col mt-4">
        <div className="w-full border border-gray-300 rounded-md p-4">
          اطلاعاتی جهت نمایش وجود ندارد!
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col mt-4">
      <div className="w-full border border-gray-300 rounded-md p-0!">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6 text-right">
                پارت نامبر
              </TableHead>
              <TableHead className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6 text-right">
                تعداد
              </TableHead>
              <TableHead className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6 text-right">
                قیمت هدف
              </TableHead>
              <TableHead className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6 text-right">
                نوع ارز
              </TableHead>
              <TableHead className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6 text-right">
                پکیج
              </TableHead>
              <TableHead className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6 text-right">
                برند
              </TableHead>
              <TableHead className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6 text-right">
                لینک
              </TableHead>
              <TableHead className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6 text-right">
                توضیحات
              </TableHead>
              <TableHead className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6 text-right">
                دیتا شیت
              </TableHead>
              <TableHead className="whitespace-nowrap text-xs leading-5 text-gray-600 lg:text-sm lg:leading-6 text-right">
                تاریخ ایجاد
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                  {item.title}
                </TableCell>
                <TableCell className="text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                  {item.quantity}
                </TableCell>
                <TableCell className="text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                  {item.target_price}
                </TableCell>
                <TableCell className="text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                  {item.currency}
                </TableCell>
                <TableCell className="text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                  {item.package}
                </TableCell>
                <TableCell className="text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                  {item.brand}
                </TableCell>
                <TableCell className="text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                  {item.link}
                </TableCell>
                <TableCell className="text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                  {item.description}
                </TableCell>
                <TableCell className="text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                  {item.datasheet_url && (
                    <a
                      href={item.datasheet_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <LinkIcon size={14} /> مشاهده فایل
                    </a>
                  )}
                </TableCell>
                <TableCell className="text-xs font-bold leading-5 lg:text-sm lg:leading-6">
                  {formatShamsiDate(item.created_at!, {
                    includeTime: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default InquiryDetails
