import type { StoreOrderFulfillment } from "@medusajs/types"
declare module "@medusajs/types" {
  interface StoreOrderFulfillment {
    labels?: {
      id: string
      tracking_number: string
      tracking_url: string
      label_url: string
      fulfillment_id: string
      created_at: string
      updated_at: string | null
      deleted_at: string | null
    }[]
  }
}
