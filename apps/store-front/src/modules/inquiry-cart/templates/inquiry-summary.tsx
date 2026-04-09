"use client"

import { useTransition, useRef, useState } from "react"
import { useCustomer } from "@lib/context/customer-context"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@lib/components/ui/button"
import { Spinner } from "@lib/components/ui/spinner"
import { InquiryCartResponse } from "types/global"
import {
  UploadCloud,
  Edit3,
  Send,
  CheckCircle2,
  FileSpreadsheet,
  Download,
} from "lucide-react"
import { clx } from "@lib/util/clx"
import { submitInquiryCart, uploadBOMAction } from "@lib/data/cart"
import SuccessInquiryModal from "@modules/inquiry-cart/components/success-inquiry-modal"

type InquirySummaryProps = {
  cart: InquiryCartResponse | null
}

export default function InquirySummary({ cart }: InquirySummaryProps) {
  const router = useRouter()
  const { customer, isLoading: isCustomerLoading } = useCustomer()
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null) // Added Error State
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "ir" // Dynamic locale!
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [submittedCartId, setSubmittedCartId] = useState<string | null>(null)
  const hasItems = (cart?.items?.length || 0) > 0
  const currentStep = hasItems ? 2 : 1

  // Handle the Excel File Upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      // Execute the server action
      await uploadBOMAction(formData)
    } catch (error) {
      console.error("Upload failed", error)
    } finally {
      setIsUploading(false)
      // Reset input so the user can upload the same file again if needed
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleAction = () => {
    if (isCustomerLoading) return
    if (!customer) {
      startTransition(() => {
        router.push(
          `/${countryCode}/account?backTo=/${countryCode}/inquiry-cart`
        )
      })
      return
    }
    if (!cart?.id) return
    setSubmitError(null)
    startTransition(async () => {
      // Crafting the payload with fallback safety checks
      const payload = {
        email: customer.email,
        phone: customer.phone!,
        customer_name:
          `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
          "کاربر ناشناس",
        customer_id: customer.id,
        notes: "ثبت شده از طریق وبسایت", // You can add a `<textarea>` later to make this dynamic!
      }

      console.log("Submitting cart ID: ", cart.id, " with Payload: ", payload)

      const response = await submitInquiryCart(cart.id, payload)

      if (response.success) {
        setSubmittedCartId(cart.id)
        setShowSuccessDialog(true)
      } else {
        // Error Handling: Display the error so the user isn't left hanging
        setSubmitError(response.error || "خطایی در ثبت استعلام رخ داد")
      }
    })
  }

  // Enhanced Render helper that accepts children for buttons
  const renderStep = (
    stepNumber: number,
    title: string,
    description: string,
    Icon: any,
    isLast = false,
    children?: React.ReactNode // <-- Added children prop
  ) => {
    const isActive = currentStep === stepNumber
    const isCompleted = currentStep > stepNumber

    return (
      <div className="relative flex gap-4 pb-8 last:pb-0">
        {!isLast && (
          <div
            className={clx(
              "absolute right-5 top-10 bottom-0 w-0.5 transition-colors duration-300",
              isCompleted ? "bg-blue-600" : "bg-gray-200"
            )}
          />
        )}

        <div
          className={clx(
            "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
            isCompleted
              ? "bg-blue-600 border-blue-600 text-white"
              : isActive
              ? "bg-blue-50 border-blue-600 text-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
              : "bg-white border-gray-200 text-gray-400"
          )}
        >
          {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
        </div>

        <div className="flex flex-col pt-2 w-full">
          <h4
            className={clx(
              "text-sm font-bold transition-colors",
              isActive || isCompleted ? "text-gray-900" : "text-gray-500"
            )}
          >
            {title}
          </h4>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {description}
          </p>

          {/* Render custom buttons/inputs here! */}
          {children && <div className="mt-3">{children}</div>}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-y-6 border border-gray-200 rounded-2xl p-6 bg-white shadow-custom sticky top-12">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
            <FileSpreadsheet className="text-blue-600" />
            مراحل ثبت استعلام
          </h2>
        </div>

        <div className="flex flex-col mt-2">
          {/* STEP 1: Has Download Sample & Upload Input */}
          {renderStep(
            1,
            "آپلود فایل استعلام (BOM)",
            "فایل اکسل نمونه را دانلود کنید و پس از تکمیل، آن را آپلود نمایید.",
            UploadCloud,
            false,
            <div className="flex flex-col gap-2">
              <a
                href="/sample-bom.xlsx" // <-- Make sure this file exists in your /public folder!
                download
                className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
              >
                <Download size={14} />
                دریافت فایل نمونه
              </a>

              {/* Hidden Input File */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx, .xls, .csv"
                className="hidden"
              />

              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full cursor-pointer text-xs border-dashed border-2 hover:bg-gray-50 flex items-center gap-2"
              >
                {isUploading ? (
                  <Spinner className="w-4 h-4" />
                ) : (
                  <UploadCloud size={14} />
                )}
                {isUploading ? "در حال پردازش..." : "انتخاب و آپلود فایل"}
              </Button>
            </div>
          )}

          {/* STEP 2: Can also feature a secondary upload button if you want them to append more items! */}
          {renderStep(
            2,
            "بررسی و ویرایش",
            "جزئیات قطعات، قیمت هدف و دیتاشیت‌های مورد نیاز را بررسی کنید.",
            Edit3,
            false
          )}

          {renderStep(
            3,
            "ارسال نهایی",
            "درخواست خود را برای تیم فروش ارسال نمایید.",
            Send,
            true
          )}
        </div>

        <div className="mt-4 pt-6 border-t border-gray-100">
          {submitError && (
            <p className="text-red-500 text-xs font-bold mb-3 text-center">
              {submitError}
            </p>
          )}
          <Button
            onClick={handleAction}
            disabled={!hasItems || isPending}
            className={clx(
              "w-full h-14 text-base cursor-pointer font-bold shadow-md transition-all duration-300",
              !hasItems
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            {isPending || isCustomerLoading ? (
              <Spinner className="w-5 h-5" />
            ) : !customer ? (
              "ورود و ارسال"
            ) : (
              "ارسال نهایی"
            )}
          </Button>
        </div>
      </div>
      <SuccessInquiryModal
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        cartId={submittedCartId!}
        countryCode={countryCode}
      />
    </>
  )
}
