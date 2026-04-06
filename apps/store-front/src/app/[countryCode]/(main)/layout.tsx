import { Metadata } from "next"

import { listCartOptions, retrieveCart, retrieveInquiryCart } from "@lib/data/cart"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import SidebarWrapper from "@modules/layout/templates/sidebar-wrapper"
import Header from "@modules/layout/templates/header"
import LayoutFooterController from "@modules/layout/components/layout-footer-controller"
import { listCategories } from "@lib/data/categories"
import Footer from "@modules/layout/templates/footer"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const cart = await retrieveCart().catch(() => null);
  const cartInquiry = await retrieveInquiryCart().catch(() => null);
  let shippingOptions: StoreCartShippingOption[] = []
  if (cart) {
    const { shipping_options } = await listCartOptions()
    shippingOptions = shipping_options
  }
  // const collections = await listCollections({ fields: "*products" })
  const categories = await listCategories()
  return (
    <div className="flex flex-col w-full items-center">
      <Header />
      <SidebarWrapper />
      <main
        className={`w-full relative mobile-header-top-margin md:desktop-header-top-margin`}
      >
        {props.children}
      </main>
      <LayoutFooterController
        cart={cart!}
        cartInquiry={cartInquiry!}
        categories={categories}
        footerNode={<Footer />}
      />
    </div>
  )
}
