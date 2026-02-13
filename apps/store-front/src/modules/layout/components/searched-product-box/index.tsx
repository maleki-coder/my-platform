import { HttpTypes } from "@medusajs/types";
import Image from "next/image";
interface SearchedProductBoxProps {
  className?: string;
  product: HttpTypes.StoreProduct;
}

export default function SearchedProductBox({
  className = "",
  product,
}: SearchedProductBoxProps) {
  return (
    <div
      className={`flex cursor-pointer flex-nowrap items-center p-2 bg-blue-50 my-2 rounded-md ${className}`}
    >
      <div className="shadow-[0_4px_14px_-3px_rgba(0,0,0,0.22)]">
        {product.thumbnail && (
          <Image
            src={product.thumbnail as string}
            width={50}
            height={50}
            alt="Logo"
            //   fill
            unoptimized
            style={{ objectFit: "cover" }}
          />
        )}
      </div>
      <div className="ms-4">{product.title}</div>
    </div>
  );
}
