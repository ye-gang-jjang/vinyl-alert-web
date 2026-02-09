"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        text-sm font-medium transition-colors
        ${
          isActive
            ? "text-gray-900 border-b-2 border-gray-900"
            : "text-gray-600 hover:text-gray-900"
        }
      `}
    >
      {label}
    </Link>
  );
}

export function Header() {
  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-5xl items-center gap-6 p-4">
        {/* 로고 + 서비스명 (Home) */}
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

        {/* 네비게이션 */}
        <div className="flex items-center gap-4">
          <NavLink href="/" label="Home" />
          <NavLink href="/contact" label="Contact" />
        </div>

        {/* 오른쪽 여백 */}
        <div className="ml-auto" />
      </nav>
    </header>
  );
}
