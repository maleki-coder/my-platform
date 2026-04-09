"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@lib/components/ui/button"
import { InquiryCartResponse } from "types/global"
import InquiryCard from "@modules/account/components/inquiry-card"

const InquiryOverview = ({ inquries }: { inquries: InquiryCartResponse[] }) => {
  if (inquries?.length) {
    return (
       <ul className="flex flex-col gap-y-4" data-testid="inquiry-wrapper">
        {inquries.map((inquiry) => (
          <div
            key={inquiry.id}
            className="last:pb-0 last:border-none"
          >
            <InquiryCard inquiry={inquiry} />
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
      <h2 className="text-large-semi">هنوز استعلامی ثبت نکرده اید!</h2>
      <div className="mt-4">
      <p className="text-xl text-gray-600 font-medium">
          <LocalizedClientLink href="/">
            <Button className="cursor-pointer">مشاهده محصولات</Button>
          </LocalizedClientLink>
        </p>
      </div>
    </div>
  )
}

export default InquiryOverview
