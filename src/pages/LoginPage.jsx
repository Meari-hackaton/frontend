// src/pages/LoginPage.jsx
// Tailwind 기반, 로고/종이비행기/웨이브 모두 SVG 내장
export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#eef4ff] via-[#cfe0ff] to-[#e9f0ff]" />

      {/* 중앙 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* 로고 + 타이틀 */}
        <div className="flex flex-col items-center mb-6">
          {/* 로고 SVG */}
          <svg
            width="72"
            height="72"
            viewBox="0 0 72 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-3 text-[#3b82f6]"
          >
            <path d="M36 12c-1.2 0-2.2.9-2.3 2.1-.6 6.6-3.6 12.1-8.9 16.7-2.7 2.3-4.9 5.1-6.4 8.3-1.5 3.2-2.3 6.6-2.3 10.2 0 1.3 1 2.4 2.4 2.4 1.2 0 2.1-.9 2.3-2.1.6-6.6 3.6-12.1 8.9-16.7 2.7-2.3 4.9-5.1 6.4-8.3 1.5-3.2 2.3-6.6 2.3-10.2 0-1.3-1-2.4-2.4-2.4Z" fill="currentColor" />
            <path d="M36 12c1.2 0 2.2.9 2.3 2.1.6 6.6 3.6 12.1 8.9 16.7 2.7 2.3 4.9 5.1 6.4 8.3 1.5 3.2 2.3 6.6 2.3 10.2 0 1.3-1 2.4-2.4 2.4-1.2 0-2.1-.9-2.3-2.1-.6-6.6-3.6-12.1-8.9-16.7-2.7-2.3-4.9-5.1-6.4-8.3-1.5-3.2-2.3-6.6-2.3-10.2 0-1.3 1-2.4 2.4-2.4Z" fill="currentColor" opacity=".65" />
            <circle cx="36" cy="50" r="3" fill="currentColor" />
          </svg>

          <h1 className="text-[28px] font-semibold tracking-wide text-white drop-shadow-sm">
            MEARI
          </h1>
        </div>

        {/* 서브 카피 */}
        <p className="text-white/90 text-[14px] leading-6 max-w-[420px] mb-8 drop-shadow">
          세상의 소음 속에서 길을 잃은 당신에게,<br />
          <span className="font-medium">‘너는 혼자가 아니야’</span>라는 가장 선명한 메아리
        </p>

        {/* 구글로 시작하기 버튼 */}
        <button
          type="button"
          className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 shadow-[0_6px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.16)] transition"
          onClick={() => (window.location.href = "/")} // 필요 시 /login 처리 또는 핸들러 교체
        >
          {/* G 아이콘 형태 */}
          <span className="inline-grid place-items-center w-5 h-5 rounded-full border">
            <span className="text-[12px] font-bold">G</span>
          </span>
          <span className="text-[14px] text-slate-700">구글로 시작하기</span>
        </button>
      </div>

      {/* 하단 곡선 라인 */}
      <svg
        className="pointer-events-none absolute bottom-20 left-[-10%] w-[120%] max-w-none text-[#66a1ff]"
        viewBox="0 0 1200 140"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,90 C200,160 520,10 760,90 C920,144 1080,120 1200,60"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* 종이비행기 아이콘 (오른쪽 하단) */}
      <svg
        className="absolute right-[6%] bottom-[120px] w-[80px] text-[#5d97ff]"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M60 6 26 38l6 20 8-14 20-38Z" />
        <path d="M60 6 4 26l20 6" />
      </svg>
    </div>
  );
}
