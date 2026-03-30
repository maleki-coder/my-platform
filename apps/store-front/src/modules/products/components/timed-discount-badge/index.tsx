// src/modules/products/components/timed-discount-badge/index.tsx
"use client"

import { convertToLocale } from "@lib/util/money"
import { useEffect, useState } from "react"

type TimedDiscountBadgeProps = {
  startsAt?: string | null
  endsAt: string
}

type TimeLeft = {
  // فیلد days حذف شد تا همه‌چیز به صورت تجمیعی در hours نمایش داده شود
  hours: number
  minutes: number
  seconds: number
}

export default function TimedDiscountBadge({
  startsAt,
  endsAt,
}: TimedDiscountBadgeProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [isExpired, setIsExpired] = useState(false)

  // حل مشکل Hydration Mismatch در Next.js
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!endsAt) return

    const endDate = new Date(endsAt).getTime()
    const startDate = startsAt ? new Date(startsAt).getTime() : null

    const calculateTime = () => {
      const now = new Date().getTime()
      const distance = endDate - now

      // اگر زمان تمام شده باشد
      if (distance <= 0) {
        setIsExpired(true)
        setTimeLeft(null)
        setProgress(100)
        return
      }

      // منطق جدید محاسبه زمان: تبدیل کل روزها به ساعت
      setTimeLeft({
        hours: Math.floor(distance / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })

      // محاسبه نوار پیشرفت (فرمول: زمان سپری شده / کل زمان تخفیف)
      if (startDate) {
        const totalDuration = endDate - startDate
        const timePassed = now - startDate
        const calculatedProgress = Math.min(
          Math.max((timePassed / totalDuration) * 100, 0),
          100
        )
        setProgress(calculatedProgress)
      } else {
        // اگر تاریخ شروع نامشخص باشد، نوار پیشرفت را روی 100 تنظیم می‌کنیم
        setProgress(100)
      }
    }

    // اجرای اولیه
    calculateTime()

    // تنظیم تایمر هر 1 ثانیه
    const timer = setInterval(calculateTime, 1000)

    // پاکسازی تایمر هنگام Unmount
    return () => clearInterval(timer)
  }, [endsAt, startsAt])

  // جلوگیری از رندر تا زمان Mount شدن کلاینت یا در صورت انقضا
  if (!isMounted || isExpired || !timeLeft) return null

  // تابع هوشمند برای پر کردن صفر قبل از اعداد (سازگار با convertToLocale)
  const formatTimeValue = (value: number) => {
    const localizedValue = convertToLocale({ amount: value }).toString()

    // اگر طول رشته ۱ کاراکتر بود، یک صفر (به همان زبان سیستم) به آن اضافه می‌کنیم
    if (localizedValue.length === 1) {
      const localizedZero = convertToLocale({ amount: 0 }).toString()
      return `${localizedZero}${localizedValue}`
    }

    return localizedValue
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between gap-2 text-small-semi md:text-large-semi text-rose-600 px-2 py-1.5 rounded-t-md">
        <span>تخفیف</span>

        {/* 
          تگ div با time جایگزین شد.
          ویژگی‌های tabular-nums و font-mono برای جلوگیری از پرش عرض اعداد اضافه شدند.
        */}
        <time
          dateTime={new Date(endsAt).toISOString()}
          className="flex items-center gap-1 tracking-tighter tabular-nums"
          dir="ltr"
          role="timer"
          aria-label="زمان باقیمانده تخفیف"
        >
          {/* بخش days به طور کامل حذف شد چون درون hours محاسبه شده است */}
          <span>{formatTimeValue(timeLeft.hours)}</span>
          <span> :</span>
          <span>{formatTimeValue(timeLeft.minutes)}</span>
          <span> :</span>
          <span>{formatTimeValue(timeLeft.seconds)}</span>
        </time>
      </div>

      {/* نوار پیشرفت (فقط اگر تاریخ شروع مشخص باشد رندر می‌شود) */}
      {startsAt && (
        <div className="w-full bg-gray-200 h-1 overflow-hidden">
          <div
            className="bg-rose-500 h-1 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  )
}
