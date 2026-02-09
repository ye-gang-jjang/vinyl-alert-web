import { SITE_NAME, TAGLINE } from "@/components/site/constants"
import { Instagram } from "lucide-react"

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "lpick.contact@gmail.com"

const INSTAGRAM_URL = "https://www.instagram.com/너의아이디/"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t">
      <div className="mx-auto max-w-5xl px-4 py-3">
        <div className="space-y-1">
          <div className="text-sm font-semibold">{SITE_NAME}</div>
          <p className="text-sm text-gray-600">{TAGLINE}</p>

          <p className="text-sm text-gray-600">
            Contact:{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-gray-900 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-gray-500 hover:text-gray-700 hover:underline"
          >
            Instagram
          </a>

          <div className="pt-1 text-xs text-gray-500">
            © {year} {SITE_NAME}
          </div>
        </div>
      </div>
    </footer>
  )
}
