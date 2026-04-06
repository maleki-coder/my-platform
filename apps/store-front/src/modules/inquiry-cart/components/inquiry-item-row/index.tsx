"use client"

import { useEffect, useState, useTransition } from "react"
import { InquiryCartItem } from "types/global"
import {
  CheckCircle2,
  ChevronDown,
  LinkIcon,
  Loader2,
  SaveIcon,
  UploadCloud,
} from "lucide-react"
import { Input } from "@lib/components/ui/input"
import { Label } from "@lib/components/ui/label"
import { Button } from "@lib/components/ui/button"
import { Spinner } from "@lib/components/ui/spinner"
import CurrencySelect from "@modules/common/components/currency-select"
import { clx } from "@lib/util/clx"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import DeleteButton from "@modules/inquiry-cart/components/delete-button"
import { updateInquiryItem, uploadDatasheetAction } from "@lib/data/cart"
import { MAX_FILE_SIZE } from "@lib/util/constants"

type InquiryItemRowProps = {
  item: InquiryCartItem
}

export default function InquiryItemRow({ item }: InquiryItemRowProps) {
  // 🎯 1. SINGLE SOURCE OF TRUTH: localItem manages all user inputs.
  const [localItem, setLocalItem] = useState<InquiryCartItem>(item)
  const serverItemString = JSON.stringify(item)
  // 🎯 2. UI STATES
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  // 🎯 3. ACTION STATES
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // 🔄 Sync local state when server item changes (e.g., after successful save)
  useEffect(() => {
    setLocalItem((currentLocal) => {
      // Calculate if we currently have unsaved changes BEFORE we overwrite
      const hasUnsavedChanges = [
        "quantity",
        "target_price",
        "description",
        "currency",
        "brand",
        "title",
        "package",
        "link",
        "datasheet_url",
      ].some(
        (key) =>
          currentLocal[key as keyof InquiryCartItem] !==
          item[key as keyof InquiryCartItem]
      )

      // If the user is editing, DO NOT overwrite their work!
      if (hasUnsavedChanges) {
        return currentLocal
      }

      // Otherwise, it's safe to sync with the server
      return item
    })
    // We depend on the stringified version so it only runs when actual values change,
    // not when Next.js simply creates a new object reference in memory.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverItemString])

  // 🧮 Mathematical isDirty Check: Compares Local vs Props state vector.
  const isDirty = [
    "quantity",
    "target_price",
    "description",
    "currency",
    "brand",
    "title",
    "package",
    "link",
    "datasheet_url",
  ].some(
    (key) =>
      localItem[key as keyof InquiryCartItem] !==
      item[key as keyof InquiryCartItem]
  )

  // 🛠️ Universal Input Handler
  const handleInputChange = (
    field: keyof InquiryCartItem,
    value: string | number | null
  ) => {
    setLocalItem((prev) => ({
      ...prev,
      [field]: value === "" ? null : value,
    }))
  }

  // 📂 Isolated Upload Logic
  const handleDatasheetUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Client-side Mathematical Validation: $Size \le 1MB$
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
    formData.append("datasheet", file)

    const result = await uploadDatasheetAction(formData)

    if (result.success && result.url) {
      // Update our unified state directly!
      handleInputChange("datasheet_url", result.url)
    } else {
      setUploadError(result.error || "خطا در آپلود فایل.")
    }
    setIsUploading(false)
  }

  // 💾 Save Logic
  const handleSaveChanges = () => {
    setError(null)

    const payload: Partial<InquiryCartItem> = {
      quantity: localItem.quantity,
      target_price: localItem.target_price,
      description: localItem.description,
      currency: localItem.currency || "USD",
      brand: localItem.brand,
      title: localItem.title,
      package: localItem.package,
      link: localItem.link,
      datasheet_url: localItem.datasheet_url,
    }

    startTransition(async () => {
      try {
        const result = await updateInquiryItem(item.id!, payload)
        if (!result.success) setError("Failed to update item.")
      } catch (err) {
        console.error("Update failed:", err)
        setError("An unexpected error occurred.")
      }
    })
  }

  // Helper for rendering inputs cleanly
  const renderInput = (
    id: string,
    label: string,
    field: keyof InquiryCartItem,
    type: "text" | "number" = "text",
    extraProps?: any
  ) => (
    <div className="px-3 py-4 flex-col justify-between border">
      <div className="relative w-full">
        <Label className="text-xsmall-regular text-gray-500 mb-2 ps-1">
          {label}
        </Label>
        <Input
          id={`${id}_${item.id}`}
          type={type}
          value={(localItem[field] as string | number) || ""}
          onChange={(e) =>
            handleInputChange(
              field,
              type === "number" ? Number(e.target.value) : e.target.value
            )
          }
          {...extraProps}
        />
      </div>
    </div>
  )

  return (
    <div className="relative mb-6 flex w-full flex-col rounded-2xl border px-6 md:px-11 py-6 last:mb-0 transition-all duration-300 ease-in-out">
      {/* DELETE BUTTON */}
      <div className="absolute left-3 top-2 z-5">
        <DeleteButton className="p-2 border rounded-4xl" id={item.id!} />
      </div>

      {/* ITEM HEADER */}
      <div className="flex w-full justify-between">
        <div className="flex w-0 grow flex-col pt-5">
          {item.product_handle ? (
            <LocalizedClientLink href={`/products/${item.product_handle}`}>
              <p className="pb-7 text-lg font-bold leading-8.5 -tracking-0.5 hover:text-blue-600 transition-colors">
                {localItem.title}
              </p>
            </LocalizedClientLink>
          ) : (
            <p className="pb-7 text-lg font-bold leading-8.5 -tracking-0.5">
              {localItem.title}
            </p>
          )}
        </div>
        <div className="w-36 h-36 relative">
          <Thumbnail
            thumbnail={item?.thumbnail}
            size="square"
            className="rounded-lg w-full h-full"
          />
        </div>
      </div>

      {/* DYNAMIC FIELDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-auto mt-4 transition-all">
        {/* ROW 1: Visible Columns */}
        {renderInput("title", "پارت نامبر", "title")}
        {renderInput("quantity", "تعداد", "quantity", "number")}

        <div className="px-3 py-4 flex-col justify-between border border-t-0 lg:border-t">
          <div className="relative w-full">
            <Label className="text-xsmall-regular text-gray-500 mb-2 ps-1">
              قیمت هدف
            </Label>
            <Input
              id={`target_price_${item.id}`}
              value={localItem.target_price || ""}
              onChange={(e) =>
                handleInputChange("target_price", e.target.value)
              }
              className="pl-14 pr-3 text-left rtl:text-right"
              dir="ltr"
              placeholder="0.00"
            />
            <span className="absolute left-3 top-[53%] text-sm text-gray-500 pointer-events-none font-medium">
              {localItem.currency || "USD"}
            </span>
          </div>
        </div>

        <div className="px-3 py-4 flex-col justify-between border border-t-0 lg:border-t">
          <div className="relative w-full">
            <Label className="text-xsmall-regular text-gray-500 mb-2 ps-1">
              نرخ ارز
            </Label>
            <CurrencySelect
              value={localItem.currency || "USD"}
              onChange={(newCurrency) =>
                handleInputChange("currency", newCurrency)
              }
            />
          </div>
        </div>

        {/* ROW 2: Expanded Columns */}
        {isExpanded && (
          <>
            {renderInput("package", "پکیج", "package")}
            {renderInput("brand", "برند", "brand")}
            {renderInput("link", "لینک", "link", "text", {
              dir: "ltr",
              className: "text-left",
            })}
            {renderInput("description", "توضیحات", "description")}

            {/* DATASHEET UPLOAD */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4 px-3 py-4 flex-col justify-between border bg-gray-50/50 rounded-b-lg">
              <div className="relative w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-col">
                  <Label className="text-sm font-bold text-gray-700 mb-1 ps-1">
                    آپلود دیتاشیت (PDF)
                  </Label>
                  <p className="text-xs text-gray-500 ps-1">
                    حداکثر حجم فایل = $1MB$
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {localItem.datasheet_url && (
                    <a
                      href={localItem.datasheet_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <LinkIcon size={14} /> مشاهده فایل
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
                          ? "bg-gray-100 text-gray-400 border-gray-200"
                          : localItem.datasheet_url
                          ? "bg-white text-green-700 border-green-200 hover:bg-green-50"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> در حال
                          آپلود...
                        </>
                      ) : localItem.datasheet_url ? (
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
              {uploadError && (
                <p className="text-xs text-red-500 mt-2 ps-1">{uploadError}</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="text-red-500 text-sm mt-3 px-2 font-medium">
          {error}
        </div>
      )}

      {/* ACTION BAR (Save & Toggle) */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between mt-4 w-full gap-4">
        <Button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors bg-gray-50 hover:bg-gray-100 px-4 py-2 border border-gray-200 w-full md:w-auto justify-center"
        >
          {isExpanded ? "نمایش کمتر" : "جزئیات بیشتر"}
          <ChevronDown
            size={16}
            className={clx("transition-transform duration-300 ease-in-out", {
              "rotate-180": isExpanded,
            })}
          />
        </Button>

        {isDirty && (
          <Button
            onClick={handleSaveChanges}
            disabled={isPending}
            className="bg-green-600 hover:bg-green-700 cursor-pointer text-white gap-2 w-full md:w-auto animate-in fade-in slide-in-from-right-4 duration-300 shadow-md"
          >
            {isPending ? (
              <Spinner className="w-4 h-4" />
            ) : (
              <>
                <SaveIcon size={16} /> ذخیره تغییرات
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
