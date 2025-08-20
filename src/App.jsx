// src/App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import authStore from "./store/authStore";

// components
import TopBar from "./components/TopBar.jsx";

// pages (각 파일은 이미 만들어 둔 걸 가정)
import EmpathyPage from "./pages/EmpathyPage.jsx";
import ReflectionPage from "./pages/ReflectionPage.jsx";
import GrowthPage from "./pages/GrowthPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import StartPage from "./pages/StartPage.jsx";
import CardsPage from "./pages/CardsPage.jsx";
import StepsWizard from "./pages/StepsWizard.jsx";
import EchoLanding from "./pages/EchoLanding.jsx";
import InfoConnect from "./pages/Connect/InfoConnect.jsx";
import ExperienceConnect from "./pages/Connect/ExperienceConnect.jsx";
import SupportConnect from "./pages/Connect/SupportConnect.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DashboardAuth from "./pages/DashboardAuth.jsx";
/** 카드(공감/성찰/성장) 화면 – 루트("/")에서 사용 */

// 카드 페이지 컴포넌트 (현재 사용 안함)
function CardsPageWithTabs() {
  const location = useLocation();
  const [step, setStep] = useState(1); // 1: 공감, 2: 성찰, 3: 성장

  // /echo 등에서 navigate("/", { state: { step: 2 } }) 식으로 온 초기 탭 적용
  useEffect(() => {
    const incoming = location.state?.step;
    if (incoming === 1 || incoming === 2 || incoming === 3) {
      setStep(incoming);
    }
    // 상태를 재사용할 필요 없으면 history state를 비워도 됨(선택)
    // window.history.replaceState({}, document.title, window.location.pathname);
  }, [location.state]);

  return (
    <div className="min-h-screen text-slate-800">
      <TopBar step={step} setStep={setStep} />
      {step === 1 && <EmpathyPage />}
      {step === 2 && <ReflectionPage />}
      {step === 3 && <GrowthPage />}
      <footer className="py-10 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Echo UI
      </footer>
    </div>
  );
}

// Protected Route 컴포넌트
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, checkAuth } = authStore();
  
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

        {/* 404 */}
        <Route path="*" element={<div style={{ padding: 40 }}>404</div>} />
      </Routes>
    </BrowserRouter>
  );
}