import React from "react";

/** MEARI – Greeting(인사) 페이지 – 버튼 그라데이션 + 비행기 물결 끝 배치 */
export default function GreetingPage({ onStart, onHistory }) {
  return (
    <div className="relative min-h-screen overflow-hidden antialiased">
      {/* 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#eef5ff] via-[#e9f1ff] to-[#d8e7ff]" />
      <div className="absolute inset-0 bg-[radial-gradient(1200px_780px_at_60%_36%,rgba(147,197,253,0.45),transparent_60%)]" />

      {/* 중앙 정렬 영역 */}
      <section className="relative z-10 grid min-h-[60vh] place-items-center px-4 pt-10 text-center">
        <div className="w-full max-w-[920px] mx-auto">
          <h1 className="text-[22px] md:text-[26px] leading-[36px] md:leading-[40px] font-semibold text-[#7a4a2b]">
            “ 다시 만나서 반가워요! 지난번엔
            <br className="hidden md:block" />
            ‘취업 문제’로 힘들어하셨는데, 오늘은 좀 어떠신가요? ”
          </h1>

          {/* 버튼 두 개: 파란색 그라데이션 */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              onClick={onHistory}
              className="w-[430px] max-w-[88vw] rounded-full bg-gradient-to-r from-[#d8e7ff] via-[#edf4ff] to-[#d8e7ff] px-6 py-3 text-[14px] font-medium text-[#497BFF] shadow-[0_10px_28px_rgba(82,127,255,0.25)] hover:brightness-105 active:translate-y-[1px]"
            >
              비슷해요, 오늘의 리추얼을 받을래요
            </button>
            <button
              onClick={onStart}
              className="w-[430px] max-w-[88vw] rounded-full bg-gradient-to-r from-[#d8e7ff] via-[#edf4ff] to-[#d8e7ff] px-6 py-3 text-[14px] font-medium text-[#497BFF] shadow-[0_10px_28px_rgba(82,127,255,0.25)] hover:brightness-105 active:translate-y-[1px]"
            >
              괜찮아요, 새로운 이야기를 시작할래요
            </button>
          </div>
        </div>
      </section>

      {/* 하단 물결 + 종이비행기 */}
      <footer className="pointer-events-none absolute inset-x-0 bottom-12">
        <svg viewBox="0 0 1100 220" className="h-[170px] w-full" fill="none">
          <path
            d="M-20 170 C 140 120, 260 200, 380 170 S 640 120, 820 170 S 980 190, 1040 150"
            stroke="rgba(255,255,255,0.98)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 종이비행기: 물결 끝부분에 도착 + 곡률에 맞춰 기울임 */}
          <g transform="translate(1040,115) rotate(-20)" stroke="rgba(74,124,255,0.95)">
            <path d="M0 0 L90 20 L0 60 L12 26 L12 14 Z" fill="white" strokeWidth="2" />
            <path d="M12 14 L50 20 L12 26" strokeWidth="2" />
          </g>
        </svg>
      </footer>
    </div>
  );
}

function Logo({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-label="MEARI logo">
      <path d="M12 3l3.9 5.9L12 12l-3.9-3.1L12 3z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8.2 12.2L12 21l3.8-8.8" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
