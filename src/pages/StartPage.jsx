// src/pages/StartPage.jsx
export default function StartPage() {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* 배경 그라데이션 (좌상단 → 우하단) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#eef4ff] via-[#cfe0ff] to-[#e9f0ff]" />

      {/* 중앙 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* 로고 + 타이틀 */}
        <div className="flex flex-col items-center mb-4">
          {/* 로고 (심볼) */}
          <svg
            width="84" height="84" viewBox="0 0 72 72"
            className="text-white/95 drop-shadow-sm"
            fill="currentColor" xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M36 12c-1.2 0-2.2.9-2.3 2.1-.6 6.6-3.6 12.1-8.9 16.7-2.7 2.3-4.9 5.1-6.4 8.3-1.5 3.2-2.3 6.6-2.3 10.2 0 1.3 1 2.4 2.4 2.4 1.2 0 2.1-.9 2.3-2.1.6-6.6 3.6-12.1 8.9-16.7 2.7-2.3 4.9-5.1 6.4-8.3 1.5-3.2 2.3-6.6 2.3-10.2 0-1.3-1-2.4-2.4-2.4Z" />
            <path d="M36 12c1.2 0 2.2.9 2.3 2.1.6 6.6 3.6 12.1 8.9 16.7 2.7 2.3 4.9 5.1 6.4 8.3 1.5 3.2 2.3 6.6 2.3 10.2 0 1.3-1 2.4-2.4 2.4-1.2 0-2.1-.9-2.3-2.1-.6-6.6-3.6-12.1-8.9-16.7-2.7-2.3-4.9-5.1-6.4-8.3-1.5-3.2-2.3-6.6-2.3-10.2 0-1.3 1-2.4 2.4-2.4Z" opacity=".55" />
          </svg>

          <h1 className="mt-2 text-[28px] font-semibold tracking-wide text-white drop-shadow-sm">
            MEARI
          </h1>
        </div>

        {/* 서브 카피 */}
        <p className="text-white/95 text-[15px] leading-7 max-w-[520px] mb-8 drop-shadow">
          세상의 소음 속에서 길을 잃은 당신에게,<br />
          <span className="font-medium">‘너는 혼자가 아니야’</span>라는 가장 선명한 메아리
        </p>

        {/* 시작하기 버튼 */}
        <button
          type="button"
          onClick={() => (window.location.href = "/login")} // 이동 경로 변경 가능
          className="rounded-full bg-white text-[#1e40af] font-semibold px-8 py-3
                     shadow-[0_8px_24px_rgba(30,64,175,0.25)]
                     hover:shadow-[0_12px_32px_rgba(30,64,175,0.32)]
                     transition focus:outline-none focus:ring-2 focus:ring-white/70"
        >
          시작하기
        </button>
      </div>

      {/* 하단 웨이브 라인 */}
      <svg
        className="pointer-events-none absolute bottom-[110px] left-[-8%] w-[120%] max-w-none text-[#5d8cff]"
        viewBox="0 0 1200 160" xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,100 C220,170 520,30 780,100 C960,150 1080,130 1200,70"
          stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"
        />
      </svg>

      {/* 종이비행기 (오른쪽 하단) */}
      <svg
        className="absolute right-[6%] bottom-[120px] w-[92px] text-[#4f83ff]"
        viewBox="0 0 64 64" fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M60 6 26 38l6 20 8-14 20-38Z" />
        <path d="M60 6 4 26l20 6" />
      </svg>
    </div>
  );
}
