import Link from "next/link"

type Props = {
  pathname: string
  page: number
  totalPages: number
  params?: Record<string, string>
}

function buildHref(pathname: string, page: number, params: Record<string, string>) {
  const query = new URLSearchParams(params)

  if (page > 1) {
    query.set("page", String(page))
  } else {
    query.delete("page")
  }

  const queryString = query.toString()
  return queryString ? `${pathname}?${queryString}` : pathname
}

export function PaginationNav({ pathname, page, totalPages, params = {} }: Props) {
  if (totalPages <= 1) {
    return null
  }

  const prevHref = buildHref(pathname, page - 1, params)
  const nextHref = buildHref(pathname, page + 1, params)

  return (
    <nav className="flex items-center justify-center gap-3 pt-2" aria-label="페이지 이동">
      <Link
        href={prevHref}
        aria-disabled={page <= 1}
        className={
          page <= 1
            ? "pointer-events-none rounded-lg border px-4 py-2 text-sm text-gray-400"
            : "rounded-lg border px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
        }
      >
        이전
      </Link>

      <span className="text-sm text-gray-600">
        {page} / {totalPages}
      </span>

      <Link
        href={nextHref}
        aria-disabled={page >= totalPages}
        className={
          page >= totalPages
            ? "pointer-events-none rounded-lg border px-4 py-2 text-sm text-gray-400"
            : "rounded-lg border px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
        }
      >
        다음
      </Link>
    </nav>
  )
}
