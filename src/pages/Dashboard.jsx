import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────  공통 작은 컴포넌트  ───────────────────────────────── */
function StatPill({ icon, label, value, unit }) {
  return (
    <div className="flex items-center gap-3 w-[165px] rounded-full bg-white/70 border border-blue-100 px-3 py-2 shadow-[0_6px_22px_rgba(30,64,175,0.10)]">
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600">
        {icon}
      </div>
      <div className="flex-1 text-[13px] text-slate-600">{label}</div>
      <div className="text-[13px] text-blue-700 font-semibold">
        {value} {unit}
      </div>
    </div>
  );
}

function PenIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path strokeWidth="1.6" d="M12.9 5.1l6 6-9.8 9.8H3.1V14.9L12.9 5.1z" />
      <path strokeWidth="1.6" d="M14.3 3.7l2-2a2 2 0 0 1 2.8 0l1.2 1.2a2 2 0 0 1 0 2.8l-2 2" />
    </svg>
  );
}


function Card({ children, className = "" }) {
  return (
    <div
      className={
        "rounded-2xl bg-white/85 border border-blue-100/70 p-5 shadow-[0_18px_40px_rgba(30,64,175,0.12)] backdrop-blur " +
        className
      }
    >
      {children}
    </div>
  );
}

function BellIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path strokeWidth="1.5" d="M12 3a6 6 0 0 0-6 6v3.5L4 14v1h16v-1l-2-1.5V9a6 6 0 0 0-6-6Z" />
      <path strokeWidth="1.5" d="M9 18a3 3 0 0 0 6 0" />
    </svg>
  );
}

function CheckIcon({ done }) {
  return done ? (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600">
      <path fill="currentColor" d="M9.5 16.2 5.8 12.5l1.4-1.4 2.3 2.3 6.3-6.3 1.4 1.4z" />
    </svg>
  ) : (
    <span className="inline-block w-[18px] h-[18px] rounded-[4px] bg-blue-100 border border-blue-200" />
  );
}

/* ─────────────────────────────────  미니 캘린더  ───────────────────────────────── */
function MiniCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0~11

  const { weeks, monthLabel } = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startDay = first.getDay(); // 0 Sun
    const daysInMonth = last.getDate();

    const cells = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    const rows = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

    const label = `${month + 1}월`;
    return { weeks: rows, monthLabel: label };
  }, [year, month]);

  const goPrev = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
  };
  const goNext = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
  };

  const marks = new Set([4,5,6,7,8,9,10,11,12,13,15,16,17]); // 데모 표시

  return (
    <Card className="p-0 overflow-hidden w-[520px]">
      {/* 헤더 */}
      <div className="px-8 pt-6 pb-3">
        <div className="flex items-center justify-center gap-6 text-slate-600">
          <button onClick={goPrev} className="text-slate-400 hover:text-slate-600">◀</button>
          <div className="text-[15px] font-semibold">{monthLabel}</div>
          <button onClick={goNext} className="text-slate-400 hover:text-slate-600">▶</button>
        </div>
      </div>

      {/* 요일 */}
      <div className="grid grid-cols-7 text-center text-[12px] text-slate-400 px-8 pb-2">
        {["일","월","화","수","목","금","토"].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-7 gap-3 px-8 pb-8">
        {weeks.map((row, i) => (
          row.map((d, j) => (
            <div key={`${i}-${j}`} className="h-10 flex items-center justify-center">
              {d ? (
                <div
                  className={
                    "w-10 h-10 flex items-center justify-center rounded-full text-[13px] " +
                    (marks.has(d)
                      ? "bg-blue-100 text-blue-700"
                      : "bg-white border border-blue-100 text-slate-600")
                  }
                >
                  {d}
                </div>
              ) : (
                <div className="w-10 h-10" />
              )}
            </div>
          ))
        ))}
      </div>
    </Card>
  );
}

/* ─────────────────────────────────  메인 페이지  ───────────────────────────────── */
export default function Dashboard() {
  const username = "000님";
  const rituals = [
    { text: "청년 창업 아이디어 피칭데이 참여", done: false },
    { text: "새로운 실로 10분 산책하기", done: true },
    { text: "청년 마음건강 바우처 신청하기", done: true },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 배경 (큰 그라데이션, 중앙이 비어 보이게) */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_48%_55%,rgba(147,197,253,0.46),transparent_60%)]" />

      {/* 상단바(오른쪽 로그인) */}
      <header className="relative z-10 flex items-center justify-end gap-3 w-full max-w-[1280px] mx-auto px-8 pt-7">
        <div className="text-slate-500 text-sm">{username}</div>
        <Link
          to="/login"
          className="rounded-full bg-blue-600 text-white px-5 py-2 text-sm shadow-[0_10px_24px_rgba(30,64,175,0.28)] hover:brightness-110"
        >
          로그인
        </Link>
      </header>

      {/* 본문 레이아웃: 왼쪽 칩, 오른쪽 고정 컬럼 */}
      <main className="relative z-10 w-full max-w-[1280px] mx-auto px-8">
        {/* 왼쪽 작은 칩들 */}
        <section className="pt-6">
          <h2 className="text-[15px] font-semibold text-slate-700 mb-4">활동 카운팅</h2>
          <div className="flex flex-col gap-3">
            <StatPill icon={<span>🔥</span>} label="연속 방문" value={16} unit="일째" />
            <StatPill icon={<span>📍</span>} label="리추얼" value={16} unit="개" />
            <StatPill icon={<span>🎯</span>} label="실천 리추얼" value={13} unit="개" />
          </div>
        </section>

        {/* 우측 컬럼: 화면 오른쪽에 붙여 중앙을 넘지 않도록 고정 폭/위치 */}
        <aside className="pointer-events-none">
          <div className="pointer-events-auto w-[400px] ml-auto mt-[-180px] mr-0 flex flex-col gap-6">
            {/* 오늘의 소식 */}
            <Card className="w-[520px]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BellIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-700 mb-1">오늘의 소식</div>
                  <p className="text-[13px] text-slate-500 leading-relaxed">
                    {username}에게 알맞은 정책 정보가 있습니다. <br />
                    확인해보시겠습니까?
                  </p>
                </div>
              </div>
            </Card>

            {/* 리추얼 실천하기 */}
            <Card className="w-[520px]">
              <div className="font-semibold text-slate-700 mb-4">리추얼 실천하기</div>
              <ul className="flex flex-col gap-4">
                {rituals.map((r, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckIcon done={r.done} />
                    <div className={"text-[14px] " + (r.done ? "text-blue-700" : "text-slate-600")}>
                      {r.text}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            {/* 달력 카드 */}
            <MiniCalendar />
          </div>
        </aside>
      </main>

{/* 하단 CTA (중앙 오른쪽 쪽에 위치) */}
<div className="relative z-10 w-full max-w-[1280px] mx-auto px-8">
  <div className="flex justify-center">
    <div className="translate-x-[10px] pb-8">
      <Link
        to="/steps"
        className="
          inline-flex items-center gap-3
          rounded-full px-6 py-3
          bg-white text-blue-600
          border border-blue-200
          shadow-[0_10px_26px_rgba(30,64,175,0.20)]
          hover:bg-blue-50 hover:shadow-[0_12px_30px_rgba(30,64,175,0.25)]
          transition-colors
        "
      >
        <PenIcon className="w-4 h-4" />
        <span className="text-[14px] font-medium">오늘의 리추얼 받기</span>
        <span className="ml-1 text-[16px]">»»</span>
      </Link>
    </div>
  </div>
</div>


      {/* 좌하단 잎 장식 */}
      <svg
        viewBox="0 0 200 120"
        className="hidden sm:block absolute left-16 bottom-6 w-40 h-28 text-blue-200"
        fill="currentColor"
        opacity={0.7}
      >
        <path d="M90 120h20c0-30-10-45-10-45s-10 15-10 45z" />
        <path d="M80 105c-8 0-25-4-35-10 14-14 41-11 41-11s-3 21-6 21z" />
        <path d="M120 105c8 0 25-4 35-10-14-14-41-11-41-11s3 21 6 21z" />
      </svg>
    </div>
  );
}
