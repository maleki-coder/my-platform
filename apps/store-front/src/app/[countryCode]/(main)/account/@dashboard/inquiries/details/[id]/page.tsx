import { getInquiryDetails } from "@lib/data/inquiry"
import InquiryDetailsTemplate from "@modules/inquiry/templates/inquiry-details-template"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const inquiry = await getInquiryDetails(params.id).catch(() => null)

  if (!inquiry) {
    notFound()
  }

  return {
    title: `inquiry details for #${params.id}`,
    description: `View your inquiry details`,
  }
}

export default async function InquiryDetailPage(props: Props) {
  const params = await props.params
  const items = await getInquiryDetails(params.id).catch(() => null)

  if (!items) {
    notFound()
  }

  return <InquiryDetailsTemplate items={items} />
}
