// src/pages/GrowthPage.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import meariService from "../services/meariService";

export default function GrowthPage({ sessionData }) {
  const navigate = useNavigate();
  
  // ✅ 각 알약을 독립적으로 토글
  const [open, setOpen] = useState({ info: false, exp: false, sup: false });
  const toggle = (key) => setOpen((p) => ({ ...p, [key]: !p[key] }));
  
  // 성장 콘텐츠 상태 관리
  const [growthContents, setGrowthContents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false); // 이미 로드했는지 추적
  const [lastLoadDate, setLastLoadDate] = useState(null); // 마지막 로드 날짜

  // 성장 콘텐츠 API 호출
  useEffect(() => {
    const fetchGrowthContents = async () => {
      // sessionData 전체 확인
      console.log('Current sessionData:', sessionData);
      console.log('SessionData type:', typeof sessionData);
      console.log('SessionData keys:', sessionData ? Object.keys(sessionData) : 'null');
      
      // 세션 데이터가 없으면 스킵
      if (!sessionData) {
        console.error('No sessionData available');
        setError('세션 정보가 없습니다.');
        setLoading(false);
        return;
      }

      // 오늘 이미 데이터를 불러왔으면 스킵
      const today = new Date().toDateString();
      if (hasLoaded && growthContents && lastLoadDate === today) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // 세션 ID 찾기 - 다양한 필드 확인
        const sessionId = sessionData.session_id || 
                         sessionData.id || 
                         sessionData.sessionId ||
                         `session_${Date.now()}`;
        
        // persona summary 찾기 - 다양한 경로 확인
        const personaSummary = sessionData.persona?.summary || 
                              sessionData.summary || 
                              sessionData.persona_summary ||
                              sessionData.userContext ||
                              '';
        
        console.log('Using session_id:', sessionId);
        console.log('Using persona_summary:', personaSummary);
        
        // API 요청 데이터 구성
        const requestData = {
          session_id: sessionId,
          context: 'initial',
          previous_policy_ids: [],
          persona_summary: personaSummary
        };
        
        console.log('Sending request to growth-contents API:', requestData);
        
        const response = await meariService.createGrowthContents(requestData);
        
        console.log('Growth contents response:', response);
        console.log('Response structure:', {
          hasGrowthContents: !!response.growth_contents,
          hasCards: !!response.cards,
          keys: Object.keys(response)
        });
        
        // API 응답 구조에 맞게 수정: cards가 아닌 growth_contents 사용
        const contents = response.growth_contents || response.cards || response;
        console.log('Setting growth contents:', contents);
        setGrowthContents(contents);
        setHasLoaded(true); // 로드 완료 표시
        setLastLoadDate(today); // 오늘 날짜 저장
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch growth contents:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          headers: err.response?.headers,
          requestData: err.config?.data
        });
        
        // 더 구체적인 에러 메시지
        let errorMessage = '성장 콘텐츠를 불러오는데 실패했습니다.';
        if (err.response?.status === 404) {
          errorMessage = 'API 엔드포인트를 찾을 수 없습니다.';
        } else if (err.response?.status === 400) {
          errorMessage = `잘못된 요청: ${err.response?.data?.message || '세션 정보를 확인해주세요.'}`;
        } else if (err.response?.status === 422) {
          errorMessage = `유효성 검사 실패: ${err.response?.data?.detail || '입력값을 확인해주세요.'}`;
        } else if (err.response?.status === 500) {
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
        
        setError(errorMessage);
        setLoading(false);
      }
    };

    // 세션 데이터가 있고 아직 로드하지 않았을 때만 실행
    if (sessionData && !hasLoaded) {
      fetchGrowthContents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData, hasLoaded]); // sessionData 전체와 hasLoaded를 의존성으로 사용

  // 로딩 중일 때
  if (loading) {
    return (
      <PageWrapper
        title="성장의 메아리"
        subtitle={
          <span className="block text-[#6b4a2f]">
            <span>당신을 위한 성장 콘텐츠를 준비하고 있어요...</span>
          </span>
        }
        tags={["진로/취업", "준비중"]}
      >
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <PageWrapper
        title="성장의 메아리"
        subtitle={
          <span className="block text-red-600">
            {error}
          </span>
        }
        tags={["오류"]}
      >
        <div className="flex justify-center items-center min-h-[400px]">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="성장의 메아리"
      subtitle={
        <span className="block text-[#6b4a2f]">
          <span>당신의 작은 용기가 곧 변화의 시작이 될 거예요.</span>
          <br />
          <span>천천히, 함께 세상을 향해 나아가볼까요?</span>
        </span>
      }
      tags={sessionData?.persona?.keywords || ["진로/취업", "성장"]}
    >
      {/* 중앙 라디얼 블루 하이라이트 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[36%] h-[720px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(600px_420px_at_center,rgba(118,163,255,0.32),transparent_65%)]" />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 pt-8 md:grid-cols-3">
        {/* 정보 연결 */}
        <PillColumn
          title={"도움이 될만한\n정보를 얻고 싶다면?"}
          label="정보 연결"
          active={open.info}
          onToggle={() => toggle("info")}
        >
          <PanelCard>
            <PanelHeader>{growthContents?.information?.type || '정보'}</PanelHeader>
            <PanelTitle>{growthContents?.information?.title || '유용한 정보'}</PanelTitle>
            <PanelBody>
              {growthContents?.information?.content || '정보를 불러오는 중...'}
              {growthContents?.information?.summary && (
                <div className="mt-2 text-xs text-slate-500">
                  {growthContents.information.summary}
                </div>
              )}
            </PanelBody>
            {growthContents?.information?.sources?.[0] && (
              <PanelLink href={growthContents.information.sources[0].url}>
                {growthContents.information.sources[0].title} &gt;
              </PanelLink>
            )}
          </PanelCard>
        </PillColumn>

        {/* 경험 연결 */}
        <PillColumn
          title={"작은 실천으로\n변화를 시작하고 싶다면?"}
          label="경험 연결"
          active={open.exp}
          onToggle={() => toggle("exp")}
        >
          <PanelCard>
            <PanelHeader>{growthContents?.experience?.type || '경험'}</PanelHeader>
            <PanelTitle>{growthContents?.experience?.ritual_name || '오늘의 리츄얼'}</PanelTitle>
            <PanelBody>
              <div className="space-y-2">
                <p className="font-medium">{growthContents?.experience?.description || '리츄얼 설명'}</p>
                {growthContents?.experience?.steps && (
                  <ul className="text-sm space-y-1">
                    {growthContents.experience.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                )}
                {growthContents?.experience?.duration && (
                  <p className="text-xs text-slate-500">소요시간: {growthContents.experience.duration}</p>
                )}
                {growthContents?.experience?.immediate_effect && (
                  <p className="text-xs text-blue-600">즉각 효과: {growthContents.experience.immediate_effect}</p>
                )}
              </div>
            </PanelBody>
          </PanelCard>
        </PillColumn>

        {/* 지원 연결 */}
        <PillColumn
          title={"나를 도와줄 수 있는\n정책과 서비스가 궁금하다면?"}
          label="지원 연결"
          active={open.sup}
          onToggle={() => toggle("sup")}
        >
          <PanelCard>
            <PanelHeader>{growthContents?.support?.type || '지원'}</PanelHeader>
            <PanelTitle>{growthContents?.support?.policy_name || '청년 지원 정책'}</PanelTitle>
            <PanelBody>
              <div className="space-y-2">
                <p>{growthContents?.support?.support_content || '지원 내용'}</p>
                {growthContents?.support?.organization && (
                  <p className="text-sm text-slate-600">운영기관: {growthContents.support.organization}</p>
                )}
                {growthContents?.support?.eligibility && (
                  <p className="text-sm text-slate-600">신청자격: {growthContents.support.eligibility}</p>
                )}
                {growthContents?.support?.how_to_apply && (
                  <p className="text-sm text-slate-600">신청방법: {growthContents.support.how_to_apply}</p>
                )}
              </div>
            </PanelBody>
            <PanelLink 
              href={growthContents?.support?.application_url || "https://www.youthcenter.go.kr"} 
              target="_blank"
              rel="noopener noreferrer"
            >
              신청하러 가기 &gt;
            </PanelLink>
          </PanelCard>
        </PillColumn>
      </div>

    </PageWrapper>
  );
}

/* 알약 형태 컬럼 */
function PillColumn({ title, label, active, onToggle, children }) {
  return (
    <article className="relative flex flex-col items-center text-center">
      {/* 제목 */}
      <h2 className="mb-10 whitespace-pre-line text-lg font-semibold text-[#4b2d19] sm:text-xl">
        {title}
      </h2>

      {/* 알약 버튼 */}
      <button
        onClick={onToggle}
        className={`
          relative mx-auto mb-8 px-10 py-5 rounded-full font-semibold text-[16px]
          transition-all duration-300 shadow-lg
          ${
            active
              ? "bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[0_12px_28px_rgba(59,130,246,0.3)]"
              : "bg-white text-blue-700 hover:shadow-[0_16px_32px_rgba(59,130,246,0.15)]"
          }
        `}
      >
        {label}
      </button>

      {/* 열리는 패널 */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

/* 패널 카드 */
function PanelCard({ children }) {
  return (
    <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
      {children}
    </div>
  );
}

/* 패널 요소들 */
function PanelHeader({ children }) {
  return (
    <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </div>
  );
}

function PanelTitle({ children }) {
  return <h3 className="mb-4 text-lg font-bold text-slate-800">{children}</h3>;
}

function PanelBody({ children }) {
  return <div className="mb-4 text-sm leading-relaxed text-slate-600">{children}</div>;
}

function PanelLink({ href, children, ...props }) {
  return (
    <a
      href={href}
      className="inline-block text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
      {...props}
    >
      {children}
    </a>
  );
}