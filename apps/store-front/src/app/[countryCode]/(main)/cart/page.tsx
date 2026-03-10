import { retrieveCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default async function Cart() {
  await delay(30000) // simulate slow network (5s)

  const cart = await retrieveCart().catch((error) => {
    console.error(error)
    return notFound()
  })

  return (
    <CartTemplate
      cart={
        cart as HttpTypes.StoreCart & {
          promotions: HttpTypes.StorePromotion[]
        }
      }
    />
  )
}
