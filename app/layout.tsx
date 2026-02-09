import type { Metadata } from "next"
import Script from "next/script"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  title: "L Pick | 원하는 LP를 한눈에",
  description:
    "LP 발매·판매처 정보를 모아 내가 원하는 레코드를 빠르게 찾을 수 있는 서비스",
  verification: {
    google: "p8orPfs8ylwY0IyA2L_rFz3uvyp7UDZCYdUl9Mjj-rA"
  },
  openGraph: {
    title: "L Pick",
    description: "LP 발매·판매처 정보를 한눈에. 내가 원하는 LP를 픽하다.",
    url: "https://www.lpick.shop",
    siteName: "L Pick",
    locale: "ko_KR",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        {GA_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        ) : null}
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh flex flex-col`}
      >
        <Header />

        <main className="mx-auto w-full max-w-5xl flex-1 p-4">{children}</main>

        <Footer />
      </body>
    </html>
  )
}
