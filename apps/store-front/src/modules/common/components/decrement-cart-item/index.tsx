import { LoaderCircle } from "lucide-react"
import { useState } from "react"
import DeleteButton from "../delete-button"

interface DecrementCartItemProps {
  id: string
  canDecrement: boolean
  manageInventory: boolean | undefined | null
  onIncrement: (id: string) => Promise<void>
  className?: string
}

const DecrementCartItem = ({
  id,
  canDecrement,
  onIncrement,
  className,
}: DecrementCartItemProps) => {
  const [isDecrementing, setIsDecrementing] = useState(false)

  const handleClick = async () => {
    if (!canDecrement) return

    setIsDecrementing(true)
    await onIncrement(id).finally(() => {
      setIsDecrementing(false)
    })
  }

  return (
    <div
      className={`w-8 h-8 border flex justify-center items-center shadow-2xl rounded disabled:opacity-50 disabled:cursor-not-allowed ${
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
          className="text-indigo-500 text-2xl font-bold cursor-pointer w-full"
        >
          -
        </button>
      ) : (
        // 3) delete button
        <DeleteButton
          id={id}
          className="w-8 h-8 flex items-center justify-center"
        />
      )}
    </div>
  )
}

export default DecrementCartItem
