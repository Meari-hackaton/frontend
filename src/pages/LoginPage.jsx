// src/pages/LoginPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authStore from '../store/authStore';
import GoogleIcon from '../components/Icons/GoogleIcon';
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, setUser } = authStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // 1) 커스텀 버튼용 구글 로그인 훅
  const login = useGoogleLogin({
    flow: 'implicit',              // 프론트 전용(백엔드 교환 없이 access_token)
    scope: 'openid email profile', // 필요시 추가 스코프
    ux_mode: 'popup',
    onSuccess: async (tokenResponse) => {
      try {
        // 2) access_token으로 구글 프로필 조회
        const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await resp.json(); // { sub, email, name, picture, ... }

        // 3) 프론트 상태 업데이트
        setUser({
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          avatar: profile.picture,
          provider: 'google',
        });

        // 4) (선택) 서버에 프로필 전달
        //    *나중에 백엔드 검증 붙일 계획이면 id_token도 함께 보내는 구조를 추천
        await fetch(`${process.env.REACT_APP_API_URL}/auth/google/client-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            profile,                     // 지금은 프로필만 사용
            // id_token: ???  // implicit 흐름에선 기본적으로 access_token만 옵니다.
          }),
        });

        navigate('/dashboard');
      } catch (e) {
        console.error(e);
      }
    },
    onError: (err) => {
      console.error('Google login failed', err);
    },
  });

  // 5) 기존 UI 유지하고 onClick만 변경
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <img
          src={require('../assets/images/Group 4491.png')}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div className="mb-6">
          <img
            src={require('../assets/images/meari-logo.png')}
            alt="MEARI Logo"
            className="w-20 h-auto"
          />
        </div>

        <div className="text-center mb-12 max-w-md">
          <p className="text-white text-lg leading-relaxed mb-2">
            세상의 소음 속에서 길을 잃은 당신에게,
          </p>
          <p className="text-white/90 font-medium text-lg">
            '너는 혼자가 아니야'라는 가장 선명한 메아리
          </p>
        </div>

        {/* ✅ UI 그대로, 동작만 구글 팝업으로 */}
        <button
          onClick={() => login()}
          className="flex items-center justify-center gap-3 bg-white text-blue-600 font-medium px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 min-w-[280px]"
        >
          <GoogleIcon className="w-5 h-5" />
          구글로 시작하기
        </button>
      </div>
    </div>
  );
}
