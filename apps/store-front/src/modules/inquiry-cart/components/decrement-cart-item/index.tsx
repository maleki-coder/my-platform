import { updateInquiryItem } from "@lib/data/cart"
import DeleteButton from "@modules/inquiry-cart/components/delete-button"
import { LoaderCircle } from "lucide-react"
import { useState } from "react"
import { InquiryCartItem } from "types/global"

interface DecrementCartItemProps {
  item: InquiryCartItem
  canDecrement: boolean
  className?: string
}

const DecrementCartItem = ({
  item,
  canDecrement,
  className,
}: DecrementCartItemProps) => {
  const [isDecrementing, setIsDecrementing] = useState(false)

  const handleClick = async () => {
    setIsDecrementing(true)
    let body: InquiryCartItem = {
      title: item.title,
      quantity: item.quantity - 1,
    }
    await updateInquiryItem(item.id!, body).finally(() => {
      setIsDecrementing(false)
    })
  }

  return (
    <div
      className={`w-10 h-10 border flex justify-center items-center shadow-2xl rounded disabled:opacity-50 disabled:cursor-not-allowed ${
        className ?? ""
      }`}
    >
      {isDecrementing ? (
        // 1) loading state
        <div className="animate-spin">
          <LoaderCircle size={16} className="text-indigo-500" />
        </div>
      ) : canDecrement ? (
        // 2) normal decrement button
        <button
          onClick={handleClick}
          className="text-indigo-500 text-2xl font-bold cursor-pointer w-full h-full"
        >
          -
        </button>
      ) : (
        // 3) delete button
        <DeleteButton
          id={item.id!}
        />
      )}
    </div>
  )
}

export default DecrementCartItem
