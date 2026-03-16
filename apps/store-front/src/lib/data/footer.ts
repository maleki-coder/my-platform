"use server"
import { cache } from "react"
import { getCacheOptions } from "./cookies"
import { sdk } from "@lib/config"
import { StrapiFooterResponse } from "types/global"

// اضافه کردن | null به خروجی تا در صورت بروز خطا، اپلیکیشن کرش نکند
export const getFooterData = cache(
  async (): Promise<StrapiFooterResponse | null> => {
    try {
      const cacheTagsConfig = await getCacheOptions("footer")

      // دریافت داده‌ها از SDK مدوسا
      const response = await sdk.client.fetch<StrapiFooterResponse>(
        `/store/footer`,
        {
          next: {
            // باز کردن تگ‌های کش (احتمالاً برای On-demand Revalidation)
            ...cacheTagsConfig,
            // کش کردن داده‌ها برای ۲۴ ساعت (۸۶۴۰۰ ثانیه) به جای ۱ ثانیه
            revalidate: 1,
          },
        }
      )

      // بازگرداندن کل آبجکت (شامل لینک‌ها، اطلاعات تماس و گواهینامه‌ها)
      return response
    } catch (error) {
      // ثبت خطا در سرور بدون متوقف کردن رندرینگ
      console.error(`[Global Footer] Error fetching footer data:`, error)

      // بازگرداندن null تا کامپوننت UI بتواند حالت Fallback را نمایش دهد
      return null
    }
  }
)
