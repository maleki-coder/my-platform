import { CheckCircle, PackageX } from "lucide-react"

type Props = {
  inStock?: boolean
}
export default function ProductInStockInfo({ inStock = true }: Props) {
  return (
    <div className="w-full items-center flex bg-blue-50 rounded">
      <div className="relative flex h-full items-center w-full min-w-[60%] pt-3 px-4">
        <div className="w-full items-center flex cursor-default border-b pb-3 border-white">
          {inStock ? (
            <>
              <CheckCircle size={18} color="green" />
              <div className="item-center mr-4 2md:mr-2 xl:mr-4 flex">
                <p className="text-small-semi">موجود در انبار</p>
              </div>
            </>
          ) : (
            <>
              <PackageX size={18} color="red" />
              <div className="item-center mr-4 2md:mr-2 xl:mr-4 flex">
                <p className="text-small-semi">ناموجود</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
