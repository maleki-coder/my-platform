import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCustomerInquiries } from "@lib/data/inquiry"
import InquiryOverview from "@modules/account/components/inquiry-overview"

export const metadata: Metadata = {
  title: "Inquiries",
  description: "Overview of your previous inquiries.",
}

export default async function Inquiries() {
  const inquries = await getCustomerInquiries()

  if (!inquries) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="inquiries-page-wrapper">
      <div className="mb-4 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">استعلام ها</h1>
      </div>
      <InquiryOverview inquries={inquries} />
    </div>
  )
}
