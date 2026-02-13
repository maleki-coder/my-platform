import { Metadata } from "next"
import { notFound } from "next/navigation"
import AddressBook from "@modules/account/components/address-book"
import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Addresses",
  description: "View your addresses",
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-4 lg:mt-0 mt-4 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">نشانی ها</h1>
      </div>
      <AddressBook customer={customer} showAddresses={true} />
    </div>
  )
}
