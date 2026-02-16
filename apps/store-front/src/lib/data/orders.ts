"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export const retrieveOrder = async (id: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("orders")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreOrderResponse>(`/store/orders/${id}`, {
      method: "GET",
      query: {
        fields:
          "*payment_collections.payments,*items,*items.metadata,*items.variant,*items.product,*fulfillments.labels",
      },
      headers,
      next,
      cache: "no-cache",
    })
    .then(({ order }) => order)
    .catch((err) => medusaError(err))
}

export const listOrders = async (
  limit: number = 10,
  offset: number = 0,
  filters?: Record<string, any>
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("orders")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreOrderListResponse>(`/store/orders`, {
      method: "GET",
      query: {
        limit,
        offset,
        order: "-created_at",
        fields: "*items,+items.metadata,*items.variant,*items.product",
        ...filters,
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ orders }) => orders)
    .catch((err) => medusaError(err))
}

export const createTransferRequest = async (
  state: {
    success: boolean
    error: string | null
    order: HttpTypes.StoreOrder | null
  },
  formData: FormData
): Promise<{
  success: boolean
  error: string | null
  order: HttpTypes.StoreOrder | null
}> => {
  const id = formData.get("order_id") as string

  if (!id) {
    return { success: false, error: "Order ID is required", order: null }
  }

  const headers = await getAuthHeaders()

  return await sdk.store.order
    .requestTransfer(
      id,
      {},
      {
        fields: "id, email",
      },
      headers
    )
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }))
}

export const acceptTransferRequest = async (id: string, token: string) => {
  const headers = await getAuthHeaders()

  return await sdk.store.order
    .acceptTransfer(id, { token }, {}, headers)
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }))
}

export const declineTransferRequest = async (id: string, token: string) => {
  const headers = await getAuthHeaders()

  return await sdk.store.order
    .declineTransfer(id, { token }, {}, headers)
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }))
}

export const uploadReceipt = async (
  state: {
    success: boolean
    error: string | null
    receiptUrl: string | null
  },
  formData: FormData
): Promise<{
  success: boolean
  error: string | null
  receiptUrl: string | null
}> => {
  const orderId = formData.get("order_id") as string
  const receiptFile = formData.get("receipt") as File | null
  const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
  if (!orderId) {
    return { success: false, error: "Order ID is required", receiptUrl: null }
  }

  if (!receiptFile || receiptFile.size === 0) {
    return {
      success: false,
      error: "No receipt file provided",
      receiptUrl: null,
    }
  }

  const headers = await getAuthHeaders()

  // Prepare FormData for the fetch (since it's multipart)
  const uploadFormData = new FormData()
  uploadFormData.append("receipt", receiptFile)
  try {
    const response = await fetch(
      `${BACKEND_URL}/store/orders/${orderId}/upload-receipt`,
      {
        method: "POST",
        body: uploadFormData,
        headers: { ...headers, "x-publishable-api-key": PUBLISHABLE_API_KEY! },
      }
    )
    return {
      success: true,
      error: null,
      receiptUrl: response.url || null,
    }
  } catch (err) {
    // Use your medusaError helper for consistent error handling
    const error = medusaError(err)
    return {
      success: false,
      error: error || "Failed to upload receipt",
      receiptUrl: null,
    }
  }
}
