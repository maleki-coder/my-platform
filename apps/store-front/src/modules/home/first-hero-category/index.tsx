"use client"

import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import Link from "next/link"
import { useRef, useEffect, useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@lib/components/ui/carousel"
import { Skeleton } from "@lib/components/ui/skeleton"
import { useFetchHeroCategories } from "@lib/hooks/use-fetch-hero-categories"
import { CategoryWithImages } from "types/global"

export function FirstHeroCategory() {
  const { data, isLoading, error } = useFetchHeroCategories()
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }))

  if (isLoading || error) {
    return <SliderSkeleton />
  }

  if (data?.length === 0 || data == null || data == undefined) {
    return null
  }
  function hasImage(item: CategoryWithImages): boolean {
    return (
      Array.isArray(item.product_category_image) &&
      item.product_category_image.length > 0
    )
  }
  return (
    <section className="w-full">
      <Carousel
        key={`carousel-${data?.length}`}
        plugins={[plugin.current]}
        className="relative"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        dir="ltr"
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
          startIndex: 0,
        }}
      >
        <CarouselContent className="lg:mx-8 mx-2">
          {data!.filter(hasImage).map((item) => {
            const img = item.product_category_image![0]
            return (
              <CarouselItem
                key={`slide-${item.id}`}
                className="basis-1/4 md:basis-1/6 lg:basis-1/7"
              >
                <div className="relative cursor-pointer group rounded-full border-2 hover:border-4 hover:border-blue-800 border-blue-500 mx-auto w-20 h-20 lg:w-32 lg:h-32">
                  {item.product_category_image ? (
                    <Image
                      src={img.url}
                      alt={img.type}
                      fill
                      className="object-cover transition-transform p-1 rounded-full duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <SliderSkeleton />
                  )}
                </div>
                <a className="relative inset-0 flex items-center justify-center cursor-pointer">
                  <div className="text-center text-blue-800 px-6 my-4">
                    <span className="text-xs text-nowrap font-semiBold lg:text-base lg:font-medium text-shadow-2xs">
                      {item.name}
                    </span>
                  </div>
                </a>
              </CarouselItem>
            )
          })}
        </CarouselContent>

        <CarouselNext className="right-6 cursor-pointer" />
        <CarouselPrevious className="left-6 cursor-pointer" />
      </Carousel>
    </section>
  )
}

function SliderSkeleton() {
  return <Skeleton className="w-full h-20 lg:h-32" />
}
