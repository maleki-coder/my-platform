"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion } from "./regions"
import { SortOptions } from "@modules/categories/components/category-order-filter"
import {
  ListProductsProps,
  OptionsProductSearchParams,
  PaginatedProductResponse,
  ProductSearchParams,
} from "@lib/types"
import { extractOptionParams } from "@lib/util/extractOptionsParams"

export const listProducts = async ({
  countryCode,
  queryParams,
}: ListProductsProps): Promise<PaginatedProductResponse> => {
  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  }
  const emptyResponse: PaginatedProductResponse = {
    response: { products: [], count: 0 },
    page: 1,
    limit: 20,
    totalPages: 0,
    nextPage: null,
    queryParams,
  }
  if (!region || !countryCode) {
    return emptyResponse
  }

  const optionsFilters = extractOptionParams(queryParams)
  const page = Number(queryParams.page) || 1
  const limit = Number(queryParams.limit) || 20
  const offset = (page - 1) * limit
  let totalFilteredCount: number | undefined = undefined
  let product_ids: Array<string> = []
  const hasCustomFilters =
    (optionsFilters && Object.keys(optionsFilters).length > 0) ||
    queryParams.min_price !== undefined ||
    queryParams.max_price !== undefined ||
    queryParams.in_stock !== undefined
  if (hasCustomFilters) {
    const filteredData = await getCustomFilteredProductsIds({
      category_id: queryParams.category_id!,
      optionsFilters: optionsFilters!,
      queryParams,
      offset,
    })

    if (filteredData.product_ids.length === 0) {
      return emptyResponse
    }

    product_ids = filteredData.product_ids
    totalFilteredCount = filteredData.count
  }

  const headers = { ...(await getAuthHeaders()) }
  const next = { ...(await getCacheOptions("products")) }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          handle: queryParams.handle,
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags",
          category_id: queryParams.category_id,
          id: product_ids,
        },
        headers,
        next,
        cache: "no-cache",
      }
    )
    .then(async ({ products, count }) => {
      const variantIds = products
        .flatMap((p) => p.variants?.map((v) => v.id))
        .filter(Boolean) as string[]

      if (variantIds.length > 0) {
        try {
          const { discounts } = await sdk.client.fetch<{
            discounts: Record<string, { starts_at: string; ends_at: string }>
          }>(`/store/discounts`, {
            method: "GET",
            query: { variant_ids: variantIds.join(",") },
            headers,
          })

          products.forEach((product) => {
            product.variants?.forEach((variant) => {
              if (discounts[variant.id]) {
                ;(variant as any).discount_starts_at =
                  discounts[variant.id].starts_at
                ;(variant as any).discount_ends_at =
                  discounts[variant.id].ends_at
              }
            })
          })
        } catch (error) {
          console.error("Failed to fetch custom discount dates:", error)
        }
      }
      const finalCount =
        totalFilteredCount !== undefined ? totalFilteredCount : count
      const totalPages = Math.ceil(finalCount / limit)
      const nextPage = page < totalPages ? page + 1 : null

      return {
        response: {
          products,
          count: finalCount,
        },
        page,
        limit,
        totalPages,
        nextPage,
        queryParams,
      }
    })
    .catch((error) => {
      console.error("Error fetching standard products:", error)
      return emptyResponse
    })
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the order by parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  queryParams,
  countryCode,
}: {
  queryParams: ProductSearchParams
  countryCode: string
}): Promise<PaginatedProductResponse> => {
  const result = await listProducts({
    queryParams,
    countryCode,
  })

  const sortedProducts = sortProducts(
    result.response.products,
    queryParams.order as SortOptions
  )
  return {
    ...result,
    response: {
      ...result.response,
      products: sortedProducts,
    },
  }
}

export const queryProducts = async (
  name: string
): Promise<Array<HttpTypes.StoreProduct>> => {
  const next = {
    ...(await getCacheOptions("products")),
  }

  const { products } = await sdk.client.fetch<{
    products: HttpTypes.StoreProduct[]
  }>(`/store/products?q=${encodeURIComponent(name)}`, {
    method: "GET",
    next,
    cache: "no-store", // IMPORTANT for search
  })

  return products
}

export const fetchVariantInventory = async ({
  productId,
  countryCode,
}: {
  productId: string
  countryCode?: string
}): Promise<HttpTypes.StoreProduct> => {
  const { product } = await sdk.store.product.retrieve(productId, {
    fields: `*variants.calculated_price,+variants.inventory_quantity`,
    country_code: countryCode,
  })
  return product
}

export async function getCustomFilteredProductsIds({
  category_id,
  queryParams,
  optionsFilters,
  offset,
}: {
  category_id: string | string[]
  queryParams: ProductSearchParams
  optionsFilters: OptionsProductSearchParams
  offset: number
}): Promise<{ product_ids: string[]; count: number }> {
  try {
    const searchParams = new URLSearchParams()

    if (optionsFilters && Object.keys(optionsFilters).length > 0) {
      const filterValues = Object.values(optionsFilters)
        .flat()
        .filter(Boolean)
        .join(",")
      if (filterValues) {
        searchParams.append("options", filterValues)
      }
    }
    if (category_id) {
      const catIdString = Array.isArray(category_id)
        ? category_id.join(",")
        : category_id
      searchParams.append("category_id", catIdString)
    }
    if (queryParams.in_stock) {
      searchParams.append("in_stock", "true")
    }

    if (queryParams.min_price !== undefined && !isNaN(queryParams.min_price)) {
      searchParams.append("min_price", queryParams.min_price.toString())
    }

    if (queryParams.max_price !== undefined && !isNaN(queryParams.max_price)) {
      searchParams.append("max_price", queryParams.max_price.toString())
    }

    if (offset) {
      searchParams.append("offset", offset.toString())
    }
    if (queryParams.limit) {
      searchParams.append("limit", queryParams.limit.toString())
    }

    const response = await sdk.client.fetch<{
      product_ids: string[]
      count: number
    }>(`/store/filtered-products?${searchParams.toString()}`, {
      method: "GET",
      cache: "no-store",
      next: { tags: ["products"] },
    })

    return {
      product_ids: response.product_ids || [],
      count: response.count || 0,
    }
  } catch (error) {
    console.error("Error in getCustomFilteredProductsIds:", error)
    return { product_ids: [], count: 0 }
  }
}

export async function submitProductReviewAction(
  productId: string,
  rating: number,
  comment: string,
  customer_id: string
) {
  try {
    await sdk.client.fetch(`/store/products/${productId}/reviews`, {
      method: "POST",
      body: {
        rating,
        comment,
        customer_id,
      },
    })

    return {
      success: true,
      message:
        "نظر شما با موفقیت ثبت شد و پس از تایید مدیریت نمایش داده می‌شود.",
    }
  } catch (error: any) {
    console.error("Server Action Error:", error)
    return {
      success: false,
      error:
        error.message || "خطا در برقراری ارتباط با سرور. لطفا مجددا تلاش کنید.",
    }
  }
}
