import StepBullets from "./StepBullets";

export default function TopBar({ step, setStep }) {
  const tabs = [
    { key: 1, label: "공감의 메아리" },
    { key: 2, label: "성찰의 메아리" },
    { key: 3, label: "성장의 메아리" },
  ];
  return (
    <header className="w-full">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm">
          <span className="text-lg">←</span> Back
        </button>
        <div className="hidden sm:flex items-center gap-3 text-blue-700">
          <button className="p-1">⏮️</button>
          <button className="p-1">⏯️</button>
          <button className="p-1">⏭️</button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4">
        <nav className="flex items-center gap-2 sm:gap-6 justify-center text-sm sm:text-base">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setStep(t.key)}
              className={
                "relative pb-2 px-2 transition " +
                (step === t.key ? "text-blue-700" : "text-slate-400 hover:text-slate-600")
              }
            >
              {t.label}
              <span
                className={
                  "absolute left-1/2 -bottom-0.5 h-0.5 -translate-x-1/2 rounded-full transition-all " +
                  (step === t.key ? "w-16 bg-blue-500" : "w-8 bg-slate-200")
                }
              />
            </button>
          ))}
        </nav>
        <div className="mt-4 mb-2 flex justify-center">
          <StepBullets total={3} active={step} />
        </div>
      </div>
    </header>
  );
}
