// src/pages/StartPage.jsx
import authStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import MeariLogo from '../components/UI/MeariLogo';
import GlassButton from '../components/UI/GlassButton';

export default function StartPage() {
  const { user, isAuthenticated, logout } = authStore();
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* 배경 (Dashboard와 동일) */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_48%_55%,rgba(147,197,253,0.46),transparent_60%)]" />

      {/* 로그인 상태 표시 */}
      {isAuthenticated && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-4 bg-white rounded-full px-4 py-2 shadow-lg">
          <span className="text-sm text-gray-700">안녕하세요, {user?.nickname}님</span>
          <button
            onClick={logout}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            로그아웃
          </button>
<<<<<<< HEAD
        </div>
      )}

      {/* 하단 웨이브 라인과 종이비행기 */}
      <div className="absolute bottom-0 left-0 w-full">
        <img 
          src={require('../assets/images/wave-airplane.png')}
          alt="Wave and Airplane"
          className="w-full h-auto"
        />
      </div>
      
      {/* 중앙 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* MEARI 로고 아이콘 */}
        <div className="mb-6">
          <img 
            src={require('../assets/images/meari-logo.png')}
            alt="MEARI Logo"
            className="w-20 h-auto"
          />
=======
>>>>>>> 5ac97a7c4ae0adce95e3f279ff6a3c3290698e1b
        </div>
      )}

        {/* 서브 카피 */}
        <div className="text-center mb-12 max-w-md">
          <p className="text-white text-lg leading-relaxed mb-2">
            세상의 소음 속에서 길을 잃은 당신에게,
          </p>
          <p className="text-white/90 font-medium text-lg">
            '너는 혼자가 아니야'라는 가장 선명한 메아리
          </p>
        </div>

        {/* 시작하기/대시보드 버튼 */>
        <button
          type="button"
          onClick={() => {
            if (isAuthenticated) {
              navigate('/dashboard');
            } else {
              navigate('/login');
            }
          }}
          className="flex items-center justify-center bg-white text-blue-600 font-medium px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 min-w-[280px]"
        >
          {isAuthenticated ? '대시보드로 이동' : '시작하기'}
        </button>
      </div>
    </div>
  );
}
