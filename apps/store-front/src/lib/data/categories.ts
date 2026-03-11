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
export const listCategoriesForBreadCrumbs = async (
  query?: Record<string, any>
) => {
  const next = {
    ...(await getCacheOptions("breadCrumb_categories")),
  }

  const limit = query?.limit || 100

  const flatCategories = await sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          ...query,
          fields:
            "id,name,handle,parent_category_id,parent_category.id,parent_category.name,parent_category.handle,category_children.id,category_children.name,category_children.handle",
          limit,
          include_descendants_tree: true,
          parent_category_id: null, // top-level only
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
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

export const getProductCategoryOptions = async (
  categoryId: string,
  query?: Record<string, any>
): Promise<CategoryOption[]> => {
  if (!categoryId) {
    return []
  }
  return sdk.client
    .fetch<CategoryOptionsResponse>(`/store/categories/${categoryId}/options`, {
      query: {
        ...query,
      },
      cache: "force-cache",
      next: {
        tags: [`category-options-${categoryId}`],
        revalidate: 1, // کش کردن اطلاعات برای ۱ ساعت (اختیاری اما به شدت توصیه می‌شود)
      },
    })
    .then(({ options }) => options)
    .catch((error) => {
      console.error(`Error fetching options for category ${categoryId}:`, error)
      return []
    })
}