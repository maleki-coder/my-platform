"use client"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import QuickAccessNav from "@modules/layout/components/quick-access-nav"
import { ChevronUp } from "lucide-react"

interface Category {
  id: string
  name: string
  handle: string
  parent_category?: any
  category_children?: Category[]
}

interface Collection {
  id: string
  title: string
  handle: string
}

interface FooterProps {
  categories: Category[]
  collections: Collection[]
  bottomMargin :string;
}

export default function Footer({ categories, collections, bottomMargin }: FooterProps) {
  return (
    <footer style={{ marginBottom: bottomMargin }} className="m-4 lg:mt-12 mt-6 relative left-0 right-0 overflow-hidden rounded-2xl bg-linear-to-r from-[#0079b1] to-[#1b3570]">
      <div className="px-4 mx-auto w-full lg:px-8 xl:px-6 max-w-screen-2xl">
        <div className="px-8">
          <div className="flex w-full justify-between pt-16 lg:pt-20">
            <div>image</div>
            <div className="h-[50px] md:w-[180px] w-[130px]">
              <button className="transition-all relative rounded-xl p-4 bg-primary-shade text-white cursor-pointer flex h-9! w-full! items-center gap-2 justify-center bg-white! 2md:!h-12 px-[22px]! 2md:!px-8 ">
                <ChevronUp className="fill-primary w-4 h-4 md:w-7 md:h-7" />
                <span className="select-none pt-1 lg:font-medium text-primary text-sm leading-[18px]">
                  بازگشت به بالا
                </span>
              </button>
            </div>
          </div>
          <div className="flex flex-row border-t border-white-50! pb-10.5 mt-10.5 text-white">
            <div className=" w-full pt-8 2xl:pt-12.5">
              <div className="grid grid-cols-3 2xl:grid-cols-6 gap-4">
                <QuickAccessNav title="دسترسی سریع" />
                <QuickAccessNav title="دسترسی سریع" />
                <QuickAccessNav title="دسترسی سریع" />
                <QuickAccessNav title="دسترسی سریع" />
                <QuickAccessNav title="دسترسی سریع" />
                <QuickAccessNav title="دسترسی سریع" />
              </div>
            </div>
          </div>
          <div className="flex border-t border-white-50! pb-10.5 text-white">
            <nav className="grid w-full grid-cols-1 gap-4  md:grid-cols-3  pt-14">
              <div className="flex flex-col">
                <p className="mb-6 lg:mb-[22px] text-base leading-6 lg:leading-7 lg:text-lg font-medium text-white">
                  ارتباط با ما
                </p>
                <div className="mb-4 flex flex-wrap gap-3">
                  <p className="whitespace-nowrap text-sm font-medium leading-[22px]">
                    تلفن :
                  </p>
                  <div className="flex">
                    <span className="flex items-center">
                      <a
                        href="tel:02162816000"
                        target="_blank"
                        className="dir-ltr whitespace-nowrap"
                      >
                        021 - 62816000
                      </a>
                      <span className="mx-0.5"> - </span>
                    </span>
                    <span className="flex items-center">
                      <a
                        href="tel:02191077500"
                        target="_blank"
                        className="dir-ltr whitespace-nowrap"
                      >
                        021 - 91077500
                      </a>
                    </span>
                  </div>
                </div>
                <div className="mb-4 flex flex-wrap gap-3">
                  <p className="whitespace-nowrap text-sm font-medium leading-[22px]">
                    ایمیل :
                  </p>
                  <div className="flex">
                    <span className="flex items-center">
                      <a
                        href="mailto:info@technolife.com"
                        target="_blank"
                        className="dir-ltr whitespace-nowrap"
                      >
                        info@technolife.com
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex md:justify-start">
                <div className="flex w-fit flex-row flex-wrap items-center justify-start gap-3 md:flex-col md:items-start lg:mx-0">
                  <p className="text-right text-sm font-medium leading-7 text-white lg:text-lg">
                    شبکه های اجتماعی
                  </p>
                  <div className="flex gap-4 lg:gap-8">
                    {/* Instagram */}
                    <a
                      rel="nofollow noopener"
                      href="https://www.instagram.com/technolife.eshop"
                      target="_blank"
                      className="inline-block"
                    >
                      <img
                        src="/image/footerImgsnd3HZ.webp"
                        alt="اینستاگرام تکنولایف"
                        className="socialImage w-8 h-8 lg:w-[30px] lg:h-[30px]"
                        loading="lazy"
                        fetchPriority="auto"
                      />
                    </a>

                    {/* Aparat */}
                    <a
                      rel="nofollow noopener"
                      href="https://www.aparat.com/technolife.com"
                      target="_blank"
                      className="inline-block"
                    >
                      <img
                        src="/image/footerImgLueLo3.webp"
                        alt="آپارات تکنو لایف"
                        className="socialImage w-8 h-8 lg:w-[30px] lg:h-[30px]"
                        loading="lazy"
                        fetchPriority="auto"
                      />
                    </a>

                    {/* Telegram */}
                    <a
                      rel="nofollow noopener"
                      href="https://t.me/technolife"
                      target="_blank"
                      className="inline-block"
                    >
                      <img
                        src="/image/footerImgcHi6f1.webp"
                        alt="تلگرام تکنولایف"
                        className="socialImage w-8 h-8 lg:w-[30px] lg:h-[30px]"
                        loading="lazy"
                        fetchPriority="auto"
                      />
                    </a>

                    {/* YouTube */}
                    <a
                      rel="nofollow noopener"
                      href="https://www.youtube.com/c/Technolife_eshop"
                      target="_blank"
                      className="inline-block"
                    >
                      <img
                        src="/image/footerImg7ujbp2.webp"
                        alt="یوتیوب تکنولایف"
                        className="socialImage w-8 h-8 lg:w-[30px] lg:h-[30px]"
                        loading="lazy"
                        fetchPriority="auto"
                      />
                    </a>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex md:justify-start ">
                <div className="flex  w-fit flex-col items-start justify-start gap-4.5 lg:gap-3   py-4 md:flex-col md:items-start lg:mx-0 ">
                  <p className="text-right text-base leading-6 font-medium lg:leading-7 text-white lg:text-lg ">
                    دانلود اپلیکیشن ما از:
                  </p>
                  <div className="flex flex-wrap gap-2 lg:gap-4">
                    <a
                      rel="nofollow noopener noreferrer"
                      href="https://cafebazaar.ir/app/com.technolife"
                      target="_blank"
                      className="flex h-12 min-w-[148px] max-w-1/2 lg:w-[88px] bg-white rounded p-2 items-center justify-center "
                    ></a>
                    <a
                      rel="nofollow noopener noreferrer"
                      href="https://sibapp.com/applications/Technolife"
                      target="_blank"
                      className="flex h-12 min-w-[148px] max-w-1/2 lg:w-[88px] bg-white rounded p-2 items-center justify-center "
                    ></a>
                    <a
                      rel="nofollow noopener noreferrer"
                      href="https://myket.ir/app/com.technolife"
                      target="_blank"
                      className="flex h-12 min-w-[148px] max-w-1/2 lg:w-[88px] bg-white rounded p-2 items-center justify-center "
                    ></a>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </footer>
    // <footer className="border-ui-border-base w-full">
    //   <div className="content-container flex flex-col w-full">
    //     <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between py-40">
    //       <div>
    //         <LocalizedClientLink
    //           href="/"
    //           className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase"
    //         >
    //           Medusa Store
    //         </LocalizedClientLink>
    //       </div>
    //       <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
    //         {categories.slice(0, 6).map((c) => (
    //           <div key={c.id} className="flex flex-col gap-y-2">
    //             <span className="txt-small-plus txt-ui-fg-base">Categories</span>
    //             <ul className="grid grid-cols-1 gap-2">
    //               <li>
    //                 <LocalizedClientLink
    //                   href={`/categories/${c.handle}`}
    //                   data-testid="category-link"
    //                   className="hover:text-ui-fg-base"
    //                 >
    //                   {c.name}
    //                 </LocalizedClientLink>
    //               </li>
    //             </ul>
    //           </div>
    //         ))}
    //         {collections.slice(0, 6).map((c) => (
    //           <div key={c.id} className="flex flex-col gap-y-2">
    //             <span className="txt-small-plus txt-ui-fg-base">Collections</span>
    //             <ul className="grid grid-cols-1 gap-2 text-ui-fg-subtle txt-small">
    //               <li>
    //                 <LocalizedClientLink
    //                   href={`/collections/${c.handle}`}
    //                   className="hover:text-ui-fg-base"
    //                 >
    //                   {c.title}
    //                 </LocalizedClientLink>
    //               </li>
    //             </ul>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //     <div className="flex w-full mb-16 justify-between text-ui-fg-muted">
    //       <p className="txt-compact-small">
    //         © {new Date().getFullYear()} Medusa Store. All rights reserved.
    //       </p>
    //       <MedusaCTA />
    //     </div>
    //   </div>
    // </footer>
  )
}
