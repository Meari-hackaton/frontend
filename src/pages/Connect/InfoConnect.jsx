import { useNavigate } from "react-router-dom";

function PlaneIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M60 6 26 38l6 20 8-14 20-38Z" />
      <path d="M60 6 4 26l20 6" />
    </svg>
  );
}

export default function InfoConnect() {
  const nav = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 배경 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f3f7ff] via-[#dbe7ff] to-[#eef4ff]" />

      {/* Back */}
      <button
        onClick={() => nav(-1)}
        className="absolute left-6 top-6 z-20 text-blue-600 flex items-center gap-2"
      >
        <span className="text-lg">←</span> Back
      </button>

      {/* 헤더 */}
      <header className="relative z-10 text-center pt-24">
        <div className="text-blue-500 mb-3">정보 연결</div>
        <h1 className="text-[28px] sm:text-[36px] font-extrabold text-[#4b2d19]">
          “새로운 기회를 잡아보세요”
        </h1>
      </header>

      {/* 카드 */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-10 pb-24">
        <div className="mx-auto w-full rounded-[28px] bg-white shadow-[0_18px_50px_rgba(30,64,175,.18)]
                        border border-white/70 px-8 sm:px-12 py-10 text-center">
          <PlaneIcon className="text-[#5d8cff] w-12 h-12 mx-auto -mt-14 mb-4" />

          <div className="text-blue-900/80 text-sm mb-2">최신 검색 결과</div>

          <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#4b2d19] leading-snug mb-6">
            시청에서 ‘청년 창업<br className="sm:hidden" /> 아이디어 피칭데이’ 개최
          </h2>

          <div className="text-left text-[15px] text-[#5a4639] leading-relaxed space-y-2">
            <p>참가 혜택: 우수 아이디어 5팀에 사업화 지원금 500만 원</p>
            <p>행동 제안: 오늘 안에 신청서 작성 후 온라인 접수</p>
            <p>행사 일시: 8월 10일(토) 14:00</p>
          </div>

          <div className="mt-10">
            <a
              href="https://example.com"
              target="_blank"
              rel="noreferrer"
              className="inline-block w-[320px] sm:w-[360px] py-4 rounded-full bg-[#5b86ff]
                         text-white font-semibold tracking-wide text-center
                         shadow-[0_14px_32px_rgba(70,100,255,.28)] hover:brightness-110 transition"
            >
              바로가기
            </a>
          </div>
        </div>
      </main>

      {/* 하단 웨이브 */}
      <svg
        className="absolute bottom-[-8px] left-[-6%] w-[112%] max-w-none text-[#6da0ff]"
        viewBox="0 0 1200 180"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,120 C220,180 520,40 780,120 C960,170 1080,150 1200,90"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
