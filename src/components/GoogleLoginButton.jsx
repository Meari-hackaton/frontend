// src/components/GoogleLoginButton.jsx
import React from "react";

const GoogleLoginButton = () => {
  const handleLogin = () => {
    // 백엔드 OAuth 시작점으로 리다이렉트
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google/login`;
  };

  return (
    <button 
      onClick={handleLogin}
      className="px-4 py-2 bg-blue-500 text-white rounded-md"
    >
      구글 로그인
    </button>
  );
};

export default GoogleLoginButton;
