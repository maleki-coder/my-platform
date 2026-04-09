"use client"

import { useRouter } from "next/navigation"
import { Button } from "@lib/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@lib/components/ui/dialog"

type SuccessInquiryModalProps = {
  isOpen: boolean
  onClose: () => void
  cartId?: string
  countryCode: string
}

export default function SuccessInquiryModal({
  isOpen,
  onClose,
  cartId,
  countryCode,
}: SuccessInquiryModalProps) {
  const router = useRouter()

  // String manipulation isolated inside the component!
  const getShortCartId = (id?: string) => {
    if (!id) return "N/A"
    return id.slice(-6).toUpperCase()
  }

  const handleGoToPanel = () => {
    onClose() // Always good practice to close the modal before routing
    router.push(`/${countryCode}/account/inquiries/details/${cartId}`)
  }

  const handleClose = () => {
    onClose()
    router.push(`/${countryCode}/account`)
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) handleClose()
      }}
    >
      <DialogContent className="sm:max-w-md text-center p-8 z-100">
        <DialogHeader className="flex flex-col items-center justify-center gap-4">
          <div className="h-16 w-16 bg-green-100 text-green-600 flex items-center justify-center rounded-full mb-2 shadow-sm">
            <CheckCircle2 size={36} />
          </div>
          <DialogTitle className="text-xl font-black text-gray-900">
            استعلام با موفقیت ثبت شد!
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4 text-gray-600 text-sm leading-relaxed">
          <p>
            درخواست شما با کد پیگیری <span className="font-bold text-blue-600 text-base px-1" dir="ltr">#{getShortCartId(cartId)}</span> دریافت شد.
          </p>
          <p>
            تیم فروش ما به زودی درخواست شما را بررسی کرده و با شما تماس خواهند گرفت. همچنین می‌توانید وضعیت این استعلام را در پنل کاربری خود مشاهده نمایید.
          </p>
        </div>

        <DialogFooter className="mt-4 flex flex-col gap-2 w-full sm:flex-row sm:justify-center">
          <Button
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white cursor-pointer px-8 transition-colors"
            onClick={handleGoToPanel}
          >
            مشاهده در پنل کاربری
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto cursor-pointer px-8"
            onClick={handleClose}
          >
            بستن
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
