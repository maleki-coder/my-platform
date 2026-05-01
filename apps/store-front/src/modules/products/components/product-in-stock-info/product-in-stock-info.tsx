import { CheckCircle, TruckIcon } from "lucide-react"

type Props = {
  info?: string
}
export default function ProductInStockInfo({ info }: Props) {
  return (
    <div className="w-full items-center flex bg-blue-50 rounded">
      <div className="relative flex h-full items-center w-full min-w-[60%] pt-3 px-4">
        <div className="w-full items-center flex cursor-default border-b pb-3 border-white">
          <CheckCircle size={18} color="green" />
          <div className="item-center mr-4 2md:mr-2 xl:mr-4 flex">
            <p className="text-small-semi">موجود در انبار فروشنده</p>
          </div>
        </div>
      </div>
    </div>
  )
}
