// src/pages/SimpleLoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authStore from '../store/authStore';

export default function SimpleLoginPage() {
  const navigate = useNavigate();
  const { setUser, setOnboardingCompleted } = authStore();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isSignup ? '/auth/signup' : '/auth/login';
      const body = isSignup 
        ? formData 
        : { email: formData.email, password: formData.password };

      const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      // 로그인 성공
      setUser(data);
      setOnboardingCompleted(data.onboarding_completed || false);
      
      // 온보딩 완료 여부에 따라 리다이렉트
      if (data.onboarding_completed) {
        navigate('/dashboard');
      } else {
        navigate('/steps');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src={require('../assets/images/meari-logo.png')}
            alt="MEARI Logo"
            className="w-16 h-auto mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800">
            {isSignup ? '회원가입' : '로그인'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="이름을 입력하세요"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? '처리중...' : (isSignup ? '가입하기' : '로그인')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
              setFormData({ email: '', password: '', name: '' });
            }}
            className="text-blue-600 hover:underline text-sm"
          >
            {isSignup ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
          </button>
        </div>

        {/* 테스트용 자동 입력 버튼 */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setFormData({
              email: 'test@meari.com',
              password: 'test1234',
              name: '테스트 사용자'
            })}
            className="w-full text-gray-500 text-xs hover:text-gray-700"
          >
            테스트 계정으로 자동 입력
          </button>
        </div>
      </div>
    </div>
  );
}