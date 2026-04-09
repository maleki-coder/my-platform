"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { formatShamsiDate } from "@lib/util/format-shamsi-date"
import { ChevronLeft, Loader2 } from "lucide-react"
import { InquiryCartResponse } from "types/global"
import { Badge } from "@lib/components/ui/badge"

type OrderCardProps = {
  inquiry: InquiryCartResponse
}

const InquiryCard = ({ inquiry }: OrderCardProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const getShortCartId = (id?: string) => {
    if (!id) return "N/A"
    return id.slice(-6).toUpperCase()
  }
  const handleClick = () => {
    startTransition(() => {
      router.push(`/account/inquiries/details/${inquiry.id}`)
    })
  }

  return (
    <li data-testid="order-wrapper" data-value={inquiry.id}>
      <button
        onClick={handleClick}
        className="w-full text-right cursor-pointer"
      >
        <div className="bg-gray-50 flex justify-between items-center p-4 rounded">
          <div className="grid grid-cols-3 grid-rows-2 text-small-regular gap-x-4 flex-1">
            <span className="font-semibold">تاریخ ثبت</span>
            <span className="font-semibold">شماره استعلام</span>
            <span className="font-semibold">وضعیت</span>

            <span data-testid="inquiry-created-date">
              {formatShamsiDate(inquiry.created_at!, { includeTime: true })}
            </span>

            <span data-testid="inquiry-id" data-value={inquiry.id}>
              #{getShortCartId(inquiry.id)}
            </span>

            <div data-testid="inquiry-status">
              {inquiry.status === "active" ? (
                <Badge variant={"secondary"} className="bg-blue-500 text-white">فعال</Badge>
              ) : inquiry.status === "submitted" ? (
                <Badge variant={"secondary"} className="bg-orange-500 text-white">ثبت شده</Badge>
              ) : (
                <Badge variant={"secondary"} className="bg-green-500 text-white">بررسی شده</Badge>
              )}
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

export default InquiryCard
