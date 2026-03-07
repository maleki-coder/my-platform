import { HttpTypes } from "@medusajs/types"
import React from "react"
import Link from "next/link"
import { listCategoriesForBreadCrumbs } from "@lib/data/categories"

type BreadCrumbsProps = {
  category: HttpTypes.StoreProductCategory
  "data-testid"?: string
}

const BreadCrumbs: React.FC<BreadCrumbsProps> = async ({
  category,
  "data-testid": dataTestId,
}) => {
  const categories = await listCategoriesForBreadCrumbs();
  // Create a lookup map for quick category access by ID
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

  // Build breadcrumb trail using the category map
  const getBreadcrumbTrail = (
    currentCategory: HttpTypes.StoreProductCategory
  ): any[] => {
    const trail: any[] = []
    const categoryMap = createCategoryMap(categories)

    let currentId = currentCategory.id
    let currentCat = categoryMap.get(currentId)

    // Walk up the parent chain until we reach the root
    while (currentCat) {
      trail.unshift(currentCat)

      // If this category has a parent_id, get the parent from the map
      if (currentCat.parent_category_id) {
        currentCat = categoryMap.get(currentCat.parent_category_id)
      } else {
        currentCat = null
      }
    }

    return trail
  }

  const breadcrumbTrail = getBreadcrumbTrail(category)

  return (
    <nav data-testid={dataTestId} className="w-full" aria-label="bread-crumb">
      <ul className="no-scrollbar flex gap-1 mt-4 overflow-scroll px-4 xs:max-w-full md:mb-1.25 lg:px-0 xl:gap-1.75">
        {/* Home/Root link */}
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="block whitespace-nowrap text-xs font-normal leading-4 text-blue-300 hover:text-shadow-xs transition-colors xl:leading-6.25"
          >
            خانه
          </Link>
        </li>

        {/* Only add separator if there are categories */}
        {breadcrumbTrail.length > 0 && (
          <li className="text-blue-300">/</li>
        )}

        {/* Dynamic category breadcrumbs */}
        {breadcrumbTrail.map((cat, index) => {
          const isLast = index === breadcrumbTrail.length - 1
          const categoryUrl = `/categories/${cat.handle}`

          return (
            <React.Fragment key={cat.id}>
              <li className="inline-flex items-center">
                {isLast ? (
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

              {/* Add separator if not the last item */}
              {!isLast && <li className="text-blue-300">/</li>}
            </React.Fragment>
          )
        })}
      </ul>
    </nav>
  )
}

export default BreadCrumbs
