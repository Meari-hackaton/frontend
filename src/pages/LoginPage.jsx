// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authStore from '../store/authStore';
import api from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, setUser } = authStore();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',  // 백엔드와의 호환성을 위해 email 필드 유지
    password: '',
    nickname: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isSignup ? '/api/v1/auth/signup' : '/api/v1/auth/login';
      // 아이디를 이메일 형식으로 변환 (백엔드 호환성)
      const requestData = {
        ...formData,
        email: formData.email.includes('@') ? formData.email : `${formData.email}@meari.com`
      };
      const response = await api.post(endpoint, requestData);

      if (response.status === 200 || response.status === 201) {
        if (response.data.user) {
          setUser(response.data.user);
        }
        navigate(isSignup ? '/steps' : '/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* 원래 배경 이미지 */}
      <div className="absolute inset-0">
        <img
          src={require('../assets/images/Group 4491.png')}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* 로고 */}
        <div className="mb-8">
          <img
            src={require('../assets/images/meari-logo.png')}
            alt="MEARI"
            className="w-20 h-auto"
          />
        </div>

        {/* 메인 텍스트 */}
        <div className="text-center mb-10 max-w-md">
          <p className="text-white text-lg leading-relaxed mb-2">
            세상의 소음 속에서 길을 잃은 당신에게,
          </p>
          <p className="text-white/90 font-medium text-lg">
            '너는 혼자가 아니야'라는 가장 선명한 메아리
          </p>
        </div>

        {/* 폼 영역 */}
        <div className="w-full max-w-sm">
          {/* 로그인/회원가입 탭 */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setIsSignup(false);
                setError('');
                setFormData({ email: '', password: '', nickname: '' });
              }}
              className={`flex-1 py-3 rounded-full font-medium transition-all ${
                !isSignup 
                  ? 'bg-white text-blue-500 shadow-lg' 
                  : 'bg-white/30 text-white hover:bg-white/40'
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => {
                setIsSignup(true);
                setError('');
                setFormData({ email: '', password: '', nickname: '' });
              }}
              className={`flex-1 py-3 rounded-full font-medium transition-all ${
                isSignup 
                  ? 'bg-white text-blue-500 shadow-lg' 
                  : 'bg-white/30 text-white hover:bg-white/40'
              }`}
            >
              회원가입
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="아이디"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-4 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="비밀번호"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-5 py-4 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                required
              />
            </div>

            {isSignup && (
              <div>
                <input
                  type="text"
                  placeholder="닉네임 (대시보드에 표시됩니다)"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full px-5 py-4 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                  required
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-100/90 backdrop-blur-sm border border-red-300 text-red-700 rounded-2xl text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-blue-500 font-bold py-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '처리중...' : (isSignup ? '회원가입하기' : '로그인하기')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
