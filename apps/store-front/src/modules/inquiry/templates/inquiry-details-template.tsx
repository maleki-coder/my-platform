"use client"

import { ChevronRight } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"
import { InquiryCartItem } from "types/global"
import InquiryDetails from "@modules/inquiry/components/inquiry-details"

type InquiryDetailsTemplateProps = {
  items: InquiryCartItem[]
}

const InquiryDetailsTemplate: React.FC<InquiryDetailsTemplateProps> = ({
  items,
}) => {
  return (
    <div className="w-full">
      <div className="flex gap-2 justify-start items-center border-b pb-4">
        <LocalizedClientLink
          href="/account/inquiries"
          data-testid="back-to-overview-button"
        >
          <ChevronRight />
        </LocalizedClientLink>
        <h1 className="text-lg font-black">جزییات استعلام</h1>
      </div>
      <div
        className="flex flex-col gap-4 h-full bg-white w-full"
        data-testid="inquiry-details-container"
      >
        <InquiryDetails items={items} />
      </div>
    </div>
  )
}

export default InquiryDetailsTemplate
