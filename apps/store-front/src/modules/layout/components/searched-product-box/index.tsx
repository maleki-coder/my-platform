"use client"
import { HttpTypes } from "@medusajs/types";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
interface SearchedProductBoxProps {
  className?: string;
  product: HttpTypes.StoreProduct;
  onNavigate?: () => void;
}

export default function SearchedProductBox({
  className = "",
  product,
  onNavigate
}: SearchedProductBoxProps) {

  const router = useRouter()
  const pathname = usePathname()
  const handleRoute = (url: string) => {
    if (!url) return;
    if (onNavigate) {
      onNavigate();
    }
    const basePath = pathname.split('/ir/')[0];
    router.push(`${basePath}/products/${url}`);
  }
  return (
    <div
      onClick={() => handleRoute(product.handle)}
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
