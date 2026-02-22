import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import SidebarWrapper from "@modules/layout/templates/sidebar-wrapper"
import Header from "@modules/layout/templates/header"
import type { CSSProperties } from "react"
import LayoutFooterController from "@modules/layout/components/layout-footer-controller"
import { listCollections } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import { DESKTOP_HEADER_HEIGHT, MOBILE_HEADER_HEIGHT } from "@lib/util/constants"
import { getDeviceFromCookie } from "@lib/util/get-deivce-from-cookie"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const { isMobile } = await getDeviceFromCookie()
  const mainStyle: CSSProperties = isMobile
    ? {
      marginTop: MOBILE_HEADER_HEIGHT,
    }
    : {
      marginTop: DESKTOP_HEADER_HEIGHT,
    }
  const cart = await retrieveCart().catch(() => null)
  let shippingOptions: StoreCartShippingOption[] = []
  if (cart) {
    const { shipping_options } = await listCartOptions()
    shippingOptions = shipping_options
  }
  const collections = await listCollections({ fields: "*products" })
  const categories = await listCategories()
  return (
    <div className="flex flex-col w-full">
      <Header />
      <SidebarWrapper />
      <main style={mainStyle} className="w-full relative">
        {props.children}
      </main>
      <LayoutFooterController
        cart={cart}
        categories={categories}
        collections={collections.collections}
      />
    </div>
  )
}
