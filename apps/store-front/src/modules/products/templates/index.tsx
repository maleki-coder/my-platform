import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfoSection from "@modules/products/templates/product-info-section"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "@modules/products/templates/product-actions-wrapper"
import ProductReviews from "@modules/products/components/product-reviews"
import BreadCrumbs from "@modules/common/components/bread-crumbs"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div
        className="max-w-screen-2xl px-4 mx-auto w-full md:px-8"
        data-testid="product-container"
      >
        <BreadCrumbs
          productCategoryObj={product.categories?.[0]}
          productTitle={product.title}
        />
        {/* <div className="flex w-full flex-col">
          <span className="h-px mt-2 w-full bg-gray-300"></span>
        </div> */}
        <article className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-16">
          <ProductInfoSection product={product} />
          <div className="relative">
            <div className="flex flex-col gap-y-8 sticky top-12">

          <Suspense
            fallback={<ProductActions disabled={true} product={product} />}
            >
            <ProductActionsWrapper product={product} />
          </Suspense>
            </div></div>
          {/* <ProductTabs product={product} /> */}
        </article>
        {/* <div className="block w-full relative">
          <ImageGallery images={images} />
        </div> */}
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-75 w-full py-8 gap-y-12">
          <ProductOnboardingCta />
        </div>
      </div>
      {/* <ProductReviews productId={product.id} /> */}
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
