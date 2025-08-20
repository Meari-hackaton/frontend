import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ====== (컴포넌트 밖) 고정 상수 ====== */
/** 스텝별 웨이브 경로 (viewBox: 0 0 1200 160) */
const PATHS = {
  1: "M0,120 C180,180 380,120 520,140 C680,165 840,160 1200,110", // 왼쪽 진입
  2: "M0,110 C180,170 420,60 720,120 C900,160 1080,140 1200,90",   // 중앙 파고
  3: "M0,130 C220,170 520,100 780,140 C980,200 1100,180 1200,120", // 오른쪽 마무리
};
/** 스텝별 비행기 위치 비율(앞/중/끝 느낌) */
const T_BY_STEP = { 1: 0.22, 2: 0.58, 3: 0.9 };

/* ===== 작은 UI ===== */
function Pill({ children }) {
  return (
    <span className="px-3 py-1 rounded-full text-xs bg-white/60 text-blue-700 border border-white/70 shadow-sm">
      #{children}
    </span>
  );
}

function GlassButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-[320px] sm:w-[380px] py-4 rounded-full bg-white/70
                 text-blue-700 font-semibold tracking-wide
                 shadow-[0_10px_30px_rgba(30,64,175,.18),inset_0_2px_0_rgba(255,255,255,.9)]
                 hover:bg-white/85 transition"
    >
      {children}
    </button>
  );
}

/* ===== 공통 레이아웃 ===== */
function StepLayout({ stepText, chips = [], title, subtitle, children, onBack, hideBack, below }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#eef4ff] via-[#cfe0ff] to-[#e9f0ff]" />

      {/* Back (좌상단 고정) */}
      {!hideBack && (
        <div className="absolute left-6 top-6 z-20">
          <button onClick={onBack} className="text-blue-600 flex items-center gap-1">
            ← Back
          </button>
        </div>
      )}

      {/* 본문 */}
      <div className="relative z-10 w-full px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-blue-600 text-sm mb-4">Step page&nbsp;&nbsp;{stepText}</div>

          {chips.length > 0 && (
            <div className="mb-3 flex items-center justify-center gap-2 flex-wrap">
              {chips.map((c, i) => (
                <Pill key={i}>{c}</Pill>
              ))}
            </div>
          )}

          <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#54341d] tracking-tight mb-2">
            {title}
          </h1>
          {subtitle && <p className="text-slate-600 mb-10">{subtitle}</p>}

          {children}
        </div>
      </div>

      {/* 하단 SVG(웨이브+비행기) */}
      {below}
    </div>
  );
}

/* ===== 메인: 스텝 위저드 ===== */
export default function StepsWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({ category: null, detail: null });

  const categories = ["진로/취업", "마음/건강", "인간관계"];
  const detailsMap = {
    "진로/취업": ["취업이 계속 안돼요", "회사에서 번아웃이 왔어요", "이직/커리어 전환이 걱정이에요"],
    "마음/건강": ["불안/우울이 커졌어요", "잠을 잘 못 자요", "스트레스가 심해요"],
    "인간관계": ["관계가 자꾸 틀어져요", "소통이 어려워요", "혼자인 느낌이 강해요"],
  };

  /* ====== 비행기 위치/각도 계산(같은 SVG 좌표계에서) ====== */
  const pathRef = useRef(null);
  const [plane, setPlane] = useState({ x: 0, y: 0, angle: 0 });

  // 스텝 변경 시 좌표/각도 갱신
  useEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl) return;
    const total = pathEl.getTotalLength();
    const t = T_BY_STEP[step];
    const L = total * t;

    const p = pathEl.getPointAtLength(L);
    const p2 = pathEl.getPointAtLength(Math.min(total, L + 1));
    const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;

    setPlane({ x: p.x, y: p.y, angle });
  }, [step]); // PATHS/T_BY_STEP은 모듈 상수라 deps 불필요(경고 없음)

  // 리사이즈 대응
  useEffect(() => {
    const onResize = () => {
      const pathEl = pathRef.current;
      if (!pathEl) return;
      const total = pathEl.getTotalLength();
      const t = T_BY_STEP[step];
      const L = total * t;
      const p = pathEl.getPointAtLength(L);
      const p2 = pathEl.getPointAtLength(Math.min(total, L + 1));
      const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
      setPlane({ x: p.x, y: p.y, angle });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [step]);

  // 하단 SVG(웨이브+비행기) – 한 SVG 안에서 랜더
  const BelowSvg = (
    <svg
      className="absolute bottom-[120px] left-[-10%] w-[120%] max-w-none"
      viewBox="0 0 1200 160"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        ref={pathRef}
        d={PATHS[step]}
        stroke="#6da0ff"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* 비행기 */}
      <g transform={`translate(${plane.x}, ${plane.y}) rotate(${plane.angle})`}>
        <g
          transform="translate(-40,-20) scale(1.25)"
          stroke="#5d8cff"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M60 6 26 38l6 20 8-14 20-38Z" />
          <path d="M60 6 4 26l20 6" />
        </g>
      </g>
    </svg>
  );

  /* ===== 스텝 화면 ===== */

  // Step 1
  if (step === 1) {
    return (
      <StepLayout
        stepText="1/3"
        hideBack
        title="“안녕하세요, 당신의 이야기를 듣고싶어요.”"
        subtitle="지금 겪고 계신 가장 큰 어려움은 어떤 종류인가요?"
        below={BelowSvg}
      >
        <div className="flex flex-col items-center gap-5">
          {categories.map((c) => (
            <GlassButton
              key={c}
              onClick={() => {
                setAnswers((a) => ({ ...a, category: c, detail: null }));
                setStep(2);
              }}
            >
              {c}
            </GlassButton>
          ))}
        </div>
      </StepLayout>
    );
  }

  // Step 2
  if (step === 2) {
    const opts = detailsMap[answers.category] ?? [];
    return (
      <StepLayout
        stepText="2/3"
        onBack={() => setStep(1)}
        title={`“${answers.category?.split("/")[0]} 문제로 고민이 많으시군요.”`}
        subtitle="어떤 상황과 가장 비슷한가요?"
        below={BelowSvg}
      >
        <div className="flex items-center justify-center mb-4">
          <Pill>{answers.category}</Pill>
        </div>
        <div className="flex flex-col items-center gap-5">
          {opts.map((d) => (
            <GlassButton
              key={d}
              onClick={() => {
                setAnswers((a) => ({ ...a, detail: d }));
                setStep(3);
              }}
            >
              {d}
            </GlassButton>
          ))}
        </div>
      </StepLayout>
    );
  }

  // Step 3
  return (
    <StepLayout
      stepText="3/3"
      onBack={() => setStep(2)}
      title="“메아리 받을 준비가 되셨나요?”"
      subtitle="준비가 완료되셨다면 [메아리 받기] 버튼을 눌러주세요."
      below={BelowSvg}
    >
      <div className="flex items-center justify-center mb-4 gap-2">
        {[answers.category, answers.detail].filter(Boolean).map((t, i) => (
          <Pill key={i}>{t}</Pill>
        ))}
      </div>

      <div className="flex flex-col items-center gap-6">
        <GlassButton onClick={() => navigate("/echo", { state: answers })}>
          메아리 받기
        </GlassButton>

        <button
          onClick={() => setStep(1)}
          className="text-blue-600/80 hover:text-blue-700 text-sm underline-offset-2 hover:underline"
        >
          처음으로
        </button>
      </div>
    </StepLayout>
  );
}
