"use server"
import { cache } from "react"
import { getCacheOptions } from "./cookies"
import { sdk } from "@lib/config"
import { HomepageActionResponse } from "types/global"

export const fetchHomePageContent = cache(
  async (): Promise<HomepageActionResponse | null> => {
    try {
      const cacheTagsConfig = await getCacheOptions("homepage")

      const response = await sdk.client.fetch<HomepageActionResponse>(
        `/store/homepage`,
        {
          next: {
            ...cacheTagsConfig,
            revalidate: 1,
          },  
        }
      )

      return response
    } catch (error) {
      console.error(`[HomePage] Error fetching homepage data:`, error)
      return null
    }
  }
)
