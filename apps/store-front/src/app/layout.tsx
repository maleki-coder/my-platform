import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import localFont from "next/font/local"
import ReactQueryProvider from "@lib/context/react-query-context"
import { CustomerProvider } from "@lib/context/customer-context"
import { SidebarProvider } from "@lib/components/ui/sidebar"
import { DeviceDetector } from "@lib/util/client-device-detector"
export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}
const myFont = localFont({
  src: "../../public/fonts/IRANYekanWebMedium.woff",
  variable: "--font-inter",
})

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" data-mode="light">
      <body className={myFont.className}>
        <DeviceDetector />
        <SidebarProvider defaultOpen={false}>
          <ReactQueryProvider>
            <CustomerProvider>{props.children}</CustomerProvider>
          </ReactQueryProvider>
        </SidebarProvider>
      </body>
    </html>
  )
}
