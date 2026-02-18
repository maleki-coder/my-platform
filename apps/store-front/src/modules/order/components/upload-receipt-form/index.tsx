'use client'

import { Button } from '@lib/components/ui/button'
import { Input } from '@lib/components/ui/input'
import { Spinner } from '@lib/components/ui/spinner'
import { uploadReceipt } from '@lib/data/orders'
import { useActionState, useRef, useEffect } from 'react'

const initialState = {
  success: false,
  error: null as string | null,
  receiptUrl: null as string | null,
}

export default function UploadReceiptForm({ orderId }: { orderId: string }) {
  const [state, formAction, isPending] = useActionState(uploadReceipt, initialState)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleButtonClick = () => {
    // Trigger file input click
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Automatically submit the form when a file is selected
      formRef.current?.requestSubmit()
    }
  }

  // Clear file input after successful upload
  useEffect(() => {
    if (state.success && fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [state.success])

  return (
    <div className="space-y-4">
      <form ref={formRef} action={formAction}>
        <input type="hidden" name="order_id" value={orderId} />

        {/* Hidden file input */}
        <Input
          ref={fileInputRef}
          type="file"
          name="receipt"
          accept="image/*,application/pdf"
          className="hidden" // Hide the input
          onChange={handleFileChange}
          disabled={isPending}
        />

        {/* Single button that triggers file picker */}
        <Button
          type="button" // Important: type="button" to prevent form submission
          onClick={handleButtonClick}
          disabled={isPending}
          className="w-full cursor-pointer"
        >
          {isPending ? (
            <>
              <Spinner className="ml-2" />
              در حال بارگذاری...
            </>
          ) : (
            'بارگذاری رسید پرداخت'
          )}
        </Button>
      </form>

      {state.error && (
        <p className="mt-4 text-red-600 text-sm">{state.error}</p>
      )}

      {state.success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm font-medium">
            رسید با موفقیت بارگذاری شد
          </p>
        </div>
      )}
    </div>
  )
}