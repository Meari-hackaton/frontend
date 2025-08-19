// src/pages/LoginPage.jsx
export default function LoginPage() {
  const handleGoogleLogin = () => {
    // REACT_APP_API_URL은 .env에서 설정한 백엔드 주소
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google/callback`;
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
