import { SortOptions } from './../../modules/categories/components/category-order-filter/index';
import { HttpTypes } from "@medusajs/types"
export interface BaseProductSearchParams {
  in_stock?: string
  min_price?: number
  max_price?: number
  page?: number
}
export type PaginatedProductResponse = {
  response: { products: HttpTypes.StoreProduct[]; count: number }
  page: number
  limit: number
  totalPages: number
  nextPage: number | null
  queryParams?: ProductSearchParams
}
export type ProductSearchParams = HttpTypes.FindParams &
      HttpTypes.StoreProductListParams &
      BaseProductSearchParams & 
      BaseProductOrderParams & 
      OptionsProductSearchParams
      
export interface BaseProductOrderParams {
  order? : SortOptions
}
export type StandardProductQueryParams = {
  order?: string
  page?: string
  limit?: number
  in_stock?: boolean
  min_price?: number
  max_price?: number
  id?: string[]
  category_id?: string
}

export interface CategoryPaginatedProductsProps {
  categoryHandle: string[]
  countryCode: string
  queryParams: ProductSearchParams
}

export type OptionsProductSearchParams = Record<string, string | string[] | number | boolean | undefined | null>
export interface ListProductsProps {
  countryCode?: string
  queryParams: ProductSearchParams
}
export type CustomFilterParams = {
  category_id?: string
  optionsFilters: OptionsProductSearchParams
  standardFilters: StandardProductQueryParams
  offset: number
}
