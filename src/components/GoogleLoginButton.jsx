// src/components/GoogleLoginButton.jsx
import React from "react";

const GoogleLoginButton = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
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
