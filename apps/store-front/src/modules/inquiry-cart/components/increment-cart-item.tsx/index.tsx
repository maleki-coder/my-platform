import { updateInquiryItem } from "@lib/data/cart"
import { LoaderCircle } from "lucide-react"
import { useState } from "react"
import { InquiryCartItem } from "types/global"

interface IncrementCartItemProps {
  item: InquiryCartItem
  className?: string
}

const IncrementCartItem = ({
  item,
  className,
}: IncrementCartItemProps) => {
  const [isIncrementing, setIsIncrementing] = useState(false)

  const handleClick = async () => {
    setIsIncrementing(true)
    let body :InquiryCartItem = {
      title: item.title,
      quantity: item.quantity + 1
    }
    await updateInquiryItem(item.id!, body).finally(
      () => {
        setIsIncrementing(false)
      }
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`w-10 h-10 border flex cursor-pointer justify-center items-center shadow-2xl rounded disabled:opacity-50 disabled:cursor-not-allowed ${
        className ?? ""
      }`}
    >
      {isIncrementing ? (
        <div className="animate-spin">
          <LoaderCircle size={16} className="text-indigo-500 font-semibold" />
        </div>
      ) : (
        <span className="text-indigo-500 text-xl font-semibold">+</span>
      )}
    </button>
  )
}

export default IncrementCartItem
