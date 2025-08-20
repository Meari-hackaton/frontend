// src/utils/api.js

const API_URL = process.env.REACT_APP_API_URL;

// API 요청 헬퍼 함수
export const apiRequest = async (endpoint, options = {}) => {
  const defaultOptions = {
    credentials: 'include', // 쿠키 자동 포함
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
};

// 인증 관련 API
export const authAPI = {
  // 현재 사용자 정보 가져오기
  getMe: () => apiRequest('/auth/me'),
  
  // 로그아웃
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
};

// Meari API 엔드포인트
export const meariAPI = {
  // 세션 생성
  createSession: (data) => 
    apiRequest('/api/v1/meari/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // 세션 목록 조회
  getSessions: () => 
    apiRequest('/api/v1/meari/sessions'),
  
  // 특정 세션 조회
  getSession: (sessionId) => 
    apiRequest(`/api/v1/meari/sessions/${sessionId}`),
  
  // 메시지 전송
  sendMessage: (sessionId, message) => 
    apiRequest(`/api/v1/meari/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
};