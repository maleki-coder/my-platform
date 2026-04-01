import { getFooterData } from "@lib/data/footer"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ScrollToTopButton from "@modules/common/components/scroll-to-top-button"

// پراپ‌ها حذف شدند، این کامپوننت فقط مسئول دریافت داده و رندر UI پایه است
export default async function Footer() {
  // دریافت داده‌ها از سرور اکشن
  const footerData = await getFooterData()
  // مدیریت حالت قطعی بک‌اند (Fallback)
  if (!footerData) {
    return (
      <footer className="m-4 lg:mt-12 mt-6 overflow-hidden rounded-2xl bg-[#1b3570] p-8 text-white text-center">
        <p>در حال بروزرسانی اطلاعات سایت...</p>
      </footer>
    )
  }

  const { data } = footerData

  return (
    <footer className="mt-4 left-0 right-0 overflow-hidden rounded-2xl bg-linear-to-r from-[#0079b1] to-[#1b3570]">
      <div className="px-4 mx-auto w-full lg:px-8 xl:px-6 max-w-screen-2xl">
        <div className="px-4">
          {/* بخش هدر فوتر و دکمه بازگشت به بالا */}
          <div className="flex w-full justify-between items-center pt-16 lg:pt-20 pb-8">
            <Image
              src="https://www.technolife.com/image/static_logo_techno_new.svg"
              alt={""}
              width={120}
              height={120}
              className="bg-white h-fit"
            />
            <div className="flex items-center h-12.5 md:w-45 w-32.5">
              <ScrollToTopButton />
            </div>
          </div>

          {/* بخش ۱: ستون‌های لینک */}
          <div className="border-t border-white/20 pt-8 pb-10 text-white">
            <div className="hidden md:grid grid-cols-3 gap-8">
              {data.columns?.map((col, index) => (
                <div key={index} className="flex flex-col">
                  <h3 className="text-lg font-bold mb-6">{col.title}</h3>
                  <ul className="flex flex-col gap-3">
                    {col.links?.map((link, idx) => (
                      <li key={idx}>
                        <Link
                          href={link.url}
                          className="text-sm hover:text-white/80 transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:hidden gap-4">
              {data.columns?.map((col, index) => (
                <details
                  key={index}
                  className="group border-b border-white/10 pb-4"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none text-base font-medium">
                    {col.title}
                    <ChevronDown className="w-5 h-5 transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <ul className="flex flex-col gap-3 pt-4 pr-2">
                    {col.links?.map((link, idx) => (
                      <li key={idx}>
                        <Link href={link.url} className="text-sm text-white/90">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>

          {/* بخش ۲: اطلاعات تماس با ما */}
          <div className="border-t border-white/20 pt-10 pb-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="flex flex-col gap-4">
                <p className="text-lg font-medium">ارتباط با ما</p>
                {data.contactList.map((contact, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap gap-2 items-center"
                  >
                    <span className="text-sm font-medium">ایمیل:</span>
                    <a
                      href={`mailto:${contact.email}`}
                      dir="ltr"
                      className="text-sm hover:underline"
                    >
                      {contact.email}
                    </a>
                  </div>
                ))}
                {data.contactList.map((contact, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap gap-2 items-center"
                  >
                    <span className="text-sm font-medium">شماره تماس:</span>
                    <span className="text-sm hover:underline">
                      {contact.phone}
                    </span>
                  </div>
                ))}
              </div>

              {data.socials?.length > 0 && (
                <div className="flex flex-col gap-4 items-start">
                  <p className="text-lg font-medium">شبکه‌های اجتماعی</p>
                  <div className="flex gap-4">
                    {data.socials.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="hover:opacity-80 transition-opacity"
                        aria-label={social.platform}
                      >
                        <Image
                          src={social.image.url}
                          alt={social.image.alternativeText}
                          width={16}
                          height={16}
                          className="w-8 h-8 lg:w-4 lg:h-4"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* بخش ۳: گواهینامه‌ها */}
          {data.certificates && data.certificates.length > 0 && (
            <div className="border-t border-white/20 pt-8 pb-12 flex flex-col items-center md:items-end gap-4">
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {data.certificates.map((cert, index) => (
                  <Image
                    key={index}
                    src={cert.image.url!}
                    alt={cert.image.alternativeText}
                    width={80}
                    height={80}
                    className="object-contain w-full h-full"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
