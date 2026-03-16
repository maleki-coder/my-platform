import { HttpTypes, StorePrice } from "@medusajs/types"

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type VariantPrice = {
  calculated_price_number: number
  calculated_price: string
  original_price_number: number
  original_price: string
  currency_code: string | null
  price_type: string | null
  percentage_diff: string
}

export type StoreFreeShippingPrice = StorePrice & {
  target_reached: boolean
  target_remaining: number
  remaining_percentage: number
}

export type CategoryImage = {
  id?: string
  url: string
  type: "thumbnail" | "image"
  category_id?: string
}

export type CategoryWithImages = HttpTypes.StoreProductCategory & {
  product_category_image?: CategoryImage[]
}
export type CategoryOption = {
  title: string
  values: string[]
}
export type CategoryOptionsResponse = {
  options: CategoryOption[]
}

export type CustomFilterParams = {
  categoryId?: string
  optionsFilters: Record<string, string[]>
  inStock?: boolean
  minPrice?: number
  maxPrice?: number
  limit?: number
  offset?: number
}
export interface StrapiImage {
  alternativeText: string
  caption: string
  url: string
  id: string
}
export interface StrapiFooterResponse {
  data: {
    contactList: Array<{
      phone: string
      email: string
      address: string
    }>
    columns: Array<{
      id: number
      title: string
      links: Array<{ id: number; label: string; url: string }>
    }>
    socials: Array<{
      id: number
      platform: string
      url: string
      image: StrapiImage
    }>
    certificates: Array<{
      image: StrapiImage
      name: string
      url: string
    }>
  }
}
