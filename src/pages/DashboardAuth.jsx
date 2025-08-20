// src/pages/DashboardAuth.jsx
import authStore from '../store/authStore';
import meariStore from '../store/meariStore';
import { useEffect } from 'react';

export default function DashboardAuth() {
  const { user, logout } = authStore();
  const { sessions, fetchSessions, loading } = meariStore();
  
  useEffect(() => {
    // 세션 목록 가져오기
    fetchSessions().catch(console.error);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
            <p className="mt-2 text-gray-600">
              안녕하세요, {user?.nickname || '사용자'}님! 👋
            </p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            로그아웃
          </button>
        </div>
        
        {/* 사용자 정보 카드 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">내 정보</h2>
          <div className="space-y-2">
            <p><span className="font-medium">이름:</span> {user?.nickname}</p>
            <p><span className="font-medium">이메일:</span> {user?.email}</p>
            <p><span className="font-medium">로그인 방식:</span> {user?.social_provider === 'google' ? 'Google' : user?.social_provider}</p>
            <p><span className="font-medium">가입일:</span> {user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '-'}</p>
          </div>
        </div>
        
        {/* 세션 목록 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">메아리 세션</h2>
          {loading ? (
            <p className="text-gray-500">로딩 중...</p>
          ) : sessions && sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.session_id} className="border rounded-lg p-4">
                  <p className="font-medium">세션 ID: {session.session_id}</p>
                  <p className="text-sm text-gray-600">
                    생성일: {new Date(session.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">아직 세션이 없습니다.</p>
          )}
        </div>
        
        {/* 퀵 액션 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '/cards'}
            className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            카드 페이지로 이동
          </button>
          <button
            onClick={() => window.location.href = '/echo'}
            className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            메아리 시작하기
          </button>
          <button
            onClick={() => window.location.href = '/connect/info'}
            className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            연결하기
          </button>
        </div>
      </div>
    </div>
  );
}