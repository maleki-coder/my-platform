import React, { Suspense } from "react"

import ProductActions from "@modules/products/components/product-actions"
import ProductInfoSection from "@modules/products/templates/product-info-section"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ProductActionsWrapper from "@modules/products/templates/product-actions-wrapper"
import BreadCrumbs from "@modules/common/components/bread-crumbs"
import { ProductSelectionProvider } from "@modules/products/components/product-selection-provider"
import ProductTabs from "../components/product-tabs"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({ product }) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div
        className="max-w-screen-2xl md:px-4 px-0 mx-auto w-full md:mb-0 mb-44"
        data-testid="product-container"
      >
        <div className="px-4">
          <BreadCrumbs
            productCategoryObj={product.categories?.[0]}
            productTitle={product.title}
          />
        </div>
        <ProductSelectionProvider product={product}>
          <article className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-8 gap-y-0 mt-2">
            <ProductInfoSection product={product} />
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-34">
                <Suspense
                  fallback={
                    <ProductActions disabled={true} product={product} />
                  }
                >
                  <ProductActionsWrapper product={product} />
                </Suspense>
              </div>
            </div>
          </article>
        </ProductSelectionProvider>
        {/* <div className="block w-full relative">
          <ImageGallery images={images} />
        </div> */}
        {/* <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-75 w-full py-8 gap-y-12">
          <ProductOnboardingCta />
        </div> */}
      </div>
      {/* <div
        className="max-w-screen-2xl my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div> */}
    </>
  )
}

export default ProductTemplate
