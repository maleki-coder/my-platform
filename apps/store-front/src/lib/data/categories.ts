"use server"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"
import {
  CategoryOption,
  CategoryOptionsResponse,
  CategoryWithImages,
} from "types/global"
import { buildCategoryTree } from "@lib/util/build-category-tree"
import { cache } from "react"

export const listCategories = cache(async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100

  const combinedFields = [
    "id",
    "name",
    "handle",
    "parent_category_id",
    "*category_children",
    "*product_category_image",
    "*parent_category",
  ].join(",")

  const flatCategories = await sdk.client
    .fetch<{ product_categories: CategoryWithImages[] }>(
      "/store/product-categories",
      {
        query: {
          ...query,
          fields: combinedFields,
          limit,
          include_descendants_tree: true,
          parent_category_id: null, // top-level only
        },
        next: {
          ...next,
          revalidate: 3600,
        },
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)

  // Build nested tree
  const nestedCategories = buildCategoryTree(flatCategories)

  return nestedCategories
})

export const getCategoryByHandle = cache(async (categoryHandle: string[]) => {
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
        next: { ...next, revalidate: 3600 },
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories[0])
})

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

export const getProductCategoryOptions = cache(
  async (
    categoryId: string,
    query?: Record<string, any>
  ): Promise<CategoryOption[]> => {
    if (!categoryId) {
      return []
    }
    const cacheTagsConfig = {
      ...(await getCacheOptions("category-options")),
    }
    return sdk.client
      .fetch<CategoryOptionsResponse>(
        `/store/categories/${categoryId}/options`,
        {
          query: {
            ...query,
          },
          cache: "force-cache",
          next: {
            ...cacheTagsConfig,
            revalidate: 3600,
          },
        }
      )
      .then(({ options }) => options)
      .catch((error) => {
        console.error(
          `Error fetching options for category ${categoryId}:`,
          error
        )
        return []
      })
  }
)
