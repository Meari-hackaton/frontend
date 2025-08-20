// src/pages/LoginPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authStore from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = authStore();
  
  // 이미 로그인된 경우 대시보드로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  const handleGoogleLogin = () => {
    // 백엔드 OAuth 시작점으로 리다이렉트 (성공 후 /dashboard로 이동하도록 요청)
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google/login?redirect_url=${encodeURIComponent('http://localhost:3000/dashboard')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">로그인</h1>
      <button
        onClick={handleGoogleLogin}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Google 로그인
      </button>
    </div>
  );
}
