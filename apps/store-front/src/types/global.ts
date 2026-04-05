import { HttpTypes, StorePrice } from "@medusajs/types"

export interface InquiryCartResponse {
  customer_id: string;
  customer_name: string;
  email: string;
  id: string;
  items: Array<InquiryCartItem>;
  notes: string;
  phone: string;
  status: InquiryCartStatus;
  deleted_at: string;
  created_at: string;
  updated_at: string;
};
export enum InquiryCartStatus {
  ACTIVE = "active",
  SUBMITTED = "submitted",
  CONTACTED = "contacted",
}
export type InquiryCartCurrency = "USD" | "CYN" | "IRR";
export interface InquiryCartItemBase {
  id?: string;
  cart_id?: string;
  title: string;
  quantity: number;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
};
export interface InquiryCartItem extends InquiryCartItemBase {
  product_id?: string;
  product_handle?: string;
  variant_id?: string;
  thumbnail?: string;
  target_price?: string;
  currency?: InquiryCartCurrency;
  package?: string;
  brand?: string;
  link?: string;
  description?: string;
  datasheet_url?: string;
};

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

// blocks

export interface BaseBlock {
  id: string
  __component: string
}

export interface HomepageActionResponse {
  success: boolean
  homepage?: {
    blocks?: AllStrapiBlocks[]
  }
  error?: string
}
export interface BannerComponent {
  id: number
  title: string
  link_url: string
  is_active: boolean
  order: number
  image: StrapiImage
}
export interface CategoryGridBlockData extends BaseBlock {
  __component: "blocks.category-grid"
  id: string
  title: string
  handle: string
  cards: Array<{
    id: string
    handle: string
    title: string
    image: BaseStrapiImage
  }>
}
export enum ProductCategoryType {
  CATEGORY = "category",
  COLLECTION = "collection",
}
export interface ProductCategoryShowcaseData extends BaseBlock {
  __component: "blocks.product-category-showcase"
  category_handle: string[] | string
  layout: LayoutType
  limit: number
  show_view_all: boolean
  title: string
  type: ProductCategoryType
  search_param: string
  countryCode?: string
}
export interface MultipleBannerBlockData {
  __component: "blocks.multiple-banner"
  banners: BannerComponent[]
}

interface BaseStrapiImage {
  id: string
  url: string
  alternativeText: string
}
enum LayoutType {
  CAROUSEL = "carousel",
  GRID = "grid",
}

export type AllStrapiBlocks =
  | CategoryGridBlockData
  | ProductCategoryShowcaseData
  | MultipleBannerBlockData

export type BlockComponentProps<T> = {
  data: T
}
export type BlockComponent<T extends AllStrapiBlocks> = React.ComponentType<{
  data: T
}>

export type BlockMap = {
  [K in AllStrapiBlocks["__component"]]: BlockComponent<
    Extract<AllStrapiBlocks, { __component: K }>
  >
}
