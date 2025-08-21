// src/pages/CardsPage.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import TopBar from "../components/TopBar.jsx";
import EmpathyPage from "./EmpathyPage.jsx";
import ReflectionPage from "./ReflectionPage.jsx";
import GrowthPage from "./GrowthPage.jsx";

export default function CardsPage() {
  const location = useLocation();
  const [step, setStep] = useState(1); // 1: 공감, 2: 성찰, 3: 성장
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    // 세션 데이터 가져오기
    const stateData = location.state?.sessionData;
    const storedData = sessionStorage.getItem('meariSessionData');
    
    console.log('CardsPage - location.state:', location.state);
    console.log('CardsPage - sessionStorage data:', storedData);
    
    if (stateData) {
      console.log('Using state data:', stateData);
      setSessionData(stateData);
    } else if (storedData) {
      console.log('Using stored data:', JSON.parse(storedData));
      setSessionData(JSON.parse(storedData));
    } else {
      console.log('No session data found');
    }

    // 카드 타입에 따라 스텝 설정
    const params = new URLSearchParams(location.search);
    const cardType = params.get("type");
    
    if (cardType === 'empathy') {
      setStep(1);
    } else if (cardType === 'reflection') {
      setStep(2);
    } else if (cardType === 'growth') {
      setStep(3);
    } else {
      // 기존 step 파라미터 처리
      const qsStep = Number(params.get("step"));
      if ([1, 2, 3].includes(qsStep)) {
        setStep(qsStep);
      }
    }
  }, [location.search, location.state]);

  return (
    <div className="min-h-screen text-slate-800">
      <TopBar step={step} setStep={setStep} />

      {step === 1 && <EmpathyPage sessionData={sessionData} />}
      {step === 2 && <ReflectionPage sessionData={sessionData} />}
      {step === 3 && <GrowthPage sessionData={sessionData} />}

      <footer className="py-10 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Echo UI
      </footer>
    </div>
  );
}
