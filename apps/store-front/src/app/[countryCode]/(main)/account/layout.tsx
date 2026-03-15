import { retrieveCustomer } from "@lib/data/customer"
import AccountLayout from "@modules/account/templates/account-layout"

export default async function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    // user not logged in → show login only (no layout)
    return login
  }

  // user logged in → show dashboard with layout
  return <AccountLayout customer={customer}>{dashboard}</AccountLayout>
}
