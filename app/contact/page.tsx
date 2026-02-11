import Link from "next/link";

export const metadata = {
  title: "Contact | L Pick",
  description:
    "L Pick 문의/제보 및 프로젝트 방향성, 향후 계획, 후원 안내 페이지",
};

export default function ContactPage() {
  const contactEmail = "lpick.contact@gmail.com"; // 필요하면 나중에 env로 빼도 됨

  return (
    <div className="space-y-8">
      {/* 상단 헤더 */}
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">L Pick</h1>
        <p className="text-sm text-gray-600">
          L Pick은 LP 발매·판매처 정보를 모아 더 빠르게 찾을 수 있도록 돕는
          개인 프로젝트입니다.
        </p>
      </header>

      {/* 1) 방향성 */}
      <section className="rounded-xl border bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold">방향성</h2>
        <p className="text-sm text-gray-700 leading-6">
          L Pick은 흩어져 있는 LP 발매·판매 정보를 한 곳에 정리해, 원하는
          바이닐을 더 빠르고 정확하게 찾을 수 있도록 만드는 서비스입니다.
          <br />
          국내 인디, 저의 취향에 맞는 가수 위주의 앨범들이 올라올 것 같아요. (요청에 따라 추가할 생각은 있습니다.)
          <br />
          국내 바이닐 시장이 커졌으면 하는 바램으로 시작한 프로젝트이고, 바이닐에 입문하는 사람들의 시작점이 되길 바랍니다.
        </p>
      </section>

      {/* 2) 앞으로의 계획 */}
      <section className="rounded-xl border bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold">앞으로의 계획</h2>

        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="mt-[2px]">•</span>
            <span>릴리즈/판매처 데이터 지속 확장 (대형 샵들 위주로 자동화가 목표입니다.)</span>
          </li>

          <li className="flex gap-2">
            <span className="mt-[2px]">•</span>
            <span>
              관심 릴리즈 알림 / 즐겨찾기 기능
            </span>
          </li>

          <li className="flex gap-2">
            <span className="mt-[2px]">•</span>
            <span>오프라인 레코드샵 지도 (고민중에 있습니다.)</span>
          </li>
        </ul>

        <p className="text-xs text-gray-500">
          * 일정은 운영 상황에 따라 변경될 수 있습니다.
        </p>
      </section>

      {/* 3) 문의 / 제보 */}
      <section className="rounded-xl border bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold">문의 / 제보 방법</h2>

        <div className="space-y-2">
          <p className="text-sm text-gray-700 leading-6">
            오류 제보, 판매처 추가 요청, 정보 수정 제안 모두 환영합니다.
            아래 이메일로 보내주세요.
          </p>

          <a
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
            href={`mailto:${contactEmail}?subject=${encodeURIComponent(
              "[L Pick] 문의/제보"
            )}`}
          >
            {contactEmail}
            <span aria-hidden>↗</span>
          </a>
        </div>

        <div className="rounded-xl border bg-gray-50 p-4 space-y-2">
          <p className="text-sm font-medium text-gray-900">
            보내주시면 도움이 되는 정보
          </p>
          <ul className="space-y-1 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="mt-[2px]">•</span>
              <span>문제가 발생한 페이지 URL</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-[2px]">•</span>
              <span>판매처 링크(가능하면)</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-[2px]">•</span>
              <span>수정/추가가 필요한 내용(가격/상태/상품명 등)</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-[2px]">•</span>
              <span>새로운 아이디어나 그외 문의도 모두 환영합니다</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 하단 네비 (선택) */}
      <footer className="pt-2">
        <Link href="/" className="text-sm text-gray-600 hover:underline">
          ← Home으로 돌아가기
        </Link>
      </footer>
    </div>
  );
}
