import { retrieveInquiryCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import InquiryCartTemplate from "@modules/inquiry-cart/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { InquiryCartResponse } from "types/global"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

export default async function Cart() {
  const cart = await retrieveInquiryCart().catch((error) => {
    console.error(error)
    return notFound()
  })

  return (
    <InquiryCartTemplate
      cart={
        cart
      }
    />
  )
}
