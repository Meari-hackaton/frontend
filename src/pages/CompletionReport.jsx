import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import meariService from '../services/meariService';
import PageWrapper from '../components/PageWrapper';

export default function CompletionReport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionData, setCompletionData] = useState(null);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  
  // 완주 여부 확인
  useEffect(() => {
    checkCompletion();
  }, []);
  
  const checkCompletion = async () => {
    try {
      setChecking(true);
      const result = await meariService.checkCompletion();
      setCompletionData(result);
      setIsCompleted(result.is_completed);
      
      if (result.is_completed) {
        // 완주했으면 리포트 생성
        await generateReport();
      }
    } catch (err) {
      console.error('완주 확인 실패:', err);
      setError('완주 상태를 확인할 수 없습니다.');
    } finally {
      setChecking(false);
      setLoading(false);
    }
  };
  
  const generateReport = async () => {
    try {
      setLoading(true);
      const reportData = await meariService.generateCompletionReport();
      setReport(reportData.report);
    } catch (err) {
      console.error('리포트 생성 실패:', err);
      setError('리포트를 생성할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 로딩 중
  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f3f7ff] via-[#dbe7ff] to-[#eef4ff] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 animate-pulse flex items-center justify-center">
              <span className="text-2xl">🌱</span>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-[#4b2d19] mb-2">
            완주 여부를 확인하고 있습니다
          </h2>
          <div className="flex justify-center gap-1 mt-3">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }
  
  // 아직 완주하지 않은 경우
  if (!isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f3f7ff] via-[#dbe7ff] to-[#eef4ff]">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <img 
                src={require('../assets/images/tree2.png')}
                alt="성장 중"
                className="w-32 h-32 mx-auto"
              />
            </div>
            
            <h1 className="text-2xl font-bold text-[#4b2d19] mb-3">
              아직 여정이 진행 중이에요
            </h1>
            
            <div className="mb-6 p-4 bg-white/70 rounded-2xl shadow-sm">
              <div className="flex justify-center items-center gap-3 mb-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {completionData?.total_rituals || 0}
                  </p>
                  <p className="text-xs text-slate-500">완료</p>
                </div>
                <div className="text-lg text-slate-400">/</div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-400">28</p>
                  <p className="text-xs text-slate-500">목표</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full transition-all"
                  style={{ width: `${((completionData?.total_rituals || 0) / 28) * 100}%` }}
                />
              </div>
              
              <p className="text-sm text-[#6b4a2f]">
                {completionData?.message || '조금만 더 힘내세요!'}
              </p>
            </div>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-white/75 text-blue-700 font-semibold rounded-[28px] shadow-[0_18px_40px_rgba(30,64,175,.18),inset_0_2px_0_rgba(255,255,255,.9)] hover:bg-white/90 transition"
            >
              대시보드로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // 리포트 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-spin"></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-700 mb-3">
            AI가 당신의 성장 여정을 분석하고 있습니다
          </h2>
          <p className="text-sm text-slate-500">
            28일간의 소중한 기록을 정리하는 중...
          </p>
        </div>
      </div>
    );
  }
  
  // 에러 발생
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">😢</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">
            오류가 발생했습니다
          </h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    );
  }
  
  // 리포트 표시
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3f7ff] via-[#dbe7ff] to-[#eef4ff]">
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* 헤더 */}
          <div className="text-center mb-10">
            <div className="mb-6">
              <img 
                src={require('../assets/images/tree4.png')}
                alt="만개한 나무"
                className="w-40 h-40 mx-auto"
              />
            </div>
            
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/70 text-blue-600 font-medium text-sm">
                28일 완주
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-[#4b2d19] mb-3">
              {report?.title || '당신의 성장 이야기'}
            </h1>
            <p className="text-base text-[#6b4a2f] max-w-2xl mx-auto">
              {report?.opening_message || '28일 동안의 여정을 되돌아봅니다.'}
            </p>
          </div>
          
          {/* 페르소나 여정 */}
          {report?.persona_journey && (
            <section className="bg-white/70 rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-[#4b2d19] mb-4">
                페르소나의 진화
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#4b2d19] mb-1">시작</p>
                    <p className="text-sm text-[#6b4a2f] leading-relaxed">{report.persona_journey.start}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-purple-600 font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#4b2d19] mb-1">변화</p>
                    <p className="text-sm text-[#6b4a2f] leading-relaxed">{report.persona_journey.middle}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-green-600 font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#4b2d19] mb-1">현재</p>
                    <p className="text-sm text-[#6b4a2f] leading-relaxed">{report.persona_journey.end}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                <p className="text-xs font-semibold text-blue-700 mb-1">핵심 변화</p>
                <p className="text-sm text-[#6b4a2f]">{report.persona_journey.key_transformation}</p>
              </div>
            </section>
          )}
          
          {/* 리츄얼 인사이트 */}
          {report?.ritual_insights && (
            <section className="bg-white/70 rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-[#4b2d19] mb-4">
                리츄얼 실천 분석
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">
                    {report.ritual_insights.total_days}일
                  </p>
                  <p className="text-xs text-slate-600">총 실천</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <p className="text-sm font-semibold text-[#4b2d19]">
                    {report.ritual_insights.favorite_practice}
                  </p>
                  <p className="text-xs text-slate-600">주요 리츄얼</p>
                </div>
              </div>
              <p className="text-sm text-[#6b4a2f] mb-2">
                {report.ritual_insights.consistency_message}
              </p>
              <p className="text-sm text-[#6b4a2f]">
                <span className="font-semibold">영향: </span>
                {report.ritual_insights.impact}
              </p>
            </section>
          )}
          
          {/* 감정 성장 */}
          {report?.emotional_growth && (
            <section className="bg-white/70 rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-[#4b2d19] mb-4">
                감정의 변화
              </h2>
              
              <div className="mb-4">
                <div className="flex flex-wrap gap-1.5">
                  {report.emotional_growth.dominant_emotions?.map((emotion, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                    >
                      {emotion}
                    </span>
                  ))}
                </div>
              </div>
              
              <p className="text-sm text-[#6b4a2f] mb-3 leading-relaxed">
                {report.emotional_growth.emotional_journey}
              </p>
              
              <div className="p-3 bg-purple-50 rounded-xl">
                <p className="text-xs font-semibold text-purple-700 mb-1">돌파구의 순간</p>
                <p className="text-sm text-[#6b4a2f]">{report.emotional_growth.breakthrough_moment}</p>
              </div>
            </section>
          )}
          
          {/* 미래 방향 */}
          {report?.future_direction && (
            <section className="bg-white/70 rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-[#4b2d19] mb-4">
                앞으로의 여정
              </h2>
              
              <div className="mb-4 p-3 bg-green-50 rounded-xl">
                <p className="text-xs font-semibold text-green-700 mb-1">다음 단계</p>
                <p className="text-sm text-[#6b4a2f]">{report.future_direction.next_phase}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-semibold text-[#4b2d19] mb-2">추천 사항</p>
                <ul className="space-y-1.5">
                  {report.future_direction.recommendations?.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-500 text-xs mt-0.5">•</span>
                      <span className="text-sm text-[#6b4a2f]">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-xl">
                <p className="text-sm text-[#6b4a2f] font-medium">
                  {report.future_direction.encouragement}
                </p>
              </div>
            </section>
          )}
          
          {/* 마무리 메시지 */}
          <div className="text-center py-12">
            <div className="mb-8 p-6 bg-white/70 rounded-2xl shadow-sm">
              <p className="text-lg text-[#4b2d19] font-semibold max-w-2xl mx-auto mb-2">
                {report?.closing_message || '28일의 여정을 완주한 당신, 정말 자랑스럽습니다.'}
              </p>
              <p className="text-base text-[#6b4a2f]">
                이제 새로운 시작을 준비해보세요. 🌟
              </p>
            </div>
            
            <div className="flex justify-center gap-3">
              <button
                onClick={() => navigate('/steps')}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                새로운 여정 시작하기
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-white text-purple-600 border border-purple-300 rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
              >
                📄 리포트 저장
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}