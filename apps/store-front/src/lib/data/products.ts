"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"
import { SortOptions } from "@modules/categories/components/category-order-filter"
import { CustomFilterParams } from "types/global"

export type SelectedFilters = Record<string, string[]>

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
  optionsFilters,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams &
    HttpTypes.StoreProductListParams &
    Record<string, any>
  countryCode?: string
  regionId?: string
  optionsFilters?: SelectedFilters
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const { min_price, max_price, in_stock, ...medusaParams } = queryParams || {}

  // const params = queryParams || {}
  const limit = medusaParams.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let totalFilteredCount: number | undefined = undefined
  const hasCustomFilters =
    (optionsFilters && Object.keys(optionsFilters).length > 0) ||
    min_price !== undefined ||
    max_price !== undefined ||
    in_stock !== undefined

  if (hasCustomFilters) {
    const categoryId = medusaParams.category_id
      ? medusaParams.category_id[0]
      : undefined

    // ارسال تمامی فیلترهای سفارشی به متد بک‌اند شما
    const filteredData = await getCustomFilteredProductsIds({
      categoryId,
      optionsFilters: (optionsFilters || {}) as Record<string, string[]>,
      limit, // استفاده از متغیر محاسبه شده‌ی بالا
      offset, // استفاده از متغیر محاسبه شده‌ی بالا
      minPrice: min_price ? parseInt(min_price as string) : undefined,
      maxPrice: max_price ? parseInt(max_price as string) : undefined,
      inStock: in_stock,
    })

    // اگر فیلتر اعمال شد اما هیچ محصولی پیدا نشد، سریعاً آرایه خالی برمی‌گردانیم
    if (filteredData.product_ids.length === 0) {
      return {
        response: { products: [], count: 0 },
        nextPage: null,
      }
    }

    // قرار دادن آیدی‌های فیلتر شده در آبجکت استاندارد مدوسا
    medusaParams.id = filteredData.product_ids
    totalFilteredCount = filteredData.count
  }

  let region: HttpTypes.StoreRegion | undefined | null
  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return { response: { products: [], count: 0 }, nextPage: null }
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
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,",
          ...medusaParams,
        },
        headers,
        next,
        cache: "no-cache",
      }
    )
    .then(({ products, count }) => {
      const finalCount =
        totalFilteredCount !== undefined ? totalFilteredCount : count
      const nextPage = finalCount > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count: finalCount,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
    .catch((error) => {
      console.error("Error fetching standard products:", error)
      return {
        response: { products: [], count: 0 },
        nextPage: null,
      }
    })
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
  optionsFilters,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  optionsFilters?: Record<string, string[]>
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
    optionsFilters,
  })

  const sortedProducts = sortProducts(products, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
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
  categoryId,
  optionsFilters,
  inStock,
  minPrice,
  maxPrice,
  limit = 100,
  offset = 0,
}: CustomFilterParams): Promise<{ product_ids: string[]; count: number }> {
  try {
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    })

    // ۲. اضافه کردن شناسه دسته‌بندی (در صورت وجود)
    if (categoryId) {
      queryParams.append("category_id", categoryId)
    }

    // ۳. پردازش و اضافه کردن فیلترهای گزینه‌ای (همان لاجیک قبلی شما)
    if (optionsFilters && Object.keys(optionsFilters).length > 0) {
      const filterValues = Object.values(optionsFilters)
        .flat()
        .filter(Boolean)
        .join(",")
      if (filterValues) {
        queryParams.append("options", filterValues)
      }
    }

    // ۴. اضافه کردن فیلترهای جدید (قیمت و موجودی)
    if (inStock) {
      queryParams.append("in_stock", "true")
    }

    if (minPrice !== undefined && !isNaN(minPrice)) {
      queryParams.append("min_price", minPrice.toString())
    }

    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      queryParams.append("max_price", maxPrice.toString())
    }

    // ۵. ارسال درخواست به بک‌اند مدوسا از طریق SDK
    const response = await sdk.client.fetch<{
      product_ids: string[]
      count: number
    }>(`/store/filtered-products?${queryParams.toString()}`, {
      method: "GET",
      // نکته مهم: برای فیلترهای پویا، کش شدن می‌تواند باعث نمایش داده‌های اشتباه شود
      // ترکیب cache: 'no-store' برای اطمینان از دریافت داده‌های لحظه‌ای توصیه می‌شود
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
