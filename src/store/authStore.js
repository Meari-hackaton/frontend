// src/store/authStore.js
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const authStore = create(
  devtools(
    persist(
      (set) => ({
        // 상태
        user: null,
        isAuthenticated: false,
        onboardingCompleted: false,
        loading: false,
        
        // 액션
        setUser: (user) => set({ 
          user, 
          isAuthenticated: !!user,
          onboardingCompleted: user?.onboardingCompleted || false
        }),
        
        setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
        
        setLoading: (loading) => set({ loading }),
        
        // 인증 체크
        checkAuth: async () => {
          set({ loading: true });
          try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/v1/auth/check`, {
              credentials: 'include'
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data.authenticated) {
                set({ 
                  user: data.user, 
                  isAuthenticated: true,
                  onboardingCompleted: data.user?.onboardingCompleted || false,
                  loading: false 
                });
                return data.user;
              } else {
                set({ 
                  user: null, 
                  isAuthenticated: false,
                  onboardingCompleted: false,
                  loading: false 
                });
                return null;
              }
            } else {
              set({ 
                user: null, 
                isAuthenticated: false,
                onboardingCompleted: false,
                loading: false 
              });
              return null;
            }
          } catch (error) {
            console.error('Auth check failed:', error);
            set({ 
              user: null, 
              isAuthenticated: false,
              onboardingCompleted: false,
              loading: false 
            });
            return null;
          }
        },
        
        // 로그아웃
        logout: async () => {
          try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/v1/auth/logout`, {
              method: 'POST',
              credentials: 'include'
            });
            
            if (response.ok) {
              set({ 
                user: null, 
                isAuthenticated: false,
                onboardingCompleted: false
              });
              window.location.href = '/login';
            }
          } catch (error) {
            console.error('Logout failed:', error);
          }
        },
        
        // 상태 초기화
        clearAuth: () => set({ 
          user: null, 
          isAuthenticated: false,
          loading: false 
        })
      }),
      {
        name: 'auth-storage', // localStorage에 저장될 키 이름
        partialize: (state) => ({ 
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          onboardingCompleted: state.onboardingCompleted
        }) // loading은 저장하지 않음
      }
    )
  )
);

export default authStore;