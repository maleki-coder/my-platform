import { cache } from "react"
import { getCacheOptions } from "./cookies"
import { sdk } from "@lib/config"
import { StoreFooterResponse } from "types/global"

export const getFooterData = cache(async (): Promise<StoreFooterResponse> => {
  const cacheTagsConfig = {
    ...(await getCacheOptions("footer")),
  }
  return sdk.client
    .fetch<StoreFooterResponse>(`/store/footer`, {
      cache: "force-cache",
      next: {
        ...cacheTagsConfig,
        revalidate: 1,
      },
    })
    .then(({ certificates, linkColumns, contactInfo }) => certificates)
    .catch((error) => {
      console.error(`Error fetching footer data`, error)
      return
    })
})
