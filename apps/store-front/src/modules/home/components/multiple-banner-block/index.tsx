import React from "react"
import Link from "next/link"
import Image from "next/image"
import { MultipleBannerBlockData } from "types/global"

interface Props {
  data: MultipleBannerBlockData
}

export default function MultipleBannerBlock({ data }: Props) {
  // 1. Filter out inactive banners
  // 2. Sort them beautifully by the 'order' property
  // 3. Slice the array to ensure we NEVER exceed 3 banners
  const displayBanners = data.banners
    ?.filter((banner) => banner.is_active)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3)

  // If there's nothing to show, render nothing (invisible magic! ✨)
  if (!displayBanners || displayBanners.length === 0) {
    return null
  }

  // Determine grid columns based on the number of banners to ensure perfect scaling
  const getGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1"
    if (count === 2) return "grid-cols-1 sm:grid-cols-2"
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  }
  const gridClass = getGridClass(displayBanners.length)
  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
  return (
    <section className="w-full px-4 lg:px-0">
      <div
        className={`grid grid-cols-1 gap-4 sm:gap-6 ${getGridClass(
          displayBanners.length
        )}`}
      >
        {displayBanners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.link_url || "/"}
            className="group relative flex w-full h-full max-h-60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {banner.image?.url && (
              <Image
                width={1600}
                height={400}
                priority={displayBanners.length === 1}
                src={strapiUrl + banner.image.url}
                alt={
                  banner.image.alternativeText ||
                  banner.title ||
                  "Promotional Banner"
                }
                className="w-full h-auto max-h-60 object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
