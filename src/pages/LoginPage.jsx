// src/pages/LoginPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authStore from '../store/authStore';
import GlassButton from '../components/UI/GlassButton';
import MeariLogo from '../components/UI/MeariLogo';
import GoogleIcon from '../components/Icons/GoogleIcon';
import PaperPlaneIcon from '../components/Icons/PaperPlaneIcon';

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
    // 백엔드 OAuth 시작점으로 리다이렉트
    // 온보딩 완료 여부는 로그인 후 자동 판단하여 리다이렉트
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google/login?redirect_url=${encodeURIComponent('http://localhost:3000/dashboard')}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* 배경 (Dashboard와 동일) */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_48%_55%,rgba(147,197,253,0.46),transparent_60%)]" />

      {/* 하단 웨이브 라인과 종이비행기 */}
      <div className="absolute bottom-0 left-0 w-full">
        <img 
          src={require('../assets/images/wave-airplane.png')}
          alt="Wave and Airplane"
          className="w-full h-auto"
        />
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* MEARI 로고 아이콘 */}
        <div className="mb-6">
          <img 
            src={require('../assets/images/meari-logo.png')}
            alt="MEARI Logo"
            className="w-20 h-auto"
          />
        </div>

        {/* 서브 카피 */}
        <div className="text-center mb-12 max-w-md">
          <p className="text-white text-lg leading-relaxed mb-2">
            세상의 소음 속에서 길을 잃은 당신에게,
          </p>
          <p className="text-white/90 font-medium text-lg">
            '너는 혼자가 아니야'라는 가장 선명한 메아리
          </p>
        </div>

        {/* 구글 로그인 버튼 */}
        <button 
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 bg-white text-blue-600 font-medium px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 min-w-[280px]"
        >
          <GoogleIcon className="w-5 h-5" />
          구글로 시작하기
        </button>
      </div>
    </div>
  );
}
