import { getBaseURL } from "@lib/util/env"
import { Metadata, Viewport } from "next"
import "styles/globals.css"
import localFont from "next/font/local"
import ReactQueryProvider from "@lib/context/react-query-context"
import { CustomerProvider } from "@lib/context/customer-context"
import { SidebarProvider } from "@lib/components/ui/sidebar"
export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}
const iranYekan = localFont({
  src: "../../public/fonts/IRANYekanWebMedium.woff",
  variable: "--font-iranyekan", // یک متغیر اختصاصی و معنا‌دار
  display: "swap", // Best practice برای جلوگیری از ناپدید شدن متن در زمان لود
})

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" data-mode="light" className={iranYekan.variable}>
      <body className="font-sans antialiased">
        <SidebarProvider defaultOpen={false}>
          <ReactQueryProvider>
            <CustomerProvider>{props.children}</CustomerProvider>
          </ReactQueryProvider>
        </SidebarProvider>
      </body>
    </html>
  )
}
