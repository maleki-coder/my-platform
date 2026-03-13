import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query");
  // فراخوانی مستقیم ماژول قیمت‌گذاری برای دور زدن محدودیت‌های Query Graph
  const pricingModuleService = req.scope.resolve(Modules.PRICING);

  // ۱. استخراج و استانداردسازی پارامترها
  const categoryId = req.query.category_id as string | undefined;
  const optionsParam = req.query.options as string | undefined;
  const limit = parseInt((req.query.limit as string) || "100", 10);
  const offset = parseInt((req.query.offset as string) || "0", 10);

  const inStockParam = req.query.in_stock as string | undefined;
  const minPriceParam = req.query.min_price as string | undefined;
  const maxPriceParam = req.query.max_price as string | undefined;

  let rawCurrency = req.query.currency_code;
  if (Array.isArray(rawCurrency)) rawCurrency = rawCurrency[0];
  const currencyCode = ((rawCurrency as string) || "irr").toLowerCase().trim();

  const minPrice =
    minPriceParam !== undefined && !isNaN(parseInt(minPriceParam, 10))
      ? parseInt(minPriceParam, 10)
      : undefined;
  const maxPrice =
    maxPriceParam !== undefined && !isNaN(parseInt(maxPriceParam, 10))
      ? parseInt(maxPriceParam, 10)
      : undefined;
  const requireInStock = inStockParam === "true";

  // ۲. فیلترهای اولیه پایگاه داده
  let dbFilters: any = { status: "published" };

  if (categoryId) {
    dbFilters.categories = { id: categoryId };
  }

  if (optionsParam) {
    const optionValues = optionsParam.split(",");
    dbFilters.options = {
      values: { value: { $in: optionValues } },
    };
  }

  try {
    // مرحله اول: واکشی امنِ داده‌ها بدون درگیری با Calculated Price
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "variants.id",
        "variants.manage_inventory",
        "variants.allow_backorder",
        "variants.inventory_items.inventory.location_levels.available_quantity",
        // کلید طلایی: فقط آیدی Price Set را می‌گیریم، نه قیمت محاسبه شده را
        "variants.price_set.id",
      ],
      filters: dbFilters,
      pagination: { skip: 0, take: 5000 },
    });

    // مرحله دوم: استخراج تمام شناسه‌های مجموعه قیمتی (Price Set IDs)
    const priceSetIds = new Set<string>();
    products.forEach((product: any) => {
      product.variants?.forEach((variant: any) => {
        if (variant.price_set?.id) {
          priceSetIds.add(variant.price_set.id);
        }
      });
    });

    // مرحله سوم: محاسبه مستقیم قیمت‌ها از طریق سرویس Pricing
    const priceMap: Record<string, number> = {};
    if (priceSetIds.size > 0) {
      // استفاده از متد قدرتمند calculatePrices که مستقیماً کانتکست را می‌پذیرد
      const calculatedPrices = await pricingModuleService.calculatePrices(
        { id: Array.from(priceSetIds) },
        {
          context: {
            currency_code: currencyCode,
          },
        },
      );

      // ساخت یک دیکشنری (Map) برای دسترسی سریع (O(1)) به قیمت‌ها
      calculatedPrices.forEach((cp: any) => {
        if (
          cp.id &&
          cp.calculated_amount !== null &&
          cp.calculated_amount !== undefined
        ) {
          priceMap[cp.id] = cp.calculated_amount;
        }
      });
    }

    // مرحله چهارم: پردازش و فیلترینگ نهایی
    const filteredProducts = products.filter((product: any) => {
      if (
        !product?.variants ||
        !Array.isArray(product.variants) ||
        product.variants.length === 0
      ) {
        return false;
      }

      return product.variants.some((variant: any) => {
        let isPriceMatch = true;
        let isStockMatch = true;

        // --- بررسی شرط قیمت با استفاده از دیکشنری قیمت‌ها ---
        if (minPrice !== undefined || maxPrice !== undefined) {
          // دریافت قیمت نهایی از روی آیدی Price Set و دیکشنری
          const effectivePrice = variant.price_set?.id
            ? priceMap[variant.price_set.id]
            : undefined;

          if (typeof effectivePrice !== "number" || isNaN(effectivePrice)) {
            isPriceMatch = false;
          } else {
            const meetsMin =
              minPrice !== undefined ? effectivePrice >= minPrice : true;
            const meetsMax =
              maxPrice !== undefined ? effectivePrice <= maxPrice : true;
            isPriceMatch = meetsMin && meetsMax;
          }
        }

        // --- بررسی شرط موجودی ---
        if (requireInStock) {
          if (
            variant?.manage_inventory === true ||
            variant?.allow_backorder === true
          ) {
            isStockMatch = true;
          } else {
            let totalAvailable = 0;
            const inventoryItems = Array.isArray(variant?.inventory_items)
              ? variant.inventory_items
              : [];

            for (const item of inventoryItems) {
              const actualInventory =
                item?.inventory || item?.inventory_item || item;
              const locationLevels = actualInventory?.location_levels;

              if (Array.isArray(locationLevels)) {
                for (const level of locationLevels) {
                  const qty = level?.available_quantity;
                  if (typeof qty === "number") {
                    totalAvailable += qty;
                  }
                }
              } else if (
                typeof actualInventory?.available_quantity === "number"
              ) {
                totalAvailable += actualInventory.available_quantity;
              }
            }

            isStockMatch = totalAvailable > 0;
          }
        }

        return isPriceMatch && isStockMatch;
      });
    });

    // ۵. اعمال صفحه‌بندی
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);
    const productIds = paginatedProducts.map((p: any) => p.id);

    res.json({
      product_ids: productIds,
      count: filteredProducts.length,
    });
  } catch (error: any) {
    console.error("🔥 Decoupled Fetch CRASH Details:", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      message: "Error fetching and filtering products",
      details: error.message || "Unknown error",
    });
  }
}
