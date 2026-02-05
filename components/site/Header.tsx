import Link from "next/link"
import { SITE_NAME } from "@/components/site/constants"

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg border bg-gray-50" aria-hidden />
          <span className="text-base font-semibold">{SITE_NAME}</span>
        </Link>

        {/* Nav (이제 좌측에 붙음) */}
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" className="rounded-md px-2 py-1 hover:bg-gray-50">
            Home
          </Link>
        </nav>
      </div>
    </header>
  )
}
