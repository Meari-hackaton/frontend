import { useNavigate } from "react-router-dom";

/* 아이콘 */
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
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M60 6 26 38l6 20 8-14 20-38Z" />
      <path d="M60 6 4 26l20 6" />
    </svg>
  );
}

/* 유리감 버튼 */
function GlassButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={
        "w-[320px] sm:w-[360px] py-6 rounded-[28px] bg-white/75 text-blue-700 font-semibold " +
        "shadow-[0_18px_40px_rgba(30,64,175,.18),inset_0_2px_0_rgba(255,255,255,.9)] " +
        "hover:bg-white/90 transition " +
        className
      }
    >
      {children}
    </button>
  );
}

export default function EchoLanding() {
  const navigate = useNavigate();

const go = (step) => {
  navigate(`/cards?step=${step}`);   // ✅ 쿼리스트링으로 전달 (새로고침에도 유지)
};
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 배경 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f3f7ff] via-[#dbe7ff] to-[#eef4ff]" />

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-24">
        {/* 타이틀 */}
        <header className="text-center mb-12">
          <h1 className="text-[28px] sm:text-[36px] font-extrabold text-[#4b2d19]">
            “메아리가 도착했어요!”
          </h1>
          <p className="text-slate-600 mt-3">
            하나씩 선택해 세상의 메아리를 들어보세요.
          </p>
        </header>

        {/* 3열 섹션 */}
        <section className="grid gap-10 lg:grid-cols-3">
          {/* 공감 */}
          <div className="flex flex-col items-center text-center">
            <PlaneIcon className="text-[#5d8cff] w-10 h-10 mb-4" />
            <p className="text-[#4b2d19] font-medium leading-snug mb-6">
              나와 비슷한 사람들을 <br /> 찾고싶다면?
            </p>
            <GlassButton onClick={() => go(1)}>공감의 메아리</GlassButton>
          </div>

          {/* 성찰 */}
          <div className="flex flex-col items-center text-center">
            <PlaneIcon className="text-[#5d8cff] w-10 h-10 mb-4" />
            <p className="text-[#4b2d19] font-medium leading-snug mb-6">
              나 혼자만의 문제가 <br /> 아닐 수 있다고?
            </p>
            <GlassButton onClick={() => go(2)}>성찰의 메아리</GlassButton>
          </div>

          {/* 성장 */}
          <div className="flex flex-col items-center text-center">
            <PlaneIcon className="text-[#5d8cff] w-10 h-10 mb-4" />
            <p className="text-[#4b2d19] font-medium leading-snug mb-6">
              세상으로 한 발짝 <br /> 나아가 볼까?
            </p>
            <GlassButton onClick={() => go(3)}>성장의 메아리</GlassButton>
          </div>
        </section>
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
