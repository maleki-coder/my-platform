import { CheckCircleIcon } from "lucide-react"

export const CheckoutStepHeader = ({
  isOpen,
  title,
}: {
  isOpen: boolean
  title: string
}) => {
  return (
    <header className="flex gap-4 md:px-3">
      <p className="text-lg font-bold">{title}</p>
      <span>{!isOpen && <CheckCircleIcon />}</span>
    </header>
  )
}
