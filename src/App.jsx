// src/App.jsx
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import authStore from "./store/authStore";

// pages
import LoginPage from "./pages/LoginPage.jsx";
import StartPage from "./pages/StartPage.jsx";
import CardsPage from "./pages/CardsPage.jsx";
import StepsWizard from "./pages/StepsWizard.jsx";
import EchoLanding from "./pages/EchoLanding.jsx";
import EchoCardsPage from "./pages/EchoCardsPage.jsx";
import InfoConnect from "./pages/Connect/InfoConnect.jsx";
import ExperienceConnect from "./pages/Connect/ExperienceConnect.jsx";
import SupportConnect from "./pages/Connect/SupportConnect.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Signup from "./pages/Signup"; 
import GreetingPage from "./pages/GreetingPage.jsx";
import CompletionReport from "./pages/CompletionReport.jsx";
import GrowthPage from "./pages/GrowthPage.jsx";
// Protected Route 컴포넌트
function ProtectedRoute({ children, requireOnboarding = false }) {
  const { isAuthenticated, onboardingCompleted, loading, checkAuth } = authStore();
  
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      checkAuth();
    }
  }, [isAuthenticated, loading, checkAuth]);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // 온보딩이 필요한 페이지인데 완료하지 않은 경우
  if (requireOnboarding && !onboardingCompleted) {
    return <Navigate to="/steps" replace />;
  }
  
  return children;
}

export default function App() {
  const checkAuth = authStore((state) => state.checkAuth);
  
  // 앱 시작 시 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return (
    <BrowserRouter>
      <Routes>
        {/* 루트: 카드 화면 */}
        <Route path="/" element={<StartPage />} />

        {/* 시작/로그인/스텝/메아리 랜딩 */}
        <Route path="/start" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/steps" element={<StepsWizard />} />
        <Route path="/echo" element={<EchoLanding />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/greeting" element={<GreetingPage />} />
        
        {/* Protected Routes - 로그인 필요 */}
        <Route path="/connect/info" element={
          <ProtectedRoute>
            <InfoConnect />
          </ProtectedRoute>
        } />
        <Route path="/connect/experience" element={
          <ProtectedRoute>
            <ExperienceConnect />
          </ProtectedRoute>
        } />
        <Route path="/connect/support" element={
          <ProtectedRoute>
            <SupportConnect />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/cards" element={
          <ProtectedRoute>
            <CardsPage />
          </ProtectedRoute>
        } />
        <Route path="/completion" element={
          <ProtectedRoute>
            <CompletionReport />
          </ProtectedRoute>
        } />
        <Route path="/growth" element={
          <ProtectedRoute>
            <GrowthPage />
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<div style={{ padding: 40 }}>404</div>} />
      </Routes>
    </BrowserRouter>
  );
}