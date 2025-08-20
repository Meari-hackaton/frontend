import { useState } from "react";

export default function Signup() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return;
    setLoading(true);
    try {
      // TODO: 회원가입 API 연동
      alert("회원가입 요청 전송 (API 연동 지점)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden antialiased">
      {/* 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#eef5ff] via-[#e8f1ff] to-[#dbeaff]" />
      <div className="absolute inset-0 bg-[radial-gradient(1100px_700px_at_50%_33%,rgba(147,197,253,0.45),transparent_60%)]" />

      {/* 메인 컨텐츠 */}
      <main className="relative z-10 mx-auto flex w-full max-w-[520px] flex-col items-center pt-[96px] md:pt-[112px] pb-28 text-center">
        {/* 로고 */}
        <div className="mb-4 text-[#6aa1ff]">
          <Logo className="h-16 w-16" />
        </div>
        <div className="text-white font-semibold tracking-[0.28em] text-[18px] drop-shadow-sm">MEARI</div>

        {/* 카피 */}
        <p className="mt-7 text-[13px] leading-[22px] text-white/90 drop-shadow-sm">
          세상의 소음 속에서 길을 잃은 당신에게, <br />
          ‘너는 혼자가 아니야’라는 가장 선명한 메아리
        </p>

        {/* 폼 */}
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="sr-only" htmlFor="username">아이디</label>
          <div className="mx-auto h-[44px] w-[360px] rounded-full border border-[#cfe0ff] bg-white/70 shadow-[0_12px_26px_rgba(82,127,255,0.15)] backdrop-blur">
            <div className="flex h-full items-center">
              <span className="pl-4 pr-3 text-[12px] text-[#88a6e2] select-none">|</span>
              <input
                id="username"
                name="username"
                value={form.username}
                onChange={onChange}
                placeholder="아이디"
                className="w-full bg-transparent pr-4 text-[13px] text-slate-700 placeholder:text-[#a9bfe9] focus:outline-none"
              />
            </div>
          </div>

          <label className="sr-only" htmlFor="password">비밀번호</label>
          <div className="mx-auto h-[44px] w-[360px] rounded-full border border-[#cfe0ff] bg-white/70 shadow-[0_12px_26px_rgba(82,127,255,0.15)] backdrop-blur">
            <div className="flex h-full items-center">
              <span className="pl-4 pr-3 text-[12px] text-[#88a6e2] select-none">|</span>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="비밀번호"
                className="w-full bg-transparent pr-4 text-[13px] text-slate-700 placeholder:text-[#a9bfe9] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mx-auto mt-1 block w-[240px] rounded-full border border-[#cae0ff] bg-white py-3 text-[14px] font-semibold text-[#3b82f6] shadow-[0_16px_34px_rgba(59,130,246,0.25)] hover:brightness-105 disabled:opacity-60"
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>
      </main>

      {/* 하단 물결 + 종이비행기 */}
      <footer className="pointer-events-none absolute left-0 right-0 bottom-20">
        <svg viewBox="0 0 1000 200" className="h-[160px] w-full" fill="none">
          <path
            d="M0 140 C180 60, 360 220, 540 140 S 900 60, 1000 140"
            stroke="rgba(74,124,255,0.5)" strokeWidth="2.4" fill="none"
          />
          {/* 종이비행기를 물결 끝 부분 가까이에 배치 */}
          <g transform="translate(980,138) rotate(-5)" stroke="rgba(74,124,255,0.95)" className="animate-plane">
            <path d="M0 0 L60 20 L0 40 L12 26 L12 14 Z" fill="white" strokeWidth="1.8" />
            <path d="M12 14 L50 20 L12 26" strokeWidth="1.8" />
          </g>
        </svg>
      </footer>

      <style jsx>{`
        @keyframes floaty { 0% { transform: translateY(0px) } 50% { transform: translateY(-5px) } 100% { transform: translateY(0px) } }
        .animate-plane { animation: floaty 3.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function Logo({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M12 3l3.9 5.9L12 12l-3.9-3.1L12 3z" stroke="currentColor" strokeWidth="1.1" />
      <path d="M8.2 12.2L12 21l3.8-8.8" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
