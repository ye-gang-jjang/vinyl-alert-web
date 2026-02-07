import Image from "next/image"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-5xl items-center gap-4 p-4">
        {/* 로고 + 서비스명 */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Image
            src="/brand/logo.svg"
            alt="L Pick"
            width={28}
            height={28}
            priority
          />
          <span>L Pick</span>
        </Link>

        {/* 오른쪽 영역(비워둠) */}
        <div className="ml-auto" />
      </nav>
    </header>
  )
}
