import type { Metadata } from "next"
import Link from "next/link"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/site/Footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Vinyl Alert",
  description: "LP release tracker",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Header / Navigation */}
        <header className="border-b">
          <nav className="mx-auto flex max-w-5xl gap-4 p-4 text-sm">
            <Link href="/" className="font-medium">
              Home
            </Link>
          </nav>
        </header>

        {/* Page Content */}
        <main className="mx-auto max-w-5xl p-4">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  )
}
