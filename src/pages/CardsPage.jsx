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

  useEffect(() => {
    // 1) /cards?step=2 처럼 쿼리스트링으로 온 값 우선 적용
    const params = new URLSearchParams(location.search);
    const qsStep = Number(params.get("step"));

    if ([1, 2, 3].includes(qsStep)) {
      setStep(qsStep);
      return;
    }

    // 2) (보조) history state 로 온 값 적용
    const incoming = location.state?.step;
    if ([1, 2, 3].includes(incoming)) {
      setStep(incoming);
      return;
    }

    // 3) 그 외에는 기본값(1) 유지
  }, [location.search, location.state]);

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
