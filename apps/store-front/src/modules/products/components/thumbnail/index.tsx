// import { Container, clx } from "@medusajs/ui"
import Image from "next/image"
import React from "react"

import PlaceholderImage from "@modules/common/icons/placeholder-image"
import { clx } from "@lib/util/clx"

type ThumbnailProps = {
  thumbnail?: string | null
  // TODO: Fix image typings
  images?: any[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  rounded?: boolean
  objectFit?: "cover" | "contain"
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size,
  rounded = true,
  objectFit = "cover",
  isFeatured,
  className,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url
  const hasCustomSize = className?.includes("w-") || className?.includes("h-")

  return (
    <div
      className={clx(
        "relative w-full overflow-hidden p-4 group-hover:shadow-elevation-card-hover transition-shadow ease-in-out duration-150",
        {
          "rounded-large": rounded,
          "aspect-11/14": isFeatured && !hasCustomSize,
          "aspect-9/16": !isFeatured && size !== "square" && !hasCustomSize,
          "aspect-square": size === "square" && !hasCustomSize,
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        },
        className,
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={initialImage} size={size} objectFit={objectFit} />
    </div>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
  objectFit,
}: Pick<ThumbnailProps, "size"> & { image?: string, objectFit: "cover" | "contain" }) => {
  return image ? (
    <Image
      src={image}
      alt="Thumbnail"
      className={clx(
        "absolute inset-0 object-center",
        {
          "object-cover": objectFit === "cover",
          "object-contain": objectFit === "contain",
        }
      )}
      draggable={false}
      quality={50}
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
      fill
    />
  ) : (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center">
      <PlaceholderImage size={size === "small" ? 16 : 24} />
    </div>
  )
}

export default Thumbnail
