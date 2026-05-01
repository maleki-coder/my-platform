import { HttpTypes } from "@medusajs/types"
import React from "react"
import Link from "next/link"
import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { notFound } from "next/navigation"

type BreadCrumbsProps = {
  categoryHandle?: string[]
  productCategoryObj?: HttpTypes.StoreProductCategory // Pass this from the product page
  productTitle?: string // Pass the product title here
  "data-testid"?: string
}

const BreadCrumbs: React.FC<BreadCrumbsProps> = async ({
  categoryHandle,
  productCategoryObj,
  productTitle,
  "data-testid": dataTestId,
}) => {
  // Determine the base category: either passed directly or fetched via handle
  let productCategory = productCategoryObj;
  
  if (!productCategory && categoryHandle) {
    productCategory = await getCategoryByHandle(categoryHandle)
  }

  if (!productCategory && !productTitle) notFound()

  // Only fetch the category tree if we have a category to map
  const categories = productCategory ? await listCategories() : []

  const createCategoryMap = (cats: any[]): Map<string, any> => {
    const map = new Map()
    const flattenCategories = (categories: any[]) => {
      categories.forEach((cat) => {
        map.set(cat.id, cat)
        if (cat.category_children && cat.category_children.length > 0) {
          flattenCategories(cat.category_children)
        }
      })
    }
    flattenCategories(cats)
    return map
  }

  const getBreadcrumbTrail = (
    currentCategory: HttpTypes.StoreProductCategory | undefined
  ): any[] => {
    if (!currentCategory) return []
    
    const trail: any[] = []
    const categoryMap = createCategoryMap(categories)

    let currentId = currentCategory.id
    let currentCat = categoryMap.get(currentId)

    while (currentCat) {
      trail.unshift(currentCat)
      if (currentCat.parent_category_id) {
        currentCat = categoryMap.get(currentCat.parent_category_id)
      } else {
        currentCat = null
      }
    }
    return trail
  }

  const breadcrumbTrail = getBreadcrumbTrail(productCategory)

  return (
    <nav data-testid={dataTestId} className="w-full" aria-label="bread-crumb">
      <ul className="no-scrollbar flex gap-1 mt-4 overflow-scroll mx-0 md:px-4 xs:max-w-full md:mb-1.25 lg:px-0 xl:gap-1.75">
        
        {/* Home/Root link */}
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="block whitespace-nowrap text-xs font-normal leading-4 text-blue-300 hover:text-shadow-xs transition-colors xl:leading-6.25"
          >
            خانه
          </Link>
        </li>

        {/* Separator if categories or product title exist */}
        {(breadcrumbTrail.length > 0 || productTitle) && <li className="text-blue-300">/</li>}

        {/* Dynamic category breadcrumbs */}
        {breadcrumbTrail.map((cat, index) => {
          // It's the last category IF there is no product title AND it's the last in the array
          const isLastCategory = index === breadcrumbTrail.length - 1 && !productTitle
          const categoryUrl = `/categories/${cat.handle}`

          return (
            <React.Fragment key={cat.id}>
              <li className="inline-flex items-center">
                {isLastCategory ? (
                  <span
                    className="block whitespace-nowrap text-xs font-regular leading-4 text-shadow-xs xl:leading-6.25"
                    aria-current="page"
                  >
                    {cat.name}
                  </span>
                ) : (
                  <Link
                    href={categoryUrl}
                    className="block whitespace-nowrap text-xs font-normal leading-4 text-blue-300 hover:text-shadow-xs transition-colors xl:leading-6.25"
                  >
                    {cat.name}
                  </Link>
                )}
              </li>

              {/* Add separator if not the absolute last item */}
              {(!isLastCategory || productTitle) && <li className="text-blue-300">/</li>}
            </React.Fragment>
          )
        })}

        {/* Product Title at the end of the trail */}
        {productTitle && (
          <li className="inline-flex items-center">
            <span
              className="block whitespace-nowrap text-xs font-regular leading-4 text-shadow-xs xl:leading-6.25"
              aria-current="page"
            >
              {productTitle}
            </span>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default BreadCrumbs
