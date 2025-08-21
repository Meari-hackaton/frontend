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
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse mb-4">
              <div className="w-20 h-20 bg-blue-200 rounded-full mx-auto"></div>
            </div>
            <p className="text-slate-600">완주 여부를 확인하고 있습니다...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }
  
  // 아직 완주하지 않은 경우
  if (!isCompleted) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <img 
                src={require('../assets/images/tree2.png')}
                alt="성장 중"
                className="w-32 h-32 mx-auto opacity-50"
              />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              아직 여정이 진행 중이에요
            </h2>
            <p className="text-slate-600 mb-2">
              {completionData?.total_rituals || 0}일 완료 / 28일
            </p>
            <p className="text-slate-500 mb-8">
              {completionData?.message || '조금만 더 힘내세요!'}
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              대시보드로 돌아가기
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }
  
  // 리포트 로딩 중
  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin mb-4">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>
            </div>
            <p className="text-slate-600">AI가 당신의 성장 여정을 분석하고 있습니다...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }
  
  // 에러 발생
  if (error) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-slate-600 text-white rounded-full"
            >
              돌아가기
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }
  
  // 리포트 표시
  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* 헤더 */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <img 
                src={require('../assets/images/tree4.png')}
                alt="만개한 나무"
                className="w-48 h-48 mx-auto"
              />
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              {report?.title || '28일 성장 여정 완주'}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {report?.opening_message}
            </p>
          </div>
          
          {/* 페르소나 여정 */}
          {report?.persona_journey && (
            <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                페르소나의 진화
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-slate-700">시작</p>
                    <p className="text-slate-600">{report.persona_journey.start}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-slate-700">변화</p>
                    <p className="text-slate-600">{report.persona_journey.middle}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-slate-700">현재</p>
                    <p className="text-slate-600">{report.persona_journey.end}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-blue-800 mb-1">핵심 변화</p>
                <p className="text-blue-700">{report.persona_journey.key_transformation}</p>
              </div>
            </section>
          )}
          
          {/* 리츄얼 인사이트 */}
          {report?.ritual_insights && (
            <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                리츄얼 실천 분석
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">
                    {report.ritual_insights.total_days}일
                  </p>
                  <p className="text-sm text-slate-600">총 실천 일수</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-lg font-semibold text-slate-700">
                    {report.ritual_insights.favorite_practice}
                  </p>
                  <p className="text-sm text-slate-600">가장 많이 실천한 리츄얼</p>
                </div>
              </div>
              <p className="text-slate-700 mb-3">
                {report.ritual_insights.consistency_message}
              </p>
              <p className="text-slate-600">
                <span className="font-semibold">영향: </span>
                {report.ritual_insights.impact}
              </p>
            </section>
          )}
          
          {/* 감정 성장 */}
          {report?.emotional_growth && (
            <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                감정의 변화
              </h2>
              <div className="mb-6">
                <p className="text-sm text-slate-500 mb-3">주요 감정 키워드</p>
                <div className="flex flex-wrap gap-2">
                  {report.emotional_growth.dominant_emotions?.map((emotion, idx) => (
                    <span 
                      key={idx}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {emotion}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-slate-700 mb-4">
                {report.emotional_growth.emotional_journey}
              </p>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <p className="text-sm font-semibold text-slate-700 mb-1">돌파구의 순간</p>
                <p className="text-slate-600">{report.emotional_growth.breakthrough_moment}</p>
              </div>
            </section>
          )}
          
          {/* 미래 방향 */}
          {report?.future_direction && (
            <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                앞으로의 여정
              </h2>
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <p className="font-semibold text-green-800 mb-2">다음 단계</p>
                <p className="text-green-700">{report.future_direction.next_phase}</p>
              </div>
              <div className="mb-6">
                <p className="font-semibold text-slate-700 mb-3">추천 사항</p>
                <ul className="space-y-2">
                  {report.future_direction.recommendations?.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span className="text-slate-600">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-700 font-medium">
                  {report.future_direction.encouragement}
                </p>
              </div>
            </section>
          )}
          
          {/* 마무리 메시지 */}
          <div className="text-center py-12">
            <p className="text-lg text-slate-700 max-w-2xl mx-auto mb-8">
              {report?.closing_message}
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-shadow"
            >
              새로운 시작하기
            </button>
          </div>
          
        </div>
      </div>
    </PageWrapper>
  );
}