import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

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
  const location = useLocation();
  const [sessionData, setSessionData] = useState(null);
  const [viewedTypes, setViewedTypes] = useState(new Set());
  const [showDashboardButton, setShowDashboardButton] = useState(false);

  useEffect(() => {
    // location.state 또는 sessionStorage에서 세션 데이터 가져오기
    const stateData = location.state?.sessionData;
    const storedData = sessionStorage.getItem('meariSessionData');
    
    console.log('EchoLanding - location.state:', location.state);
    console.log('EchoLanding - sessionStorage:', storedData);
    
    // 새로운 세션 데이터가 있으면 localStorage 초기화
    if (stateData) {
      console.log('New session detected, clearing localStorage');
      localStorage.removeItem('viewedEchoTypes'); // 이전 기록 삭제
      setViewedTypes(new Set());
      setShowDashboardButton(false);
      console.log('Using state sessionData:', stateData);
      setSessionData(stateData);
    } else if (storedData) {
      console.log('Using stored sessionData:', JSON.parse(storedData));
      setSessionData(JSON.parse(storedData));
      
      // 기존 세션일 때만 이전 기록 복원
      const savedViewed = localStorage.getItem('viewedEchoTypes');
      if (savedViewed) {
        const viewed = new Set(JSON.parse(savedViewed));
        setViewedTypes(viewed);
        
        // 모든 타입을 봤으면 버튼 표시
        if (viewed.size === 3) {
          setShowDashboardButton(true);
        }
      }
    } else {
      console.log('No session data available');
    }
  }, [location]);

  const go = (cardType) => {
    // 해당 타입을 본 것으로 표시
    const newViewedTypes = new Set(viewedTypes);
    newViewedTypes.add(cardType);
    setViewedTypes(newViewedTypes);
    
    // localStorage에 저장
    localStorage.setItem('viewedEchoTypes', JSON.stringify([...newViewedTypes]));
    
    // 모든 타입을 봤는지 체크
    if (newViewedTypes.size === 3) {
      setTimeout(() => {
        setShowDashboardButton(true);
      }, 100);
    }
    
    // 세션 데이터와 함께 카드 페이지로 이동
    navigate(`/cards?type=${cardType}`, { 
      state: { 
        sessionData,
        cardType 
      }
    });
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
          <div className="flex flex-col items-center text-center relative">
            {viewedTypes.has('empathy') && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-blue-700 text-sm font-bold">✓</span>
              </div>
            )}
            <PlaneIcon className="text-[#5d8cff] w-10 h-10 mb-4" />
            <p className="text-[#4b2d19] font-medium leading-snug mb-6">
              나와 비슷한 사람들을 <br /> 찾고싶다면?
            </p>
            <GlassButton onClick={() => go('empathy')}>
              공감의 메아리
            </GlassButton>
          </div>

          {/* 성찰 */}
          <div className="flex flex-col items-center text-center relative">
            {viewedTypes.has('reflection') && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-blue-700 text-sm font-bold">✓</span>
              </div>
            )}
            <PlaneIcon className="text-[#5d8cff] w-10 h-10 mb-4" />
            <p className="text-[#4b2d19] font-medium leading-snug mb-6">
              나 혼자만의 문제가 <br /> 아닐 수 있다고?
            </p>
            <GlassButton onClick={() => go('reflection')}>
              성찰의 메아리
            </GlassButton>
          </div>

          {/* 성장 */}
          <div className="flex flex-col items-center text-center relative">
            {viewedTypes.has('growth') && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-blue-700 text-sm font-bold">✓</span>
              </div>
            )}
            <PlaneIcon className="text-[#5d8cff] w-10 h-10 mb-4" />
            <p className="text-[#4b2d19] font-medium leading-snug mb-6">
              세상으로 한 발짝 <br /> 나아가 볼까?
            </p>
            <GlassButton onClick={() => go('growth')}>
              성장의 메아리
            </GlassButton>
          </div>
        </section>

        {/* 진행 상황 표시 */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            {viewedTypes.size} / 3 메아리 확인함
          </p>
          <div className="max-w-md mx-auto mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(viewedTypes.size / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 대시보드 이동 버튼 */}
        {showDashboardButton && (
          <div className="mt-12 text-center animate-fade-in">
            <div className="mb-6">
              <p className="text-xl font-bold text-[#4b2d19]">
                모든 메아리를 확인했어요!
              </p>
              <p className="text-gray-600 text-sm mt-2">
                당신만의 성장 이야기가 시작됩니다
              </p>
            </div>
            <GlassButton 
              onClick={() => navigate('/dashboard')}
              className="mx-auto"
            >
              새로운 여정을 시작해볼까요?
            </GlassButton>
          </div>
        )}
      </main>
      
      {/* 하단 이미지 - Vector 2.png */}
      <div className="absolute bottom-0 left-0 w-full">
        <img 
          src={require('../assets/images/vector2.png')}
          alt="Wave decoration"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
