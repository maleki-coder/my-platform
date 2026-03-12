import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query");

  // ۱. استخراج پارامترها
  const categoryId = req.query.category_id as string | undefined;
  const optionsParam = req.query.options as string | undefined;
  const limit = parseInt((req.query.limit as string) || "100", 10);
  const offset = parseInt((req.query.offset as string) || "0", 10);

  const inStockParam = req.query.in_stock as string | undefined;
  const minPriceParam = req.query.min_price as string | undefined;
  const maxPriceParam = req.query.max_price as string | undefined;

  const minPrice =
    minPriceParam !== undefined && !isNaN(parseInt(minPriceParam, 10))
      ? parseInt(minPriceParam, 10)
      : undefined;
  const maxPrice =
    maxPriceParam !== undefined && !isNaN(parseInt(maxPriceParam, 10))
      ? parseInt(maxPriceParam, 10)
      : undefined;
  const requireInStock = inStockParam === "true";

  // ۲. ساخت فیلترهای مجاز دیتابیس (فقط فیلدهای بومی ماژول Product)
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
    // ۳. واکشی داده‌ها به همراه اطلاعات Remote Links
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "variants.id",
        "variants.manage_inventory",
        "variants.allow_backorder",
        "variants.inventory_items.inventory.location_levels.available_quantity",
        "variants.price_set.prices.amount",
      ],
      filters: dbFilters,
      pagination: { skip: 0, take: 5000 },
    });

    // ۴. فیلترینگ ضدضربه درون‌حافظه (Bulletproof In-Memory Filtering)
    const filteredProducts = products.filter((product: any) => {
      // اگر محصول واریانت نداشته باشد، نمایش داده نمی‌شود
      if (
        !product?.variants ||
        !Array.isArray(product.variants) ||
        product.variants.length === 0
      )
        return false;

      // بررسی اینکه آیا حداقل یک واریانت شرایط فیلترها را دارد یا خیر
      return product.variants.some((variant: any) => {
        let isPriceMatch = true;
        let isStockMatch = true;

        // --- بررسی دقیق و ایمن شرط قیمت ---
        if (minPrice !== undefined || maxPrice !== undefined) {
          const variantPrices = Array.isArray(variant?.price_set?.prices)
            ? variant.price_set.prices
            : [];

          if (variantPrices.length === 0) {
            isPriceMatch = false; // فاقد قیمت
          } else {
            isPriceMatch = variantPrices.some((p: any) => {
              const amount = p?.amount;
              // اگر فیلد amount نامعتبر است، این قیمت رد می‌شود
              if (amount === undefined || amount === null) return false;

              const meetsMin =
                minPrice !== undefined ? amount >= minPrice : true;
              const meetsMax =
                maxPrice !== undefined ? amount <= maxPrice : true;
              return meetsMin && meetsMax;
            });
          }
        }

        // --- بررسی دقیق و ایمن شرط موجودی ---
        if (requireInStock) {
          if (
            variant?.manage_inventory === true ||
            variant?.allow_backorder === false ||
            variant?.allow_backorder === true
          ) {
            isStockMatch = true; // محصول نیازی به بررسی عددی موجودی ندارد
          } else {
            let totalAvailable = 0;
            // بررسی ایمن بودن آرایه inventory_items
            const inventoryItems = Array.isArray(variant?.inventory_items)
              ? variant.inventory_items
              : [];

            for (const item of inventoryItems) {
              // در ساختارهای مختلف مدوسا، دیتای انبار ممکن است در لایه‌های مختلفی باشد
              const actualInventory =
                item?.inventory || item?.inventory_item || item;
              const locationLevels = actualInventory?.location_levels;

              if (Array.isArray(locationLevels)) {
                for (const level of locationLevels) {
                  // استفاده از Optional Chaining برای جلوگیری از خطای Cannot read properties of undefined
                  const qty = level?.available_quantity;
                  if (typeof qty === "number") {
                    totalAvailable += qty;
                  }
                }
              } else if (
                typeof actualInventory?.available_quantity === "number"
              ) {
                // حالت Fallback: اگر مدوسا دیتا را به صورت فلت (Flat) برگرداند
                totalAvailable += actualInventory.available_quantity;
              }
            }

            isStockMatch = totalAvailable > 0;
          }
        }

        return isPriceMatch && isStockMatch;
      });
    });

    // ۵. اعمال صفحه‌بندی ایمن
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);
    const productIds = paginatedProducts.map((p: any) => p.id);

    // ارسال پاسخ نهایی
    res.json({
      product_ids: productIds,
      count: filteredProducts.length,
    });
  } catch (error: any) {
    console.error("🔥 Query Graph Fetch CRASH:", error.message || error);
    res.status(500).json({
      message: "Error fetching and filtering products",
      details: error.message || "Unknown error",
    });
  }
}
