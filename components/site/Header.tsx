import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-5xl items-center gap-6 p-4">
        {/* 로고 + 서비스명 (Home 역할) */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg hover:opacity-90"
        >
          <Image
            src="/brand/logo.svg"
            alt="L Pick"
            width={28}
            height={28}
            priority
          />
          <span>L Pick</span>
        </Link>

        {/* 메인 네비게이션 */}
        <div className="flex items-center gap-4 text-sm font-medium text-gray-700">
          <Link
            href="/"
            className="hover:text-gray-900 transition-colors"
          >
            Home
          </Link>

          <Link
            href="/contact"
            className="hover:text-gray-900 transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* 오른쪽 여백 정렬용 */}
        <div className="ml-auto" />
      </nav>
    </header>
  );
}
