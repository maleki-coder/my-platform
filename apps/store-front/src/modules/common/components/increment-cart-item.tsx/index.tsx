import { LoaderCircle } from "lucide-react"
import { useState } from "react"

interface IncrementCartItemProps {
  id: string
  canIncrement: boolean
  manageInventory: boolean | undefined
  available: number
  onIncrement: (id: string) => Promise<void>
  className?: string
}

const IncrementCartItem = ({
  id,
  canIncrement,
  manageInventory,
  available,
  onIncrement,
  className,
}: IncrementCartItemProps) => {
  const [isIncrementing, setIsIncrementing] = useState(false)

  const handleClick = async () => {
    if (!canIncrement) return

    setIsIncrementing(true)
    await onIncrement(id).finally(() => {
      setIsIncrementing(false)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={!canIncrement}
      className={`w-8 h-8 border flex cursor-pointer justify-center items-center shadow-2xl rounded disabled:opacity-50 disabled:cursor-not-allowed ${
        className ?? ""
      }`}
      title={
        !canIncrement && manageInventory ? `حداکثر: ${available}` : undefined
      }
    >
      {isIncrementing ? (
        <div className="animate-spin">
          <LoaderCircle size={16} className="text-indigo-500" />
        </div>
      ) : (
        <span className="text-indigo-500 text-base font-bold">+</span>
      )}
    </button>
  )
}

export default IncrementCartItem
