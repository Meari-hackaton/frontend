import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import authStore from '../store/authStore';
import meariService from '../services/meariService';

/* ====== (컴포넌트 밖) 고정 상수 ====== */
/** 스텝별 웨이브 경로 (viewBox: 0 0 1200 160) */
const PATHS = {
  1: "M0,120 C180,180 380,120 520,140 C680,165 840,160 1200,110", // 왼쪽 진입
  2: "M0,110 C180,170 420,60 720,120 C900,160 1080,140 1200,90",   // 중앙 파고
  3: "M0,130 C220,170 520,100 780,140 C980,200 1100,180 1200,120", // 오른쪽 마무리
  4: "M0,100 C300,150 600,110 900,140 C1050,160 1150,130 1200,100"  // 최종
};
/** 스텝별 비행기 위치 비율(앞/중/끝 느낌) */
const T_BY_STEP = { 1: 0.15, 2: 0.4, 3: 0.65, 4: 0.9 };

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
function StepLayout({ stepText, chips = [], title, subtitle, children, onBack, hideBack, below, backgroundImage }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 배경 */}
      {backgroundImage ? (
        <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
          <img 
            src={backgroundImage}
            alt="Background"
            className="w-full h-full object-cover animate-fadeIn"
            key={backgroundImage}
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#eef4ff] via-[#cfe0ff] to-[#e9f0ff]" />
      )}

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

    </div>
  );
}

/* ===== 메인: 스텝 위저드 ===== */
export default function StepsWizard() {
  const navigate = useNavigate();
  const { setOnboardingCompleted } = authStore();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({ category: null, detail: null, userContext: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 태그 ID 매핑
  const categoryToTagId = {
    "진로/취업": { 
      "취업이 계속 안돼요": 4,
      "회사에서 번아웃이 왔어요": 2, 
      "이직/커리어 전환이 걱정이에요": 4
    },
    "마음/건강": {
      "불안/우울이 커졌어요": 10,
      "잠을 잘 못 자요": 7,
      "스트레스가 심해요": 12
    },
    "인간관계": {
      "관계가 자꾸 틀어져요": 3,
      "소통이 어려워요": 3,
      "혼자인 느낌이 강해요": 11
    }
  };

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
        title="안녕하세요, 당신의 이야기를 듣고싶어요."
        subtitle="지금 겪고 계신 가장 큰 어려움은 어떤 종류인가요?"
        backgroundImage={require('../assets/images/step1.png')}
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
        title={`${answers.category?.split("/")[0]} 문제로 고민이 많으시군요.`}
        subtitle="어떤 상황과 가장 비슷한가요?"
        backgroundImage={require('../assets/images/2.png')}
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

  // Step 3 - 추가 컨텍스트 입력
  if (step === 3) {
    return (
      <StepLayout
        stepText="3/3"
        onBack={() => setStep(2)}
        title="조금 더 자세히 들려주실 수 있나요?"
        subtitle="선택사항이에요. 편하게 이야기해주세요."
        backgroundImage={require('../assets/images/step3.png')}
      >
        <div className="flex items-center justify-center mb-6 gap-2">
          {[answers.category, answers.detail].filter(Boolean).map((t, i) => (
            <Pill key={i}>{t}</Pill>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <textarea
            value={answers.userContext}
            onChange={(e) => setAnswers(prev => ({ ...prev, userContext: e.target.value }))}
            placeholder="예) 매일 야근하고 주말에도 일해야 해서 너무 지쳐있어요. 이직을 고민하고 있지만 막막해요..."
            className="w-full h-32 p-4 border border-blue-200 rounded-2xl bg-white/70 backdrop-blur
                     resize-none focus:outline-none focus:border-blue-400 text-slate-700"
            maxLength={500}
          />
          <div className="text-right text-sm text-slate-400 mt-2">
            {answers.userContext.length}/500
          </div>
        </div>

        <div className="flex flex-col items-center gap-5">
          <GlassButton onClick={() => setStep(4)}>
            {answers.userContext ? '다음으로' : '건너뛰기'}
          </GlassButton>
        </div>
      </StepLayout>
    );
  }

  // Step 4 - 최종 확인
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eef4ff] via-[#cfe0ff] to-[#e9f0ff]">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 animate-pulse flex items-center justify-center">
              <span className="text-3xl">🌱</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-700 mb-3">
            당신을 위한 메아리를 준비하고 있어요
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            잠시만 기다려주세요... (약 30-45초)
          </p>
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <StepLayout
      stepText="4/4"
      onBack={() => setStep(3)}
      title="메아리 받을 준비가 되셨나요?"
      subtitle="준비가 완료되셨다면 [메아리 받기] 버튼을 눌러주세요."
      backgroundImage={require('../assets/images/태그 7.jpg')}
    >
      <div className="flex items-center justify-center mb-4 gap-2">
        {[answers.category, answers.detail].filter(Boolean).map((t, i) => (
          <Pill key={i}>{t}</Pill>
        ))}
      </div>
      
      {answers.userContext && (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-white/50 rounded-2xl">
          <p className="text-sm text-slate-600 italic">"{answers.userContext}"</p>
        </div>
      )}

      <div className="flex flex-col items-center gap-6">
        <GlassButton onClick={async () => {
          setLoading(true);
          setError('');
          
          try {
            // 선택한 카테고리와 상세 내용에 따른 태그 ID 가져오기
            const tagId = categoryToTagId[answers.category]?.[answers.detail] || 12;
            
            // 세션 생성 API 호출 (30-60초 소요)
            const response = await meariService.createSession({
              selected_tag_id: tagId,
              user_context: answers.userContext || `${answers.category} - ${answers.detail}`
            });
            
            console.log('Session created response:', response);
            
            // 온보딩 완료 상태 업데이트
            setOnboardingCompleted(true);
            
            // 세션 데이터를 저장하고 결과 페이지로 이동
            sessionStorage.setItem('meariSessionData', JSON.stringify(response));
            console.log('Saved to sessionStorage:', sessionStorage.getItem('meariSessionData'));
            
            // 새 세션이므로 이전 카드 열람 기록 삭제
            localStorage.removeItem('viewedEchoTypes');
            localStorage.removeItem('viewedEchoCards');
            
            // EchoLanding 페이지로 이동 (공감/성찰/성장 카드 선택)
            navigate('/echo', { 
              state: { 
                sessionData: response,
                answers: answers,
                fromWizard: true  // 새로운 세션임을 표시
              } 
            });
          } catch (err) {
            console.error('Failed to create session:', err);
            setError('세션 생성에 실패했습니다. 다시 시도해주세요.');
            setLoading(false);
          }
        }}>
          {loading ? '메아리를 준비하고 있어요...' : '메아리 받기'}
        </GlassButton>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={() => setStep(1)}
          className="text-blue-600/80 hover:text-blue-700 text-sm underline-offset-2 hover:underline"
          disabled={loading}
        >
          처음으로
        </button>
      </div>
    </StepLayout>
  );
}
