'use client'

import { uploadReceipt } from '@lib/data/orders'
import { useActionState, useRef } from 'react'  // ← Changed: useActionState from 'react' // Adjust path to your actions file

// Define initial state matching your action's return type
const initialState = {
  success: false,
  error: null as string | null,
  receiptUrl: null as string | null,
}

export default function UploadReceiptForm({ orderId }: { orderId: string }) {
  // useActionState returns: [state, formAction, isPending]
  const [state, formAction, isPending] = useActionState(uploadReceipt, initialState)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Optional: Clear file input after successful upload
  if (state.success && fileInputRef.current) {
    fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-4">
      <form action={formAction}>
        {/* Hidden input for order_id – required by your server action */}
        <input type="hidden" name="order_id" value={orderId} />

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Receipt (Image or PDF)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          name="receipt"  // Must match formData.get("receipt") in your action
          accept="image/*,application/pdf"
          required
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none mb-4"
          disabled={state.success || isPending}  // Disable after success or during pending
        />

        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          {isPending ? 'Uploading...' : 'Upload Receipt'}
        </button>
      </form>

      {state.error && (
        <p className="mt-4 text-red-600 text-sm">{state.error}</p>
      )}

      {state.success && state.receiptUrl && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm font-medium">
            Upload successful!
          </p>
          <a
            href={state.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline text-sm"
          >
            View uploaded receipt
          </a>
        </div>
      )}
    </div>
  )
}