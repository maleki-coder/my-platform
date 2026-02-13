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
import { useSlider } from "@lib/hooks/use-slider"
import { Button } from "@lib/components/ui/button"

export function HomepageSlider() {
  const { data, isLoading, error } = useSlider()
  const [isCarouselReady, setIsCarouselReady] = useState(false)
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }))

  // Force carousel re-init when slides load
  useEffect(() => {
    if (data?.slides?.length) {
      setIsCarouselReady(false)
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => setIsCarouselReady(true), 100)
      return () => clearTimeout(timer)
    }
  }, [data?.slides])

  if (isLoading || !isCarouselReady || error) {
    return <SliderSkeleton />
  }

  const slides = data?.slides || []

  if (slides.length === 0) {
    return null
  }

  return (
    <section className="w-full">
      <Carousel
        key={`carousel-${slides.length}`} // Force remount when slides change
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
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem
              key={`slide-${slide.id}-${index}`}
              className="basis-full"
            >
              <div className="relative h-74 cursor-pointer overflow-hidden group">
                {slide.image ? (
                  <Image
                    src={slide.image.url}
                    alt={slide.altText}
                    fill
                    unoptimized
                    sizes="100vw"
                    priority={index === 0}
                    className="object-cover brightness-75 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white px-6 max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                      {slide.title}
                    </h2>
                    <p className="text-lg md:text-xl mb-6 text-gray-200">
                      {slide.subtitle}
                    </p>
                    <Button
                      asChild
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Link href={slide.linkUrl}>
                        {slide.linkUrl === "#" ? "Learn More" : "Shop Now"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="right-6 cursor-pointer" />
        <CarouselPrevious className="left-6 cursor-pointer" />
      </Carousel>
    </section>
  )
}

function SliderSkeleton() {
  return <Skeleton className="w-full h-74 overflow-hidden" />
}
