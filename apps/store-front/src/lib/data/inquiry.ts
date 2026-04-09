"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { InquiryCartItem, InquiryCartResponse } from "types/global"

export async function getCustomerInquiries() {
  const headers = await getAuthHeaders()

  const next = await getCacheOptions("inquiries")
  try {
    const response = await sdk.client.fetch<InquiryCartResponse[]>(
      `/store/inquiries`,
      {
        method: "GET",
        headers,
        next,
        // We use "no-store" because user data changes frequently and shouldn't be statically cached
        cache: "no-store",
      }
    )
    return response
  } catch (error) {
    console.error("Error in getCustomerInquiries:", error)
    return null
  }
}

export async function getInquiryDetails(id: string) {
  const headers = await getAuthHeaders()

  const next = await getCacheOptions("inquiries")
  try {
    const response = await sdk.client.fetch<{items: Array<InquiryCartItem>}>(
      `/store/inquiries/${id}`,
      {
        method: "GET",
        headers,
        next,
        cache: "no-store",
      }
    )
    return response.items || []
  } catch (error) {
    console.error(`Error in getInquiryDetails for ID ${id}:`, error)
    return [] // Graceful fallback
  }
}
