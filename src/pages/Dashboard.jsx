// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import authStore from "../store/authStore";

/* ───────────────────────────── 공통 작은 컴포넌트 ───────────────────────────── */
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

/* ───────────────────────────── 캘린더───────────────────────────── */
function MiniCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0~11

  // 달력 API 데이터
  const [daysMap, setDaysMap] = useState(() => new Map()); // 1~31 -> info(달력 API)
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // 세션 이력(해당 월)
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionDays, setSessionDays] = useState(new Set()); // 1~31
  const [monthSessions, setMonthSessions] = useState([]);    // 해당 월의 세션 목록 원본

  // 모달
  const [openModal, setOpenModal] = useState(false);
  const [modalDateStr, setModalDateStr] = useState(""); // YYYY-MM-DD
  const [modalRows, setModalRows] = useState([]);       // 선택 날짜의 세션들

  const api = axios.create({
    baseURL: import.meta?.env?.VITE_API_BASE_URL || "",
    withCredentials: true,
  });

  // 공통: 날짜 문자열 추출(백엔드 필드 다양성 방어)
  const getDateStr = (s) =>
    s.date || s.completed_at || s.created_at || s.started_at || s.ended_at || "";

  // 1) 달력 API
  const fetchCalendar = async (y, m0) => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/v1/dashboard/calendar", {
        params: { year: y, month: m0 + 1 },
      });
      const map = new Map();
      (data?.days || []).forEach((d) => {
        const dd = Number(d.date?.split("-")?.[2]);
        if (!Number.isNaN(dd)) map.set(dd, d);
      });
      setDaysMap(map);
      setSummary(data?.summary || null);
    } catch (e) {
      console.error("달력 데이터 로드 실패:", e);
      setDaysMap(new Map());
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  // 2) 세션 이력(큰 페이지 하나 받아 월만 필터)
  const fetchSessionsForMonth = async (y, m0) => {
    try {
      setSessionsLoading(true);
      const { data } = await api.get("/api/v1/history/sessions", {
        params: { page: 1, limit: 500 }, // 필요 시 조절
      });

      const list = Array.isArray(data?.sessions) ? data.sessions : [];
      const wantedYM = `${y}-${String(m0 + 1).padStart(2, "0")}-`;

      const setDays = new Set();
      const onlyMonth = [];
      for (const s of list) {
        const ds = getDateStr(s);
        if (typeof ds === "string" && ds.startsWith(wantedYM)) {
          const dd = Number(ds.slice(8, 10));
          if (!Number.isNaN(dd)) {
            setDays.add(dd);
            onlyMonth.push(s);
          }
        }
      }
      setSessionDays(setDays);
      setMonthSessions(onlyMonth);
    } catch (e) {
      console.error("세션 이력 로드 실패:", e);
      setSessionDays(new Set());
      setMonthSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar(year, month);
    fetchSessionsForMonth(year, month);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  // 달력 행/열 계산
  const { weeks, monthLabel } = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startDay = first.getDay();
    const daysInMonth = last.getDate();

    const cells = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    const rows = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

    return { weeks: rows, monthLabel: `${month + 1}월` };
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

  // 표시 우선순위: 완료 > (리추얼있음 || 세션있음) > 기본
  const dayClasses = (d) => {
    const info = daysMap.get(d);
    if (info?.is_completed)
      return "bg-blue-600 text-white shadow-[0_6px_18px_rgba(30,64,175,0.25)]";
    if (info?.has_ritual || sessionDays.has(d))
      return "bg-blue-100 text-blue-700 border border-blue-200";
    return "bg-white border border-blue-100 text-slate-600";
  };

  // 날짜 클릭 → 모달 오픈
  const onClickDay = (d) => {
    if (!d) return;
    const ymd = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    setModalDateStr(ymd);

    const rows = monthSessions.filter((s) => {
      const ds = getDateStr(s);
      return typeof ds === "string" && ds.startsWith(ymd);
    });

    setModalRows(rows);
    setOpenModal(true);
  };

  // 세션 행 표시용 헬퍼
  const renderRow = (s, idx) => {
    const title = s.title || s.name || "(제목 없음)";
    const type = s.type || s.category || "";
    const date = getDateStr(s) || "";
    const duration = s.duration_minutes ?? s.duration ?? "-";
    const status = s.status || (s.is_completed ? "completed" : "pending");

    return (
      <li key={s.id ?? idx} className="flex items-center justify-between py-2 border-t border-blue-50 first:border-t-0">
        <div>
          <div className="font-medium text-slate-800">{title}</div>
          <div className="text-xs text-slate-500">{type} · {date}</div>
        </div>
        <div className="text-xs text-slate-500">
          {duration}분 · {status}
        </div>
      </li>
    );
  };

  return (
    <>
      <Card className="p-0 overflow-hidden w-[520px]">
        {/* 헤더 */}
        <div className="px-8 pt-6 pb-3">
          <div className="flex items-center justify-center gap-6 text-slate-600">
            <button onClick={goPrev} className="text-slate-400 hover:text-slate-600">◀</button>
            <div className="text-[15px] font-semibold">
              {monthLabel}{" "}
              {(loading || sessionsLoading) && (
                <span className="ml-2 text-xs text-slate-400">(불러오는 중)</span>
              )}
            </div>
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
        <div className="grid grid-cols-7 gap-3 px-8 pb-4">
          {weeks.map((row, i) =>
            row.map((d, j) => {
              const info = d ? daysMap.get(d) : null;
              const title = info
                ? `${d}일 • ${
                    info.is_completed ? "완료"
                    : (info.has_ritual || sessionDays.has(d)) ? "기록 있음"
                    : "기록 없음"
                  }${info.ritual_title ? ` • ${info.ritual_title}` : ""}`
                : d ? `${d}일` : "";

              return (
                <div key={`${i}-${j}`} className="h-10 flex items-center justify-center">
                  {d ? (
                    <button
                      onClick={() => onClickDay(d)}
                      title={title}
                      className={
                        "w-10 h-10 flex items-center justify-center rounded-full text-[13px] transition-all " +
                        dayClasses(d)
                      }
                    >
                      {d}
                    </button>
                  ) : (
                    <div className="w-10 h-10" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 요약 */}
        <div className="px-8 pb-6">
          {summary ? (
            <div className="grid grid-cols-3 gap-3 text-[12px] text-slate-600">
              <div className="rounded-xl bg-white border border-blue-100 px-3 py-2 text-center">
                완료일수<br/><span className="text-[13px] font-semibold text-blue-700">{summary.completed_days}</span>
              </div>
              <div className="rounded-xl bg-white border border-blue-100 px-3 py-2 text-center">
                달성률<br/><span className="text-[13px] font-semibold text-blue-700">{summary.completion_rate}%</span>
              </div>
              <div className="rounded-xl bg-white border border-blue-100 px-3 py-2 text-center">
                연속일수<br/><span className="text-[13px] font-semibold text-blue-700">{summary.current_streak}</span>
              </div>
            </div>
          ) : (
            <div className="text-[12px] text-slate-400">요약 정보를 불러오지 못했어요.</div>
          )}
        </div>
      </Card>

      {/* ───────── 모달 ───────── */}
      {openModal && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
          {/* backdrop */}
          <button
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setOpenModal(false)}
            aria-label="close modal backdrop"
          />
          {/* dialog */}
          <div className="relative w-full max-w-[560px] mx-3 sm:mx-0 rounded-2xl bg-white border border-blue-100 shadow-[0_24px_60px_rgba(30,64,175,0.25)] p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[15px] font-semibold text-slate-800">{modalDateStr} 기록</div>
              <button
                onClick={() => setOpenModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
                aria-label="close modal"
              >
                ×
              </button>
            </div>

            {modalRows.length === 0 ? (
              <div className="text-[13px] text-slate-500">이 날짜에는 기록이 없어요.</div>
            ) : (
              <ul className="text-[13px]">
                {modalRows.map((s, idx) => renderRow(s, idx))}
              </ul>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setOpenModal(false)}
                className="rounded-full border border-slate-200 px-4 py-2 text-[13px] text-slate-600 hover:bg-slate-50"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


/* ───────────────────────────── 오늘의 리추얼 카드 (조회/완료/생성) ───────────────────────────── */
function TodayRitualCard() {
  const api = axios.create({
    baseURL: import.meta?.env?.VITE_API_BASE_URL || "",
    withCredentials: true,
  });

  const [ritual, setRitual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // 생성 폼 상태
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "meditation",
    duration_minutes: 10,
    description: "",
  });

  // 완료 폼 상태
  const [openComplete, setOpenComplete] = useState(false);
  const [completeForm, setCompleteForm] = useState({
    difficulty_rating: 2,
    user_mood: "",
    user_note: "",
  });

  const fetchToday = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/v1/dashboard/rituals/today");
      setRitual(data || null);
      setErr(null);
      setOpenForm(!data); // 오늘 리추얼 없으면 생성 폼 열기
    } catch (e) {
      console.error(e);
      setErr(e);
      setRitual(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  const submitComplete = async (e) => {
    e?.preventDefault?.();
    if (!ritual?.id) return;
    try {
      setSubmitting(true);
      await api.patch(`/api/v1/dashboard/rituals/${ritual.id}/complete`, {
        difficulty_rating: Number(completeForm.difficulty_rating) || 0,
        user_mood: (completeForm.user_mood || "").trim(),
        user_note: (completeForm.user_note || "").trim(),
      });
      setOpenComplete(false);
      await fetchToday();
    } catch (e) {
      console.error(e);
      alert("리추얼 완료 처리에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  const create = async (e) => {
    e?.preventDefault?.();
    if (!form.title?.trim()) {
      alert("제목을 입력해 주세요.");
      return;
    }
    try {
      setSubmitting(true);
      const { data } = await api.post("/api/v1/dashboard/rituals", {
        title: form.title.trim(),
        type: form.type,
        duration_minutes: Number(form.duration_minutes) || 0,
        description: form.description?.trim() || "",
      });
      setRitual(data);
      setOpenForm(false);
    } catch (e) {
      console.error(e);
      alert("리추얼 생성에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-[520px]">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-slate-700">리추얼 실천하기</div>

        {ritual && !ritual.is_completed && (
          <button
            onClick={() => setOpenComplete(true)}
            className="rounded-full bg-blue-600 text-white px-3 py-1.5 text-xs hover:brightness-110"
          >
            완료하기
          </button>
        )}
        {!ritual && (
          <button
            onClick={() => setOpenForm((v) => !v)}
            className="rounded-full bg-blue-600 text-white px-3 py-1.5 text-xs hover:brightness-110"
          >
            {openForm ? "닫기" : "리추얼 만들기"}
          </button>
        )}
      </div>

      {loading ? (
        <div className="h-6 w-60 bg-slate-200 rounded animate-pulse" />
      ) : err ? (
        <div className="text-[13px] text-red-500">오늘의 리추얼을 불러오지 못했습니다.</div>
      ) : ritual ? (
        <>
          <div className="flex items-center gap-3">
            <CheckIcon done={ritual.is_completed} />
            <div className={"text-[14px] " + (ritual.is_completed ? "text-blue-700" : "text-slate-700")}>
              {ritual.title}
            </div>
          </div>

          {ritual.description && (
            <p className="mt-2 text-[13px] text-slate-500 leading-relaxed whitespace-pre-line">
              {ritual.description}
            </p>
          )}

          <div className="mt-2 grid grid-cols-3 gap-2 text-[12px] text-slate-600">
            <div className="rounded-xl bg-white border border-blue-100 px-3 py-2 text-center">
              유형<br/><span className="text-[13px] font-semibold text-blue-700">{ritual.type}</span>
            </div>
            <div className="rounded-xl bg-white border border-blue-100 px-3 py-2 text-center">
              난이도<br/><span className="text-[13px] font-semibold text-blue-700">{ritual.difficulty_rating ?? "-"}</span>
            </div>
            <div className="rounded-xl bg-white border border-blue-100 px-3 py-2 text-center">
              소요시간<br/><span className="text-[13px] font-semibold text-blue-700">{ritual.duration_minutes ?? 0}분</span>
            </div>
          </div>

          {ritual.is_completed && (
            <div className="mt-2 text-[12px] text-slate-500">
              {ritual.completed_at && <div>완료시간: {ritual.completed_at}</div>}
              {ritual.user_mood && <div>기분: {ritual.user_mood}</div>}
              {ritual.user_note && <div>메모: {ritual.user_note}</div>}
            </div>
          )}

          {/* 완료 입력 폼 */}
          {openComplete && !ritual.is_completed && (
            <form onSubmit={submitComplete} className="mt-4 p-4 rounded-2xl border border-blue-100 bg-blue-50/40">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[12px] text-slate-500">난이도(1~5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={completeForm.difficulty_rating}
                    onChange={(e) =>
                      setCompleteForm((f) => ({ ...f, difficulty_rating: e.target.value }))
                    }
                    className="w-full rounded-xl border border-blue-100 px-3 py-2 text-[14px]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[12px] text-slate-500">기분</label>
                  <input
                    value={completeForm.user_mood}
                    onChange={(e) => setCompleteForm((f) => ({ ...f, user_mood: e.target.value }))}
                    placeholder="calm, energetic…"
                    className="w-full rounded-xl border border-blue-100 px-3 py-2 text-[14px]"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="text-[12px] text-slate-500">메모</label>
                <textarea
                  rows={3}
                  value={completeForm.user_note}
                  onChange={(e) => setCompleteForm((f) => ({ ...f, user_note: e.target.value }))}
                  placeholder="명상 후 마음이 많이 편안해졌어요"
                  className="w-full rounded-xl border border-blue-100 px-3 py-2 text-[14px]"
                />
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setOpenComplete(false)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-[13px] text-slate-600 hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-blue-600 text-white px-4 py-2 text-[13px] hover:brightness-110 disabled:opacity-60"
                >
                  {submitting ? "저장 중…" : "완료 저장"}
                </button>
              </div>
            </form>
          )}
        </>
      ) : openForm ? (
        <form onSubmit={create} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-2">
            <label className="text-[12px] text-slate-500">제목</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="예: 10분 명상하기"
              className="rounded-xl border border-blue-100 px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] text-slate-500">유형</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full rounded-xl border border-blue-100 px-3 py-2 text-[14px]"
              >
                <option value="meditation">meditation</option>
                <option value="exercise">exercise</option>
                <option value="reading">reading</option>
                <option value="writing">writing</option>
                <option value="etc">etc</option>
              </select>
            </div>
            <div>
              <label className="text-[12px] text-slate-500">소요시간(분)</label>
              <input
                type="number"
                min={0}
                value={form.duration_minutes}
                onChange={(e) => setForm((f) => ({ ...f, duration_minutes: e.target.value }))}
                className="w-full rounded-xl border border-blue-100 px-3 py-2 text-[14px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <label className="text-[12px] text-slate-500">설명</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="조용한 곳에서 호흡에 집중하며 마음을 가라앉히세요…"
              className="rounded-xl border border-blue-100 px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="flex justify-end gap-2 mt-1">
            <button
              type="button"
              onClick={() => setOpenForm(false)}
              className="rounded-full border border-slate-200 px-4 py-2 text-[13px] text-slate-600 hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-blue-600 text-white px-4 py-2 text-[13px] hover:brightness-110 disabled:opacity-60"
            >
              {submitting ? "생성 중..." : "오늘의 리추얼 생성"}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-[13px] text-slate-400">오늘의 리추얼이 없습니다.</div>
      )}
    </Card>
  );
}

/* ───────────────────────────── 메인 페이지 ───────────────────────────── */
export default function Dashboard() {
  const { user, isAuthenticated, logout } = authStore();
  const username = user?.nickname || "사용자님";

  const api = axios.create({
    baseURL: import.meta?.env?.VITE_API_BASE_URL || "",
    withCredentials: true, // 쿠키 세션 사용
  });

  const [dash, setDash] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // streak
  const [streak, setStreak] = useState(null);
  const [streakLoading, setStreakLoading] = useState(true);
  const [streakErr, setStreakErr] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/v1/dashboard/");
      setDash(data);
      setErr(null);
    } catch (e) {
      console.error(e);
      setErr(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStreak = async () => {
    try {
      setStreakLoading(true);
      const { data } = await api.get("/api/v1/dashboard/streak");
      setStreak(data || null);
      setStreakErr(null);
    } catch (e) {
      console.error(e);
      setStreak(null);
      setStreakErr(e);
    } finally {
      setStreakLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchStreak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = dash?.statistics;
  const notificationMsg = dash?.notifications?.[0]?.message;
  const level = dash?.level;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 배경 */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_48%_55%,rgba(147,197,253,0.46),transparent_60%)]" />

      {/* 상단바 */}
      <header className="relative z-50 flex items-center justify-end gap-3 w-full max-w-[1280px] mx-auto px-8 pt-7">
        <div className="text-slate-500 text-sm">{username}</div>
        {isAuthenticated ? (
          <button
            onClick={logout}
            className="rounded-full bg-red-500 text-white px-5 py-2 text-sm shadow-[0_10px_24px_rgba(220,38,38,0.28)] hover:brightness-110"
          >
            로그아웃
          </button>
        ) : (
          <Link
            to="/login"
            className="rounded-full bg-blue-600 text-white px-5 py-2 text-sm shadow-[0_10px_24px_rgba(30,64,175,0.28)] hover:brightness-110"
          >
            로그인
          </Link>
        )}
      </header>

      {/* 본문: 2열 그리드 */}
      <main className="relative z-10 w-full max-w-[1280px] mx-auto px-8 grid grid-cols-[auto_520px] gap-10 items-start">
        {/* 활동 카운팅 */}
        <section className="pt-6">
          <h2 className="text-[15px] font-semibold text-slate-700 mb-4">활동 카운팅</h2>

          {loading ? (
            <div className="flex flex-col gap-3 animate-pulse">
              <div className="h-10 w-[165px] rounded-full bg-slate-200" />
              <div className="h-10 w-[165px] rounded-full bg-slate-200" />
              <div className="h-10 w-[165px] rounded-full bg-slate-200" />
            </div>
          ) : err ? (
            <div className="text-sm text-red-500">대시보드 데이터를 불러오지 못했습니다.</div>
          ) : (
            <div className="flex flex-col gap-3">
              <StatPill icon={<span>🔥</span>} label="연속 방문" value={stats?.continuous_days ?? 0} unit="일째" />
              <StatPill icon={<span>📍</span>} label="리추얼" value={stats?.total_rituals ?? 0} unit="개" />
              <StatPill icon={<span>🎯</span>} label="실천 리추얼" value={stats?.practiced_rituals ?? 0} unit="개" />
            </div>
          )}

          {level && !loading && (
            <div className="mt-5 text-[14px] text-slate-600">
              현재 <span className="font-semibold">{level.stage_label}</span> 단계 · 진행률{" "}
              <span className="font-semibold">{level.percentage}%</span>
            </div>
          )}

          {/* 연속 기록 카드 */}
          <div className="mt-6">
            <Card className="max-w-[520px]">
              <div className="font-semibold text-slate-700 mb-3">연속 기록</div>
              {streakLoading ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 w-40 bg-slate-200 rounded" />
                  <div className="h-4 w-48 bg-slate-200 rounded" />
                  <div className="h-4 w-56 bg-slate-200 rounded" />
                </div>
              ) : streakErr ? (
                <div className="text-[13px] text-red-500">연속 기록을 불러오지 못했습니다.</div>
              ) : streak ? (
                <div className="grid grid-cols-2 gap-3 text-[13px] text-slate-600">
                  <div className="rounded-xl bg-white border border-blue-100 px-3 py-2">
                    현재 연속일<br/><span className="text-blue-700 font-semibold">{streak.current_streak}</span>
                  </div>
                  <div className="rounded-xl bg-white border border-blue-100 px-3 py-2">
                    최장 연속일<br/><span className="text-blue-700 font-semibold">{streak.longest_streak}</span>
                  </div>
                  <div className="rounded-xl bg-white border border-blue-100 px-3 py-2 col-span-2">
                    마지막 활동일<br/><span className="text-blue-700 font-semibold">{streak.last_activity_date}</span>
                  </div>
                  <div className="rounded-xl bg-white border border-blue-100 px-3 py-2">
                    활동한 총 일수<br/><span className="text-blue-700 font-semibold">{streak.total_days_active}</span>
                  </div>
                  <div className="rounded-xl bg-white border border-blue-100 px-3 py-2">
                    완료한 리추얼<br/><span className="text-blue-700 font-semibold">{streak.total_rituals_completed}</span>
                  </div>
                  <div className="rounded-xl bg-white border border-blue-100 px-3 py-2">
                    생성한 리추얼<br/><span className="text-blue-700 font-semibold">{streak.total_rituals_created}</span>
                  </div>
                </div>
              ) : (
                <div className="text-[13px] text-slate-400">표시할 연속 기록이 없어요.</div>
              )}
            </Card>
          </div>
        </section>

        {/* 우측 컬럼 */}
        <aside>
          <div className="w-[520px] ml-auto mr-0 flex flex-col gap-6">
            {/* 오늘의 소식 */}
            <Card>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BellIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-700 mb-1">오늘의 소식</div>
                  <p className="text-[13px] text-slate-500 leading-relaxed">
                    {loading ? "불러오는 중..." : (notificationMsg || "새 소식이 없습니다.")}
                  </p>
                </div>
              </div>
            </Card>

            {/* 오늘의 리추얼 (조회/완료/생성) */}
            <TodayRitualCard />

            {/* 달력 */}
            <MiniCalendar />
          </div>
        </aside>
      </main>

      {/* 하단 CTA */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8">
        <div className="flex justify-center">
          <div className="translate-x-[10px] pb-8">
            <Link
              to="/steps"
              className="inline-flex items-center gap-3 rounded-full px-6 py-3 bg-white text-blue-600 border border-blue-200 shadow-[0_10px_26px_rgba(30,64,175,0.20)] hover:bg-blue-50 hover:shadow-[0_12px_30px_rgba(30,64,175,0.25)] transition-colors"
            >
              <PenIcon className="w-4 h-4" />
              <span className="text-[14px] font-medium">오늘의 리추얼 받기</span>
              <span className="ml-1 text-[16px]">»»</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 좌하단 장식 */}
      <svg
        viewBox="0 0 200 120"
        className="hidden sm:block absolute left-16 bottom-6 w-40 h-28 text-blue-200"
        fill="currentColor"
        opacity={0.7}
      >
        <path d="M90 120h20c0-30-10-45-10-45s-10 15-10 45z" />
        <path d="M80 105c-8 0-25-4-35-10 14-14 41-11 41-11s-3 21-6 21z" />
        <path d="M120 105c8 0 25-4 35-10-14-14 41-11 41-11s3 21 6 21z" />
      </svg>
    </div>
  );
}
