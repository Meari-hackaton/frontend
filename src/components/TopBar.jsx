// src/components/TopBar.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MidiPlayer from "./MidiPlayer";

function Tab({ label, active, onClick }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      className="flex flex-col items-center gap-2 px-2 focus:outline-none"
    >
      <span
        className={
          (active
            ? "text-blue-600 font-semibold"
            : "text-slate-400 hover:text-slate-600") +
          " text-[12px] sm:text-[13px] transition"
        }
      >
        {label}
      </span>
      <span
        className={
          "h-2 w-36 rounded-full transition-all " +
          (active ? "bg-blue-500" : "bg-slate-300")
        }
      />
    </button>
  );
}

function NowPlaying() {
  const [musicStarted, setMusicStarted] = useState(false);
  
  // 페이지 로드 후 1초 뒤에 음악 플레이어 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      setMusicStarted(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="hidden md:block">
      {musicStarted && <MidiPlayer autoPlay={true} />}
    </div>
  );
}

export default function TopBar({ step, setStep }) {
  const navigate = useNavigate();
  const tabs = [
    { key: 1, label: "공감의 메아리" },
    { key: 2, label: "성찰의 메아리" },
    { key: 3, label: "성장의 메아리" },
  ];

  return (
    <header className="w-full bg-gradient-to-b from-white to-[#f7fbff]">
      <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-3 items-center">
        {/* Left: Back */}
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7 7-7"
              />
              <line x1="3" y1="12" x2="21" y2="12" />
            </svg>
            <span className="text-lg font-bold">Back</span>
          </button>
        </div>

        {/* Center: Tabs */}
        <nav
          role="tablist"
          aria-label="Echo steps"
          className="flex flex-col items-center"
        >
          <div className="flex items-center justify-center gap-10">
            {tabs.map((t) => (
              <Tab
                key={t.key}
                label={t.label}
                active={step === t.key}
                onClick={() => setStep(t.key)}
              />
            ))}
          </div>
        </nav>

        {/* Right: Player */}
        <div className="flex justify-end">
          <NowPlaying />
        </div>
      </div>

      <div className="h-6" />
    </header>
  );
}
