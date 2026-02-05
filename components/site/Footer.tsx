import Link from "next/link"

const SITE_NAME = "Vinyl Alert"
const TAGLINE = "최근 수집된 LP 판매처 정보를 모아봅니다."
const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "yeggang0602@gmail.com"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-10 border-t">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Left */}
          <div className="space-y-2">
            <div className="text-sm font-semibold">{SITE_NAME}</div>
            <p className="text-sm text-gray-600">{TAGLINE}</p>

            <p className="text-sm text-gray-600">
              피드백:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-gray-900 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-2 text-sm text-gray-600 sm:items-end">
            {/* 필요하면 나중에 링크만 살리면 됨 */}
            <div className="flex gap-4">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              {/* <Link href="/about" className="hover:underline">About</Link> */}
              {/* <Link href="/privacy" className="hover:underline">Privacy</Link> */}
            </div>

            <div className="text-xs text-gray-500">© {year} {SITE_NAME}</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
