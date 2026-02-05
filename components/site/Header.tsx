import Link from "next/link"
import { SITE_NAME, TAGLINE } from "@/components/site/constants"

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        {/* Brand */}
        <div className="min-w-0">
          <Link href="/" className="block text-base font-semibold">
            {SITE_NAME}
          </Link>
          <p className="mt-1 hidden text-xs text-gray-600 sm:block">
            {TAGLINE}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/" className="rounded-md px-2 py-1 hover:bg-gray-50">
            Home
          </Link>
        </nav>
      </div>
    </header>
  )
}
