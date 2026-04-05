export interface StrapiImage {
  alternativeText: string;
  caption: string;
  url: string;
  id: string;
}
export interface StrapiFooterResponse {
  data: {
    contactList: Array<{
      id: number;
      phone: string;
      email: string;
      address: string;
    }>;
    columns: Array<{
      id: number;
      title: string;
      links: Array<{ id: number; label: string; url: string }>;
    }>;
    socials: Array<{
      id: number;
      platform: string;
      url: string;
      image: StrapiImage;
    }>;
    certificates: Array<{
      image: StrapiImage;
      name: string;
      url: string;
    }>;
  };
}

export interface InquiryCart {
  id: string;
  customer_id: string;
  customer_name: string;
  email: string;
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
  id: string;
  cart_id: string;
  title: string;
  quantity: number;
  deleted_at: string;
  created_at: string;
  updated_at: string;
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
