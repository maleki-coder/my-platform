"use client"
import { deleteLineItem } from "@lib/data/cart"
import { LoaderCircle, TrashIcon } from "lucide-react"
import { useState } from "react"

const DeleteButton = ({
  id,
}: {
  id: string
  className?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    await deleteLineItem(id).catch((err) => {
      setIsDeleting(false)
    })
  }

  return (
      <button
        className="w-full flex justify-center items-center cursor-pointer"
        onClick={() => handleDelete(id)}
      >
        {isDeleting ? (
          <div className="animate-spin">
            <LoaderCircle size={16} className="text-indigo-500" />
          </div>
        ) : (
          <TrashIcon size={16} className="text-indigo-500" />
        )}
      </button>
  )
}

export default DeleteButton
