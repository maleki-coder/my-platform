"use server"
import { sdk } from "@lib/config"

export interface Slide {
  id: number
  title: string
  subtitle: string
  linkUrl: string
  order: number
  image: any
  altText: string
}

export interface SlidesResponse {
  slides: Slide[]
}

export async function fetchSlides(): Promise<SlidesResponse> {
  try {
    // The SDK automatically handles the base URL, headers, and JSON parsing
    const data = await sdk.client.fetch<SlidesResponse>(
      "/store/homepage/slides"
    )
    return data
  } catch (error) {
    // SDK throws errors for non-2xx responses automatically
    throw new Error(
      `Failed to fetch slides: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    )
  }
}
