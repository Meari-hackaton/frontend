import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  withCredentials: true,
  timeout: 120000, // 2분으로 증가
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 요청 전 처리
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 인증 에러 처리
      console.error('401 Unauthorized:', error.response?.config?.url);
      // /login 페이지에서는 리다이렉트하지 않음
      if (!window.location.pathname.includes('/login')) {
        // window.location.href = '/login';
        console.log('Authentication required, but not redirecting for now');
      }
    }
    return Promise.reject(error);
  }
);

export default api;