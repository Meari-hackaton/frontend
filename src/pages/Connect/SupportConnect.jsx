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

export default function SupportConnect() {
  const nav = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f3f7ff] via-[#dbe7ff] to-[#eef4ff]" />

      <button
        onClick={() => nav(-1)}
        className="absolute left-6 top-6 z-20 text-blue-600 flex items-center gap-2"
      >
        <span className="text-lg">←</span> Back
      </button>

      <header className="relative z-10 text-center pt-24">
        <div className="text-blue-500 mb-3">지원 연결</div>
        <h1 className="text-[28px] sm:text-[36px] font-extrabold text-[#4b2d19]">
          “작은 걸음으로 큰 변화를 만들어가요”
        </h1>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-10 pb-24">
        <div className="mx-auto w-full rounded-[28px] bg-white shadow-[0_18px_50px_rgba(30,64,175,.18)]
                        border border-white/70 px-8 sm:px-12 py-10 text-center">
          <PlaneIcon className="text-[#5d8cff] w-12 h-12 mx-auto -mt-14 mb-6" />

          <div className="text-blue-900/80 text-sm mb-2">나를 위한 정책</div>

          <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#4b2d19] leading-snug mb-6">
            청년 마음건강 바우처
          </h2>

          <div className="text-left text-[15px] text-[#5a4639] leading-relaxed space-y-2">
            <p>지원 내용: 월 4회 심리 상담 비용 지원</p>
            <p>신청 방법: 청년정책포털에서 ‘마음건강 바우처’ 검색</p>
            <p>자격 요건: 만 19~34세, 거주지 청년</p>
            <p>신청 마감: 8월 25일 (일)</p>
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
