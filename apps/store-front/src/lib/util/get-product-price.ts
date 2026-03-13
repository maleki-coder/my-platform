// @lib/util/get-product-price.ts
import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-percentage-diff"
import { convertToLocale } from "./money"

// ۱. ساخت تایپ‌های توسعه‌یافته برای پشتیبانی از فیلدهای تزریق‌شده سفارشی
export type StitchedVariant = HttpTypes.StoreProductVariant & {
  discount_starts_at?: string | null
  discount_ends_at?: string | null
}

export type StitchedProduct = Omit<HttpTypes.StoreProduct, "variants"> & {
  variants?: StitchedVariant[] | null
}

export const getPricesForVariant = (variant: StitchedVariant) => {
  const cp = variant?.calculated_price

  if (!cp || cp.calculated_amount == null || cp.original_amount == null) {
    return null
  }

  return {
    calculated_price_number: cp.calculated_amount,
    calculated_price: convertToLocale({
      amount: cp.calculated_amount,
    }),
    original_price_number: cp.original_amount,
    original_price: convertToLocale({
      amount: cp.original_amount,
    }),
    currency_code: cp.currency_code,
    price_type: cp.calculated_price?.price_list_type ?? null,
    percentage_diff: getPercentageDiff(
      cp.original_amount,
      cp.calculated_amount
    ),
    // ۲. اضافه کردن تاریخ‌های تخفیف به آبجکت خروجی قیمت
    starts_at: variant.discount_starts_at ?? null,
    ends_at: variant.discount_ends_at ?? null,
  }
}

export function getProductPrice({
  product,
  variantId,
}: {
  product: StitchedProduct // استفاده از تایپ توسعه‌یافته
  variantId?: string
}) {
  if (!product || !product.id) {
    throw new Error("No product provided")
  }

  const cheapestPrice = () => {
    if (!product || !product.variants?.length) {
      return null
    }

    const cheapestVariant = product.variants
      .filter(
        (v: StitchedVariant) => v.calculated_price?.calculated_amount != null
      )
      .sort(
        (a, b) =>
          a.calculated_price!.calculated_amount! -
          b.calculated_price!.calculated_amount!
      )[0]

    return getPricesForVariant(cheapestVariant)
  }

  const variantPrice = () => {
    if (!product || !variantId) {
      return null
    }

    const variant: StitchedVariant | undefined = product.variants?.find(
      (v) => v.id === variantId || v.sku === variantId
    )

    if (!variant) {
      return null
    }

    return getPricesForVariant(variant)
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
  }
}
