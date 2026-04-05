"use client"

import { useState } from "react"
import { InquiryCartCurrency, InquiryCartItem } from "types/global"
import {
  CheckCircle2,
  ChevronDown,
  LinkIcon,
  Loader2,
  UploadCloud,
} from "lucide-react"
import { Input } from "@lib/components/ui/input"
import { Label } from "@lib/components/ui/label"
import CurrencySelect from "@modules/common/components/currency-select"
import { clx } from "@lib/util/clx"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import DeleteButton from "@modules/inquiry-cart/components/delete-button"
// Import your server actions/constants
import { uploadDatasheetAction } from "@lib/data/cart"
import { MAX_FILE_SIZE } from "@lib/util/constants"

type InquiryItemRowProps = {
  item: InquiryCartItem
}

const InquiryItemRow = ({ item }: InquiryItemRowProps) => {
  // 🎯 Now the hooks are safely isolated at the top level of this specific component!
  // It doesn't matter how many items there are, each component instance calls exactly 5 hooks.
  const [selectedCurrency, setSelectedCurrency] = useState<InquiryCartCurrency>(
    (item.currency as InquiryCartCurrency) || "IRR"
  )
  const [datasheetUrl, setDatasheetUrl] = useState<string>(
    item.datasheet_url || ""
  )
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // 📂 Your isolated upload handler
  const handleDatasheetUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 📐 Client-side Mathematical Validation: $Size_{max} = 5MB$
    if (file.size > MAX_FILE_SIZE) {
      setUploadError("حجم فایل نباید بیشتر از ۱ مگابایت باشد.")
      return
    }
    if (file.type !== "application/pdf") {
      setUploadError("فقط فایل‌های PDF مجاز هستند.")
      return
    }

    setIsUploading(true)
    setUploadError(null)

    const formData = new FormData()
    // Ensure the field name matches what your backend multer expects (e.g., "files")
    formData.append("datasheet", file)

    const result = await uploadDatasheetAction(formData)

    if (result.success && result.url) {
      setDatasheetUrl(result.url)
      console.log(
        `Successfully uploaded for item ${item.id}: $URL = ${result.url}$`
      )
      // Optional: You can call an action here to instantly update the cart item in Medusa!
    } else {
      setUploadError(result.error || "خطا در آپلود فایل.")
    }
    setIsUploading(false)
  }

  return (
    <div
      key={item.id}
      className="relative mb-6 flex w-full flex-col rounded-2xl border px-11 py-6 last:mb-0 transition-all duration-300 ease-in-out"
    >
      {/* DELETE BUTTON */}
      <div className="absolute left-3 top-2">
        <DeleteButton className="p-2 border rounded-4xl" id={item.id!} />
      </div>

      {/* ITEM HEADER (Title & Image) */}
      <div className="flex w-full justify-between">
        <div className="flex w-0 grow flex-col pt-5">
          {item.product_handle ? (
            <LocalizedClientLink href={`/products/${item.product_handle}`}>
              <p className="pb-7 text-lg font-bold leading-8.5 -tracking-0.5">
                {item?.title}
              </p>
            </LocalizedClientLink>
          ) : (
            <p className="pb-7 text-lg font-bold leading-8.5 -tracking-0.5">
              {item?.title}
            </p>
          )}
        </div>
        {item.product_handle ? (
          <LocalizedClientLink href={`/products/${item.product_handle}`}>
            <div className="w-36 h-36 relative">
              <Thumbnail thumbnail={item?.thumbnail} size="square" />
            </div>
          </LocalizedClientLink>
        ) : (
          <div className="w-36 h-36 relative">
            <Thumbnail thumbnail={item?.thumbnail} size="square" />
          </div>
        )}
      </div>

      {/* DYNAMIC FIELDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-auto mt-4 transition-all">
        {/* --- VISIBLE COLUMNS (1 to 4) --- */}
        <div className="px-3 py-4 flex-col justify-between border border-r">
          <div className="relative w-full">
            <Label className="text-xsmall-regular text-gray-500 mb-2 ps-1">
              پارت نامبر
            </Label>
            <Input
              id={`title_${item.id}`}
              name="title"
              defaultValue={item.title}
            />
          </div>
        </div>

        <div className="px-3 py-4 flex-col justify-between border">
          <div className="relative w-full">
            <Label className="text-xsmall-regular text-gray-500 mb-2 ps-1">
              تعداد
            </Label>
            <Input
              id={`quantity_${item.id}`}
              name="quantity"
              defaultValue={item.quantity}
              data-testid="quantity-input"
            />
          </div>
        </div>

        <div className="px-3 py-4 flex-col justify-between border">
          <div className="relative w-full">
            <Label className="text-xsmall-regular text-gray-500 mb-2 ps-1">
              قیمت هدف
            </Label>
            <Input
              id={`target_price_${item.id}`}
              name="target_price"
              className="pl-14 pr-3 text-left rtl:text-right"
              dir="ltr"
              defaultValue={item.target_price || ""}
              data-testid="target-price-input"
              placeholder="0"
            />
            <span className="absolute left-3 top-[53%] text-sm text-gray-500 pointer-events-none">
              {selectedCurrency}
            </span>
          </div>
        </div>

        <div className="px-3 py-4 flex-col justify-between border">
          <div className="relative w-full">
            <Label className="text-xsmall-regular text-gray-500 mb-2 ps-1">
              نرخ ارز
            </Label>
            <div className="w-full shrink-0">
              <CurrencySelect
                value={selectedCurrency}
                onChange={(newCurrency) => {
                  setSelectedCurrency(newCurrency)
                  console.log(
                    `Updated item ${item.id} currency to $${newCurrency}$`
                  )
                }}
              />
            </div>
          </div>
        </div>

        {/* --- HIDDEN COLUMNS (5 to 8) - Toggled via state --- */}
        {isExpanded && (
          <>
            <div className="px-3 py-4 flex-col justify-between border border-t-0 lg:border-t lg:border-r">
              <div className="relative w-full">
                <Label className="text-xsmall-regular text-gray-500 mb-2 ps-1">
                  پکیج
                </Label>
                <Input
                  id={`package_${item.id}`}
                  name="package"
                  defaultValue={item.package || ""}
                  data-testid="package-input"
                />
              </div>
            </div>

            <div className="px-3 py-4 flex-col justify-between border border-t-0 lg:border-t">
              <div className="relative w-full">
                <Label className="text-xsmall-regular text-gray-500 mb-2 ps-1">
                  برند
                </Label>
                <Input
                  id={`brand_${item.id}`}
                  name="brand"
                  defaultValue={item.brand || ""}
                  data-testid="brand-input"
                />
              </div>
            </div>

            <div className="px-3 py-4 flex-col justify-between border border-t-0 lg:border-t">
              <div className="relative w-full">
                <Label className="text-xsmall-regular text-gray-500 mb-2 ps-1">
                  لینک
                </Label>
                <Input
                  id={`link_${item.id}`}
                  name="link"
                  defaultValue={item.link || ""}
                  data-testid="link-input"
                />
              </div>
            </div>

            <div className="px-3 py-4 flex-col justify-between border border-t-0 lg:border-t">
              <div className="relative w-full">
                <Label className="text-xsmall-regular text-gray-500 mb-2 ps-1">
                  توضیحات
                </Label>
                <Input
                  id={`description_${item.id}`}
                  name="description"
                  defaultValue={item.description || ""}
                  data-testid="description-input"
                />
              </div>
            </div>
            {/* 📄 NEW 9th COLUMN: DATASHEET UPLOAD */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4 px-3 py-4 flex-col justify-between border border-t-0 lg:border-t lg:border-r bg-gray-50/50">
              <div className="relative w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-col">
                  <Label className="text-sm font-bold text-gray-700 mb-1 ps-1">
                    آپلود دیتاشیت (PDF)
                  </Label>
                  <p className="text-xs text-gray-500 ps-1">
                    حداکثر حجم فایل = 1MB
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Hidden Input tied to state for Form Submission later */}
                  <input
                    type="hidden"
                    name="datasheet_url"
                    value={datasheetUrl}
                    id={`datasheet_url_${item.id}`}
                  />

                  {datasheetUrl && (
                    <a
                      href={datasheetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <LinkIcon size={14} /> مشاهده فایل فعلی
                    </a>
                  )}

                  <div className="relative">
                    <Input
                      type="file"
                      id={`file_upload_${item.id}`}
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleDatasheetUpload}
                      disabled={isUploading}
                    />
                    <Label
                      htmlFor={`file_upload_${item.id}`}
                      className={clx(
                        "relative top-2 flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all text-sm font-medium",
                        isUploading
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : datasheetUrl
                          ? "bg-white text-green-700 border-green-200 hover:bg-green-50"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> در حال
                          آپلود...
                        </>
                      ) : datasheetUrl ? (
                        <>
                          <CheckCircle2 size={16} className="text-green-600" />{" "}
                          تغییر فایل
                        </>
                      ) : (
                        <>
                          <UploadCloud size={16} /> انتخاب فایل
                        </>
                      )}
                    </Label>
                  </div>
                </div>
              </div>

              {/* Error Message Display */}
              {uploadError && (
                <p className="text-xs text-red-500 mt-2 ps-1 animate-in fade-in slide-in-from-top-1">
                  {uploadError}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* 🔽 EXPAND / COLLAPSE BUTTON */}
      <div className="flex justify-center mt-4 w-full">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors bg-gray-50 px-4 py-2 rounded-full border"
        >
          {isExpanded ? "نمایش کمتر" : "جزئیات بیشتر"}
          <ChevronDown
            size={16}
            className={clx("transition-transform duration-300 ease-in-out", {
              "rotate-180": isExpanded,
              "rotate-0": !isExpanded,
            })}
          />
        </button>
      </div>
    </div>
  )
}

export default InquiryItemRow
