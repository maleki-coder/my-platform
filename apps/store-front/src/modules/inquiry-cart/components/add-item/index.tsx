"use client"

import { useState, useTransition } from "react"
import { PlusIcon } from "lucide-react"
import useToggleState from "@lib/hooks/use-toggle-state"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@lib/components/ui/dialog"
import { Button } from "@lib/components/ui/button"
import { Label } from "@lib/components/ui/label"
import { Input } from "@lib/components/ui/input"
import { Spinner } from "@lib/components/ui/spinner"
// 1. Import your Server Action! Adjust the path based on your architecture.
import { addToInquiryCart } from "@lib/data/cart"
import { InquiryCartCurrency, InquiryCartItem } from "types/global"
import CurrencySelect from "@modules/common/components/currency-select"

const AddItemModal = () => {
  const {
    state: isOpen,
    open: openModal,
    close: closeModal,
  } = useToggleState(false)

  // We use useTransition for smooth non-blocking UI updates during Server Actions!
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [selectedCurrency, setSelectedCurrency] =
    useState<InquiryCartCurrency>("USD")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    const uniqueManualId = `manual_${
      crypto.randomUUID ? crypto.randomUUID() : Date.now()
    }`
    // Construct the payload matching your Partial<InquiryCartItem> signature
    const payload: InquiryCartItem = {
      title: formData.get("title") as string,
      quantity: Number(formData.get("quantity")) || 1,
      target_price: formData.get("target_price")
        ? String(formData.get("target_price"))
        : undefined,
      brand: formData.get("brand") as string,
      package: formData.get("package") as string,
      link: formData.get("link") as string,
      description: formData.get("description") as string,
      product_id: uniqueManualId,
      // You can inject defaults or other necessary fields here!
      currency: selectedCurrency, // Defaulting to IRR, or you could add a currency selector in the modal
    }

    startTransition(async () => {
      try {
        const result = await addToInquiryCart(payload)

        if (result.success) {
          // Success! The probability P(success) = 1. Close the modal!
          closeModal()
        } else {
          setError("Failed to add item. Please try again.")
        }
      } catch (err) {
        console.error("Error adding item to cart:", err)
        setError("An unexpected error occurred.")
      }
    })
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) openModal()
        else if (!isPending) closeModal() // Prevent closing while uploading!
      }}
    >
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-full px-4 py-2 transition-colors cursor-pointer text-sm font-medium">
          <PlusIcon size={18} />
          <span>افزودن کالای جدید</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-150 w-full max-h-screen md:max-h-[90vh] overflow-y-auto z-10000">
        <DialogHeader>
          <DialogTitle className="text-right text-lg font-bold">
            افزودن کالای جدید به استعلام
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-4 py-4">
            {/* Display errors if they occur */}
            {error && (
              <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="new_title">
                پارت نامبر / نام کالا <span className="text-red-500">*</span>
              </Label>
              <Input
                id="new_title"
                name="title"
                required
                placeholder="مثال: STM32F103C8T6"
                disabled={isPending}
              />
            </div>

            <div className="grid grid-cols-2 gap-x-4">
              <div className="space-y-2">
                <Label htmlFor="new_quantity">
                  تعداد <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="new_quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  required
                  placeholder="100"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_target_price">قیمت هدف</Label>
                <Input
                  id="new_target_price"
                  name="target_price"
                  type="number"
                  dir="ltr"
                  step="0.01"
                  className="text-left rtl:text-right"
                  placeholder="0.00"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4">
              <div className="space-y-2">
                <Label htmlFor="new_package">نوع ارز</Label>
                <CurrencySelect 
                value={selectedCurrency}
                onChange={(newCurrency) => {
                  setSelectedCurrency(newCurrency)
                }}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_package">پکیج</Label>
                <Input
                  id="new_package"
                  name="package"
                  placeholder="مثال: LQFP-48"
                  disabled={isPending}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <div className="space-y-2">
                <Label htmlFor="new_brand">برند</Label>
                <Input
                  id="new_brand"
                  name="brand"
                  placeholder="مثال: STMicroelectronics"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_link">لینک محصول (اختیاری)</Label>
                <Input
                  id="new_link"
                  name="link"
                  type="url"
                  dir="ltr"
                  className="text-left"
                  placeholder="https://..."
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_description">توضیحات تکمیلی</Label>
              <Input
                id="new_description"
                name="description"
                placeholder="نکات مهم در مورد این قطعه..."
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <div className="flex gap-3 justify-end w-full">
              <Button
                type="button"
                variant="secondary"
                onClick={closeModal}
                disabled={isPending}
                className="cursor-pointer h-10 px-6"
              >
                لغو
              </Button>
              <Button
                className="cursor-pointer h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white"
                type="submit"
                disabled={isPending}
              >
                {isPending ? <Spinner /> : "افزودن به لیست"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddItemModal
