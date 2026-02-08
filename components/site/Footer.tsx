import { SITE_NAME, TAGLINE } from "@/components/site/constants"

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "lpick.contact@gmail.com"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="space-y-2">
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

          <div className="pt-2 text-xs text-gray-500">
            © {year} {SITE_NAME}
          </div>
        </div>
      </div>
    </footer>
  )
}
