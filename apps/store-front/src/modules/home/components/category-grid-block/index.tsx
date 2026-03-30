import Image from "next/image"
import Link from "next/link"
import { CategoryGridBlockData } from "types/global"

export function CategoryGridBlock({ data }: { data: CategoryGridBlockData }) {
  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
  return (
    <div className="flex flex-col gap-8 px-4">
      <section className="flex w-full flex-col">
        <h2 className="text-center text-base font-semibold leading-6 lg:text-xl lg:leading-8">
          {data.title}
        </h2>
        <ul
          id={data.id}
          className="flex flex-wrap justify-between gap-7 pt-4 lg:gap-x-8 lg:gap-y-11.5 xl:pt-6"
        >
          {data.cards.map((card) => (
            <Link key={card.id} href={card.handle}>
              <li className="flex flex-col items-center gap-2">
                <Image
                  width={200}
                  height={200}
                  priority={false}
                  loading="lazy"
                  className="h-20 w-20 cursor-pointer lg:h-45 lg:w-45"
                  src={strapiUrl + card.image.url}
                  alt={card.image.alternativeText}
                />
                <p className="text-xs text-gray-600 font-medium text-center leading-4 w-20 md:w-full lg:text-lg">
                  {card.title}
                </p>
              </li>
            </Link>
          ))}
        </ul>
      </section>
    </div>
  )
}
