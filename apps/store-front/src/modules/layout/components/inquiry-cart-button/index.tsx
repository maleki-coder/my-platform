// modules/layout/components/inquiry-cart-button/index.tsx

import { retrieveInquiryCart } from "@lib/data/cart"
import InquiryCartDropdown from "@modules/layout/components/inquiry-cart-dropdown"

export default async function InquiryCartButton() {
  // Fetching the inquiry cart securely from the server!
  const cart = await retrieveInquiryCart().catch(() => null)

  return <InquiryCartDropdown cart={cart} />
}
