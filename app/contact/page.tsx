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
        <h1 className="text-2xl font-bold">문의 / 제보</h1>
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
          레코드를 더 빠르고 정확하게 찾을 수 있도록 만드는 서비스입니다.
          <br />
          MVP 단계에서는 과한 기능보다 <span className="font-medium">정확한 정보 제공</span>과{" "}
          <span className="font-medium">안정적인 사용 경험</span>을 우선합니다.
        </p>
      </section>

      {/* 2) 앞으로의 계획 */}
      <section className="rounded-xl border bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold">앞으로의 계획</h2>

        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="mt-[2px]">•</span>
            <span>릴리즈/판매처 데이터 지속 확장</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-[2px]">•</span>
            <span>가격/상태(예약·판매중·품절) 업데이트 품질 개선</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-[2px]">•</span>
            <span>아티스트/레이블 단위 탐색 UX 고도화</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-[2px]">•</span>
            <span>
              (검토) 관심 릴리즈 알림 / 즐겨찾기 기능
            </span>
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
          </ul>
        </div>
      </section>

      {/* 4) 후원 */}
      <section className="rounded-xl border bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold">후원하기</h2>

        <p className="text-sm text-gray-700 leading-6">
          L Pick은 개인이 운영하는 프로젝트입니다. 서비스 유지 비용(도메인/서버)
          및 운영 시간을 응원하고 싶다면 후원으로 함께해 주세요.
          <br />
          <span className="text-gray-500">
            후원 여부는 서비스 이용과 무관하며, 선택 사항입니다.
          </span>
        </p>

        {/* 계좌/링크는 일단 placeholder. 실제 값 정해지면 교체 */}
        <div className="rounded-xl border bg-gray-50 p-4 space-y-2">
          <p className="text-sm font-medium text-gray-900">후원 방법</p>

          <div className="text-sm text-gray-700 space-y-1">
            <div>
              <span className="text-gray-500">계좌</span>{" "}
              <span className="font-medium">추후 안내</span>
            </div>
            <div>
              <span className="text-gray-500">링크</span>{" "}
              <span className="font-medium">추후 안내</span>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            * 후원 정보를 공개하기 전까지는 “추후 안내”로 두는 것을 권장합니다.
          </p>
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
