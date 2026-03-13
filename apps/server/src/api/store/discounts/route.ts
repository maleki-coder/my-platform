// src/api/store/discounts/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { IPricingModuleService, PriceDTO } from "@medusajs/framework/types";
import { ModuleRegistrationName } from "@medusajs/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const variantIdsParam = req.query.variant_ids as string;
  if (!variantIdsParam) {
    return res.json({ discounts: {} });
  }

  const variantIds = variantIdsParam.split(",");

  // دسترسی به Query Graph
  const query = req.scope.resolve("query");

  // اصلاح کلید رزولوشن: استفاده از ModuleRegistrationName.PRICING (که معادل رشته "pricing" است)
  const pricingModuleService = req.scope.resolve<IPricingModuleService>(
    ModuleRegistrationName.PRICING,
  );

  try {
    const { data: variants } = await query.graph({
      entity: "variant",
      fields: ["id", "price_set.id"],
      filters: { id: variantIds },
    });

    const priceSetToVariantMap = new Map<string, string>();
    const priceSetIds: string[] = [];

    variants.forEach((variant: any) => {
      if (variant.price_set?.id) {
        priceSetToVariantMap.set(variant.price_set.id, variant.id);
        priceSetIds.push(variant.price_set.id);
      }
    });

    if (priceSetIds.length === 0) {
      return res.json({ discounts: {} });
    }

    const prices = await pricingModuleService.listPrices(
      { price_set_id: priceSetIds },
      { relations: ["price_list"] },
    );

    const discounts: Record<
      string,
      { starts_at: string | null; ends_at: string | null }
    > = {};
    const now = new Date();

    prices.forEach((price: PriceDTO) => {
      if (price.price_list && price.price_list.ends_at) {
        const startsAt = new Date(price.price_list.starts_at!);
        const endsAt = new Date(price.price_list.ends_at);
        const isCurrentlyActive =
          price.price_list.status === "active" &&
          now >= startsAt &&
          now <= endsAt;
        if (isCurrentlyActive) {
          const variantId = priceSetToVariantMap.get(price.price_set_id!);

          if (variantId) {
            discounts[variantId] = {
              starts_at: price.price_list.starts_at as string,
              ends_at: price.price_list.ends_at,
            };
          }
        }
      }
    });

    return res.json({ discounts });
  } catch (error) {
    console.error("Error fetching direct module discounts:", error);
    return res.status(500).json({
      discounts: {},
      error: "Failed to fetch discounts via Pricing Module",
    });
  }
}
