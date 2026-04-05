"use client"
import { deleteFromInquiryCart } from "@lib/data/cart"
import { LoaderCircle, TrashIcon } from "lucide-react"
import { useState } from "react"

const DeleteButton = ({
  id,
  className
}: {
  id: string
  className?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    await deleteFromInquiryCart(id).catch((err) => {
      setIsDeleting(false)
    })
  }

  return (
      <button
        className={`w-full h-full flex justify-center items-center cursor-pointer ${className}`}
        onClick={() => handleDelete(id)}
      >
        {isDeleting ? (
          <div className="animate-spin">
            <LoaderCircle size={16} className="text-indigo-500 font-semibold" />
          </div>
        ) : (
          <TrashIcon size={16} className="text-indigo-500 font-semibold" />
        )}
      </button>
  )
}

export default DeleteButton
