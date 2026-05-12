import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { ICachingModuleService } from "@medusajs/framework/types"

type ClearProductCacheInput = {
  productId: string | string[]
}

export const clearProductCacheStep = createStep(
  "clear-product-cache",
  async ({ productId }: ClearProductCacheInput, { container }) => {
    const cachingModuleService =
      container.resolve<ICachingModuleService>(Modules.CACHE)

    const productIds = Array.isArray(productId) ? productId : [productId]

    for (const id of productIds) {
      if (id) {
        await cachingModuleService.clear({
          tags: [`Product:${id}`],
        })
      }
    }

    return new StepResponse({})
  }
)
