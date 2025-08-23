import api from './api';

const meariService = {
  // 현재 세션 조회
  async getCurrentSession() {
    try {
      const response = await api.get('/api/v1/meari/sessions');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch current session:', error);
      throw error;
    }
  },

  // 새로운 세션 생성 (온보딩 시 사용)
  async createSession(data) {
    try {
      const response = await api.post('/api/v1/meari/sessions', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create session:', error);
      throw error;
    }
  },

  // 성장 콘텐츠 생성
  async createGrowthContents(data) {
    try {
      const response = await api.post('/api/v1/meari/growth-contents', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create growth contents:', error);
      throw error;
    }
  },

  // 대시보드 데이터 조회
  async getDashboard() {
    try {
      const response = await api.get('/api/v1/dashboard/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
      throw error;
    }
  },
  
  // 일일 리츄얼 조회
  async getDailyRituals() {
    try {
      const response = await api.get('/api/v1/dashboard/rituals/today');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch daily rituals:', error);
      throw error;
    }
  },

  // 일일 리츄얼 생성
  async createDailyRitual(data) {
    try {
      const response = await api.post('/api/v1/dashboard/rituals', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create daily ritual:', error);
      throw error;
    }
  },

  // 일일 리츄얼 수정
  async updateDailyRitual(id, data) {
    try {
      const response = await api.put(`/api/v1/dashboard/rituals/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update daily ritual:', error);
      throw error;
    }
  },

  // 일일 리츄얼 삭제
  async deleteDailyRitual(id) {
    try {
      const response = await api.delete(`/api/v1/dashboard/rituals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete daily ritual:', error);
      throw error;
    }
  },

  // 일일 리츄얼 완료 처리
  async completeDailyRitual(id, data = {}) {
    try {
      const response = await api.patch(`/api/v1/dashboard/rituals/${id}/complete`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to complete daily ritual:', error);
      throw error;
    }
  },
  
  // 캘린더 데이터 조회
  async getCalendar(year, month) {
    try {
      const response = await api.get('/api/v1/dashboard/calendar', {
        params: { year, month }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch calendar:', error);
      throw error;
    }
  },
  
  // 연속 기록 조회
  async getStreak() {
    try {
      const response = await api.get('/api/v1/dashboard/streak');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch streak:', error);
      throw error;
    }
  },
  
  // 특정 날짜의 리츄얼 조회
  async getDateRitual(targetDate) {
    try {
      const response = await api.get(`/api/v1/calendar/date/${targetDate}/ritual`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch date ritual:', error);
      throw error;
    }
  },
  
  // 특정 날짜의 리츄얼 수정
  async updateDateRitual(targetDate, data) {
    try {
      const response = await api.put(`/api/v1/calendar/date/${targetDate}/ritual`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update date ritual:', error);
      throw error;
    }
  },

  // 메아리 일기 작성
  async createDiary(data) {
    try {
      const response = await api.post('/meari-diary', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create diary:', error);
      throw error;
    }
  },

  // 메아리 일기 목록 조회
  async getDiaries(params = {}) {
    try {
      const response = await api.get('/meari-diary', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch diaries:', error);
      throw error;
    }
  },

  // 특정 메아리 일기 조회
  async getDiary(id) {
    try {
      const response = await api.get(`/meari-diary/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch diary:', error);
      throw error;
    }
  },
  
  // 28일 완주 여부 확인
  async checkCompletion() {
    try {
      const response = await api.get('/api/v1/completion/check');
      return response.data;
    } catch (error) {
      console.error('Failed to check completion:', error);
      throw error;
    }
  },
  
  // 28일 완주 리포트 생성
  async generateCompletionReport() {
    try {
      const response = await api.get('/api/v1/completion/report');
      return response.data;
    } catch (error) {
      console.error('Failed to generate completion report:', error);
      throw error;
    }
  },

  // MIDI 음악 생성
  async getMidiMusic() {
    try {
      const response = await api.get('/api/v1/create-midi', {
        responseType: 'blob'
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error('Failed to create MIDI music:', error);
      throw error;
    }
  }
};

export default meariService;