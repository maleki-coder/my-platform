import { getBaseURL } from "@lib/util/env"
import { Metadata, Viewport } from "next"
import "styles/globals.css"
import localFont from "next/font/local"
import ReactQueryProvider from "@lib/context/react-query-context"
import { CustomerProvider } from "@lib/context/customer-context"
import { SidebarProvider } from "@lib/components/ui/sidebar"
import { Inter } from 'next/font/google';
export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
const vaziri = localFont({
  src: "../../public/fonts/Vazir-FD-WOL.ttf",
  variable: "--font-iranyekan",
  display: "swap"
})

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" data-mode="light" className={`${vaziri.variable} ${inter.variable}`}>
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
