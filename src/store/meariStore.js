// src/store/meariStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { apiRequest } from '../utils/api';

const meariStore = create(
  devtools(
    (set, get) => ({
      // 상태
      sessions: [],
      currentSession: null,
      messages: [],
      loading: false,
      error: null,
      
      // 세션 관련 액션
      createSession: async (data) => {
        set({ loading: true, error: null });
        try {
          const session = await apiRequest('/api/v1/meari/sessions', {
            method: 'POST',
            body: JSON.stringify(data)
          });
          
          set((state) => ({
            sessions: [...state.sessions, session],
            currentSession: session,
            loading: false
          }));
          
          return session;
        } catch (error) {
          set({ loading: false, error: error.message });
          throw error;
        }
      },
      
      fetchSessions: async () => {
        set({ loading: true, error: null });
        try {
          const sessions = await apiRequest('/api/v1/meari/sessions');
          set({ sessions, loading: false });
          return sessions;
        } catch (error) {
          set({ loading: false, error: error.message });
          throw error;
        }
      },
      
      fetchSession: async (sessionId) => {
        set({ loading: true, error: null });
        try {
          const session = await apiRequest(`/api/v1/meari/sessions/${sessionId}`);
          set({ currentSession: session, loading: false });
          return session;
        } catch (error) {
          set({ loading: false, error: error.message });
          throw error;
        }
      },
      
      // 메시지 관련 액션
      sendMessage: async (sessionId, message) => {
        set({ loading: true, error: null });
        try {
          const response = await apiRequest(`/api/v1/meari/sessions/${sessionId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ message })
          });
          
          set((state) => ({
            messages: [...state.messages, response],
            loading: false
          }));
          
          return response;
        } catch (error) {
          set({ loading: false, error: error.message });
          throw error;
        }
      },
      
      fetchMessages: async (sessionId) => {
        set({ loading: true, error: null });
        try {
          const messages = await apiRequest(`/api/v1/meari/sessions/${sessionId}/messages`);
          set({ messages, loading: false });
          return messages;
        } catch (error) {
          set({ loading: false, error: error.message });
          throw error;
        }
      },
      
      // 상태 초기화
      clearSession: () => set({
        currentSession: null,
        messages: [],
        error: null
      }),
      
      clearAll: () => set({
        sessions: [],
        currentSession: null,
        messages: [],
        loading: false,
        error: null
      })
    })
  )
);

export default meariStore;