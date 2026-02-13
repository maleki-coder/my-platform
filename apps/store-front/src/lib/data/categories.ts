"use server"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"
import { CategoryWithImages } from "types/global"
import { buildCategoryTree } from "@lib/util/build-category-tree"

export const listCategories = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100

  const flatCategories = await sdk.client
    .fetch<{ product_categories: CategoryWithImages[] }>(
      "/store/product-categories",
      {
        query: {
          ...query,
          fields:
            "*category_children, *product_category_image, *parent_category",
          limit,
          include_descendants_tree: true,
          parent_category_id: null, // top-level only
        },
        next,
        cache: "no-cache",
      }
    )
    .then(({ product_categories }) => product_categories)

  // Build nested tree
  const nestedCategories = buildCategoryTree(flatCategories)

  return nestedCategories
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields: "*category_children, *products, *product_category_image",
          handle,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories[0])
}

export const listHeroCategories = async (
  metadataTag: string = "home-page",
  query?: Record<string, any>
) => {
  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: CategoryWithImages[] }>(
      "/store/hero-categories",
      {
        query: {
          metadataTag,
          limit,
          ...query,
        },
        cache: "no-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
}
