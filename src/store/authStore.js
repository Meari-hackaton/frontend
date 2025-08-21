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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
              credentials: 'include'
            });
            
            if (response.ok) {
              const userData = await response.json();
              set({ 
                user: userData, 
                isAuthenticated: true,
                onboardingCompleted: userData.onboardingCompleted || false,
                loading: false 
              });
              return userData;
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
              method: 'POST',
              credentials: 'include'
            });
            
            if (response.ok) {
              set({ 
                user: null, 
                isAuthenticated: false,
                onboardingCompleted: false
              });
              window.location.href = '/';
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