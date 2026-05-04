"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode, Navigation, Thumbs } from "swiper/modules"
import { ZoomIn, X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@lib/components/ui/dialog"

import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/navigation"
import "swiper/css/thumbs"

type ProductGalleryProps = {
  images: HttpTypes.StoreProductImage[] | undefined
  title: string
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [activeIndex, setActiveIndex] = useState(0)
  const [modalSwiper, setModalSwiper] = useState<any>(null)

  useEffect(() => {
    if (isModalOpen && modalSwiper) {
      modalSwiper.slideTo(activeIndex, 0)
    }
  }, [isModalOpen, modalSwiper, activeIndex])

  if (!images || images.length === 0) return null

  return (
    <div className="flex flex-col gap-4 w-full h-full">

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>

        {/* --- MAIN PAGE GALLERY --- */}
        <div className="relative w-full aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 group">
          <Swiper
            spaceBetween={10}
            // navigation={true}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            modules={[FreeMode, Navigation, Thumbs]}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="w-full h-full"
          >
            {images.map((image, index) => (
              <SwiperSlide key={`main-${image.id}`}>
                <div
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Image
                    src={image.url}
                    alt={`${title} - Image ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <DialogTrigger asChild>
            <button
              className="absolute bottom-4 right-4 z-10 bg-white/90 p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-105 duration-200"
              aria-label="Open image gallery fullscreen"
            >
              <ZoomIn size={20} className="text-gray-800" />
            </button>
          </DialogTrigger>
        </div>

        {/* --- UPGRADED WIDE MODAL --- */}
        <DialogContent
          className="min-w-screen h-full p-0 border-none bg-white flex flex-col shadow-2xl overflow-hidden z-10000"
        >
          {/* Header */}
          <DialogHeader className="w-full flex flex-row items-center justify-between p-5 border-b border-gray-100 bg-white z-50 shadow-sm">
            <DialogTitle className="text-gray-900 text-xl font-bold tracking-tight">
              {title}
            </DialogTitle>
            <DialogClose className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200 hover:rotate-90 transition-all duration-300">
              <X size={22} className="text-gray-700" />
            </DialogClose>
          </DialogHeader>

          {/* Modal Split Layout - Now heavily prioritizing horizontal space */}
          <div className="flex-1 w-full h-full grid grid-cols-1 lg:grid-cols-12 bg-white overflow-hidden">

            {/* LEFT SIDE: Large Active Image (Takes up 7 columns now) */}
            <div className="lg:col-span-7 h-full p-4 lg:p-8 flex items-center justify-center bg-gray-50/30">
              <Swiper
                onSwiper={setModalSwiper}
                spaceBetween={30}
                // navigation={true}
                modules={[Navigation]}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                className="w-full h-full max-h-[75vh]"
              >
                {images.map((image, index) => (
                  <SwiperSlide key={`modal-main-${image.id}`}>
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={image.url}
                        alt={`${title} Fullscreen ${index + 1}`}
                        fill
                        className="object-contain select-none drop-shadow-sm"
                        sizes="60vw"
                        quality={95}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* RIGHT SIDE: 5-Column Grid Thumbnails (Takes up 5 columns for maximum width) */}
            <div className="hidden lg:flex lg:col-span-5 h-full border-l border-gray-100 flex-col overflow-y-auto p-6 gap-6 custom-scrollbar bg-white">

              <div className="flex items-center justify-between pb-3 border-b border-gray-100"></div>

              {/* grid-cols-5 creates the exact 5-per-row horizontal stack */}
              <div className="grid grid-cols-5 gap-3 auto-rows-max">
                {images.map((image, index) => {
                  const isActive = activeIndex === index;
                  return (
                    <button
                      key={`modal-thumb-${image.id}`}
                      onClick={() => {
                        if (modalSwiper) {
                          modalSwiper.slideTo(index);
                        }
                      }}
                      className={`cursor-pointer relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${isActive
                          ? "border-blue-600 shadow-md scale-105 z-10"
                          : "border-gray-100 hover:border-gray-300 opacity-60 hover:opacity-100 hover:scale-105"
                        }`}
                    >
                      <Image
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="10vw"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </DialogContent>
      </Dialog>

      {/* --- MAIN PAGE THUMBNAILS (Below main image on product page) --- */}
      <div className="h-24 w-full">
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={12}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="w-full h-full product-thumbnails"
        >
          {images.map((image, index) => (
            <SwiperSlide
              key={`thumb-${image.id}`}
              className="cursor-pointer overflow-hidden rounded-xl border-2 border-transparent [&.swiper-slide-thumb-active]:border-gray-900 transition-colors bg-gray-50 opacity-60 [&.swiper-slide-thumb-active]:opacity-100 hover:opacity-100"
            >
              <div className="relative w-full h-full">
                <Image
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </div>
  )
}
