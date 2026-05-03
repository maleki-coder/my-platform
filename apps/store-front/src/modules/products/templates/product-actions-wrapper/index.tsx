
import { retrieveCart, retrieveInquiryCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  product
}: {
  product: HttpTypes.StoreProduct
}) {
  const [cart, inquiryCart] = await Promise.all([
    retrieveCart().catch(() => null),
    retrieveInquiryCart().catch(() => null),
  ])
  if (!product) {
    return null
  }

  return <ProductActions
    cart={
      cart as HttpTypes.StoreCart & {
        promotions: HttpTypes.StorePromotion[]
      }
    }
    inquiryCart={inquiryCart}
    product={product} />
}
