// src/App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

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
import Signup from "./pages/Signup"; 
import GreetingPage from "./pages/GreetingPage.jsx";
/** 카드(공감/성찰/성장) 화면 – 루트("/")에서 사용 */

console.log("ENV:", import.meta.env);

function Cardspage() {
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

export default function App() {
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
        <Route path="/connect/info" element={<InfoConnect />} />
        <Route path="/connect/experience" element={<ExperienceConnect />} />
        <Route path="/connect/support" element={<SupportConnect />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cards" element={<CardsPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/greeting" element={<GreetingPage />} />
        {/* 404 */}
        <Route path="*" element={<div style={{ padding: 40 }}>404</div>} />
      </Routes>
    </BrowserRouter>
  );
}