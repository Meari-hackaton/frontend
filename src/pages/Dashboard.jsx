import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import authStore from '../store/authStore';
import meariService from '../services/meariService';

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

function RitualStatsCard({ year: controlledYear, month: controlledMonth }) {
  // year/month가 props로 주어지면 그걸 쓰고, 아니면 오늘로
  const now = new Date();
  const year = controlledYear ?? now.getFullYear();
  const month = controlledMonth ?? now.getMonth() + 1; // 1~12

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetchStats = async (y, m) => {
    try {
      setLoading(true);
      // 통계 API가 없다면 기본값으로 처리
      const data = {
        monthly: { completed_days: 0, total_days: 30, completion_rate: 0, total_rituals: 0 },
        weekly: []
      };
      setStats(data || null);
      setErr(null);
    } catch (e) {
      console.error(e);
      setErr(e);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(year, month);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const monthly = stats?.monthly || {};
  const weekly = Array.isArray(stats?.weekly) ? stats.weekly : [];

  // 안전한 라벨/수치 추출 (백엔드 필드명이 바뀌어도 최대한 보여주기)
  const getRate = (obj, completedKey = "completed", totalKey = "total") => {
    const rate =
      obj.completion_rate ??
      obj.rate ??
      (obj[completedKey] != null && obj[totalKey] ? Math.round((obj[completedKey] / obj[totalKey]) * 100) : null);
    return rate;
  };

  return (
    <Card className="w-[420px] p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-slate-700 text-[14px]">
          리추얼 통계 <span className="text-slate-400 text-[12px]">{year}년 {month}월</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-4 w-44 bg-slate-200 rounded" />
          <div className="h-4 w-56 bg-slate-200 rounded" />
          <div className="h-4 w-40 bg-slate-200 rounded" />
        </div>
      ) : err ? (
        <div className="text-[13px] text-red-500">통계를 불러오지 못했습니다.</div>
      ) : !stats ? (
        <div className="text-[13px] text-slate-400">데이터가 없습니다.</div>
      ) : (
        <>
          {/* 월 통계 요약 */}
          <div className="grid grid-cols-3 gap-3 text-[12px] text-slate-600 mb-4">
            <div className="rounded-xl bg-white border border-blue-100 px-3 py-2 text-center">
              완료일수<br/>
              <span className="text-[13px] font-semibold text-blue-700">
                {monthly.completed_days ?? monthly.completed ?? "-"}
              </span>
            </div>
            <div className="rounded-xl bg-white border border-blue-100 px-3 py-2 text-center">
              달성률<br/>
              <span className="text-[13px] font-semibold text-blue-700">
                {getRate(monthly, "completed_days", "total_days") ?? "-"}%
              </span>
            </div>
            <div className="rounded-xl bg-white border border-blue-100 px-3 py-2 text-center">
              총 리추얼<br/>
              <span className="text-[13px] font-semibold text-blue-700">
                {monthly.total_rituals ?? monthly.count ?? "-"}
              </span>
            </div>
          </div>

          {/* 주간 분포 */}
          <div>
            <div className="text-[13px] font-medium text-slate-700 mb-2">주간 통계</div>
            {weekly.length === 0 ? (
              <div className="text-[12px] text-slate-400">주간 데이터가 없습니다.</div>
            ) : (
              <ul className="divide-y divide-blue-50 rounded-2xl border border-blue-100 bg-white">
                {weekly.map((w, i) => {
                  const label =
                    w.week_label ||
                    (w.start_date && w.end_date ? `${w.start_date} ~ ${w.end_date}` : `W${i + 1}`);
                  const completed = w.completed_days ?? w.completed ?? w.count ?? 0;
                  const total = w.total_days ?? w.total ?? null;
                  const rate = getRate(w, "completed_days", "total_days");

                  return (
                    <li key={w.id ?? i} className="flex items-center justify-between px-3 py-2">
                      <div className="text-[13px] text-slate-700">{label}</div>
                      <div className="text-[12px] text-slate-500">
                        {total != null ? `${completed}/${total}` : completed} · {rate ?? "-"}%
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </Card>
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
  
  // 날짜별 리츄얼 데이터 (조회/수정)
  const [dateLoading, setDateLoading] = useState(false);
  const [dateErr, setDateErr] = useState(null);
  const [dateData, setDateData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    daily_title: "",
    daily_description: "",
    daily_user_mood: "",
    meari_diary_entry: "",
    meari_selected_mood: "",
  });

  // 공통: 날짜 문자열 추출(백엔드 필드 다양성 방어)
  const getDateStr = (s) =>
    s.date || s.completed_at || s.created_at || s.started_at || s.ended_at || "";

  // 1) 달력 API
  const fetchCalendar = async (y, m0) => {
    try {
      setLoading(true);
      const data = await meariService.getCalendar(y, m0 + 1);
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
      // history API가 없다면 빈 배열로 처리
      const data = { sessions: [] };

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

  // 날짜별 리츄얼 조회
  const fetchDateRitual = async (ymd) => {
    try {
      setDateLoading(true);
      setDateErr(null);
      const data = await meariService.getDateRitual(ymd);
      setDateData(data || null);
      
      // 폼 데이터 설정
      const d = data?.daily_ritual || {};
      const m = data?.meari_ritual || {};
      setForm({
        daily_title: d.title ?? "",
        daily_description: d.description ?? "",
        daily_user_mood: d.user_mood ?? "",
        meari_diary_entry: m.diary_entry ?? "",
        meari_selected_mood: m.selected_mood ?? "",
      });
    } catch (e) {
      console.error("날짜 리츄얼 조회 실패:", e);
      setDateErr(e);
      setDateData(null);
      setForm({
        daily_title: "",
        daily_description: "",
        daily_user_mood: "",
        meari_diary_entry: "",
        meari_selected_mood: "",
      });
    } finally {
      setDateLoading(false);
    }
  };
  
  // 날짜별 리츄얼 저장
  const saveDateRitual = async () => {
    if (!modalDateStr) return;
    try {
      setSaving(true);
      await meariService.updateDateRitual(modalDateStr, {
        allow_completed_edit: false,
        daily_ritual: {
          title: form.daily_title?.trim() || null,
          description: form.daily_description?.trim() || null,
          user_mood: form.daily_user_mood?.trim() || null,
        },
        meari_ritual: {
          diary_entry: form.meari_diary_entry?.trim() || null,
          selected_mood: form.meari_selected_mood?.trim() || null,
        },
      });
      // 저장 후 재조회
      await fetchDateRitual(modalDateStr);
      await fetchCalendar(year, month);
      setEditMode(false);
      alert("저장했어요.");
    } catch (e) {
      console.error("날짜 리츄얼 저장 실패:", e);
      alert("저장에 실패했어요.");
    } finally {
      setSaving(false);
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
    setEditMode(false); // 편집 모드 초기화
    setOpenModal(true);
    fetchDateRitual(ymd); // 날짜별 리츄얼 조회
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
      <Card className="p-0 overflow-hidden w-[380px]">
        {/* 헤더 */}
        <div className="px-5 pt-3 pb-1">
          <div className="flex items-center justify-center gap-4 text-slate-600">
            <button onClick={goPrev} className="text-slate-400 hover:text-slate-600 text-[12px]">◀</button>
            <div className="text-[13px] font-semibold">
              {monthLabel}{" "}
              {(loading || sessionsLoading) && (
                <span className="ml-1 text-[10px] text-slate-400">(불러오는 중)</span>
              )}
            </div>
            <button onClick={goNext} className="text-slate-400 hover:text-slate-600 text-[12px]">▶</button>
          </div>
        </div>

        {/* 요일 */}
        <div className="grid grid-cols-7 text-center text-[9px] text-slate-400 px-5 pb-1">
          {["일","월","화","수","목","금","토"].map((d) => (
            <div key={d} className="py-0">{d}</div>
          ))}
        </div>

        {/* 날짜 */}
        <div className="grid grid-cols-7 gap-1 px-5 pb-3">
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
                        "w-6 h-6 flex items-center justify-center rounded-full text-[10px] transition-all " +
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

      </Card>

      {/* ───────── 날짜별 리츄얼 모달 ───────── */}
      {openModal && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
          <button
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setOpenModal(false)}
          />
          <div className="relative w-full max-w-[600px] mx-3 sm:mx-0 rounded-2xl bg-white border border-blue-100 shadow-[0_24px_60px_rgba(30,64,175,0.25)] p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[16px] font-semibold text-slate-800">{modalDateStr} 리츄얼</div>
              <button
                onClick={() => setOpenModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            {dateLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 w-40 bg-slate-200 rounded" />
                <div className="h-4 w-56 bg-slate-200 rounded" />
                <div className="h-4 w-44 bg-slate-200 rounded" />
              </div>
            ) : dateErr ? (
              <div className="text-[14px] text-red-500">해당 날짜 리츄얼을 불러오지 못했습니다.</div>
            ) : editMode ? (
              // 편집 모드
              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-[14px] font-semibold text-slate-700">일일 리츄얼</h3>
                  <div>
                    <label className="text-[12px] text-slate-500">제목</label>
                    <input
                      value={form.daily_title}
                      onChange={(e) => setForm(f => ({ ...f, daily_title: e.target.value }))}
                      className="w-full rounded-lg border border-blue-100 px-3 py-2 text-[13px] mt-1"
                      placeholder="오늘의 리츄얼 제목"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] text-slate-500">설명</label>
                    <textarea
                      rows={3}
                      value={form.daily_description}
                      onChange={(e) => setForm(f => ({ ...f, daily_description: e.target.value }))}
                      className="w-full rounded-lg border border-blue-100 px-3 py-2 text-[13px] mt-1"
                      placeholder="리츄얼에 대한 설명"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] text-slate-500">기분</label>
                    <input
                      value={form.daily_user_mood}
                      onChange={(e) => setForm(f => ({ ...f, daily_user_mood: e.target.value }))}
                      className="w-full rounded-lg border border-blue-100 px-3 py-2 text-[13px] mt-1"
                      placeholder="오늘의 기분"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-[14px] font-semibold text-slate-700">메아리 일기</h3>
                  <div>
                    <label className="text-[12px] text-slate-500">일기 내용</label>
                    <textarea
                      rows={4}
                      value={form.meari_diary_entry}
                      onChange={(e) => setForm(f => ({ ...f, meari_diary_entry: e.target.value }))}
                      className="w-full rounded-lg border border-blue-100 px-3 py-2 text-[13px] mt-1"
                      placeholder="오늘의 메아리 일기"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] text-slate-500">선택한 감정</label>
                    <input
                      value={form.meari_selected_mood}
                      onChange={(e) => setForm(f => ({ ...f, meari_selected_mood: e.target.value }))}
                      className="w-full rounded-lg border border-blue-100 px-3 py-2 text-[13px] mt-1"
                      placeholder="오늘 느낀 감정"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setEditMode(false)}
                    className="rounded-full border border-slate-200 px-4 py-2 text-[13px] text-slate-600 hover:bg-slate-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={saveDateRitual}
                    disabled={saving}
                    className="rounded-full bg-blue-600 text-white px-4 py-2 text-[13px] hover:brightness-110 disabled:opacity-50"
                  >
                    {saving ? "저장 중..." : "저장"}
                  </button>
                </div>
              </div>
            ) : (
              // 조회 모드
              <div className="space-y-4">
                {dateData?.daily_ritual && (
                  <div className="space-y-2">
                    <h3 className="text-[14px] font-semibold text-slate-700">일일 리츄얼</h3>
                    {dateData.daily_ritual.title && (
                      <div>
                        <span className="text-[12px] text-slate-500">제목: </span>
                        <span className="text-[13px] text-slate-700">{dateData.daily_ritual.title}</span>
                      </div>
                    )}
                    {dateData.daily_ritual.description && (
                      <div>
                        <span className="text-[12px] text-slate-500">설명: </span>
                        <span className="text-[13px] text-slate-700">{dateData.daily_ritual.description}</span>
                      </div>
                    )}
                    {dateData.daily_ritual.user_mood && (
                      <div>
                        <span className="text-[12px] text-slate-500">기분: </span>
                        <span className="text-[13px] text-slate-700">{dateData.daily_ritual.user_mood}</span>
                      </div>
                    )}
                    {dateData.daily_ritual.is_completed && (
                      <div className="text-[12px] text-green-600">✅ 완료됨</div>
                    )}
                  </div>
                )}
                
                {dateData?.meari_ritual && (
                  <div className="space-y-2">
                    <h3 className="text-[14px] font-semibold text-slate-700">메아리 일기</h3>
                    {dateData.meari_ritual.diary_entry && (
                      <div>
                        <span className="text-[12px] text-slate-500">일기: </span>
                        <p className="text-[13px] text-slate-700 whitespace-pre-wrap">{dateData.meari_ritual.diary_entry}</p>
                      </div>
                    )}
                    {dateData.meari_ritual.selected_mood && (
                      <div>
                        <span className="text-[12px] text-slate-500">감정: </span>
                        <span className="text-[13px] text-slate-700">{dateData.meari_ritual.selected_mood}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {!dateData?.daily_ritual && !dateData?.meari_ritual && (
                  <div className="text-[13px] text-slate-500">이 날짜에는 기록이 없어요.</div>
                )}
                
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setOpenModal(false)}
                    className="rounded-full border border-slate-200 px-4 py-2 text-[13px] text-slate-600 hover:bg-slate-50"
                  >
                    닫기
                  </button>
                  <button
                    onClick={() => setEditMode(true)}
                    className="rounded-full bg-blue-600 text-white px-4 py-2 text-[13px] hover:brightness-110"
                  >
                    수정
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ───────────────────────────── 오늘의 리추얼 카드 (조회/완료/생성) ───────────────────────────── */
function TodayRitualCard() {
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
      const data = await meariService.getDailyRituals();
      setRitual(data || null);
      setErr(null);
      setOpenForm(!data); // 오늘 리추얼 없으면 생성 폼 열기
    } catch (e) {
      console.error(e);
      setErr(e);
      setRitual(null);
      setOpenForm(true); // 에러 시에도 폼 열기
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
      await meariService.completeDailyRitual(ritual.id, {
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
      const data = await meariService.createDailyRitual({
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
  
  const [dashboardData, setDashboardData] = useState(null);
  const [todayRitual, setTodayRitual] = useState(null);
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 대시보드 메인 데이터 가져오기
      const dashboard = await meariService.getDashboard();
      setDashboardData(dashboard);
      
      // 오늘의 리츄얼이 있으면 설정
      if (dashboard.today_ritual) {
        setTodayRitual(dashboard.today_ritual);
      }
      
      // 캘린더 데이터 가져오기 (현재 월)
      const today = new Date();
      const calendar = await meariService.getCalendar(today.getFullYear(), today.getMonth() + 1);
      setCalendarData(calendar);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      // 데모 데이터로 대체
      setDashboardData({
        tree: {
          level: 16,
          stage: "growing",
          stage_label: "성장",
          percentage: 57
        },
        statistics: {
          continuous_days: 16,
          total_rituals: 16,
          practiced_rituals: 13,
          monthly_completed: 13
        },
        notifications: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRitualComplete = async () => {
    if (!todayRitual?.id) return;
    
    try {
      const result = await meariService.completeDailyRitual(todayRitual.id, {
        user_note: "오늘의 리츄얼을 완료했습니다",
        user_mood: "calm",
        difficulty_rating: 3
      });
      
      // 완료 상태 업데이트
      setTodayRitual(prev => ({ ...prev, is_completed: true }));
      
      // 통계 업데이트
      setDashboardData(prev => ({
        ...prev,
        statistics: {
          ...prev.statistics,
          practiced_rituals: prev.statistics.practiced_rituals + 1
        }
      }));
    } catch (err) {
      console.error('Failed to complete ritual:', err);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 배경 (큰 그라데이션, 중앙이 비어 보이게) */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_48%_55%,rgba(147,197,253,0.46),transparent_60%)]" />

      {/* 상단바 (로고 왼쪽, 로그인/로그아웃 오른쪽) */}
      <header className="relative z-10 flex items-center justify-between w-full max-w-[1280px] mx-auto px-8 pt-7">
        {/* 메아리 로고 */}
        <Link to="/dashboard" className="flex items-center hover:scale-110 transition-transform">
          <div className="bg-gradient-to-br from-sky-300 to-sky-400 rounded-full p-3 shadow-md">
            <img 
              src={require('../assets/images/meari-logo.png')}
              alt="MEARI"
              className="h-6 w-auto brightness-0 invert"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
        </Link>
        
        {/* 사용자 정보 및 로그인/로그아웃 */}
        <div className="flex items-center gap-3">
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
        </div>
      </header>

      {/* 본문 레이아웃: 왼쪽 칩, 오른쪽 고정 컬럼 */}
      <main className="relative z-10 w-full max-w-[1280px] mx-auto px-8">
        {/* 왼쪽 작은 칩들 */}
        <section className="pt-6">
          <h2 className="text-[15px] font-semibold text-slate-700 mb-4">활동 카운팅</h2>
          <div className="flex flex-col gap-3">
            <StatPill 
              icon={<span>🔥</span>} 
              label="연속 방문" 
              value={dashboardData?.statistics?.continuous_days || 0} 
              unit="일째" 
            />
            <StatPill 
              icon={<span>📍</span>} 
              label="리추얼" 
              value={dashboardData?.statistics?.total_rituals || 0} 
              unit="개" 
            />
            <StatPill 
              icon={<span>🎯</span>} 
              label="실천 리추얼" 
              value={dashboardData?.statistics?.practiced_rituals || 0} 
              unit="개" 
            />
          </div>
        </section>

        {/* 우측 컬럼: 화면 오른쪽에 붙여 중앙을 넘지 않도록 고정 폭/위치 */}
        <aside className="pointer-events-none">
          <div className="pointer-events-auto w-[380px] ml-auto mt-[-200px] mr-0 flex flex-col gap-2">
            {/* 오늘의 소식 */}
            <Card className="w-[380px] p-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <BellIcon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-700 text-[13px]">오늘의 소식</div>
                  <p className="text-[11px] text-slate-500 leading-tight mt-1">
                    {dashboardData?.notifications?.[0]?.message || `${username}에게 알맞은 정책 정보가 있습니다.`} <br />
                    {todayRitual ? '오늘의 리츄얼을 확인해보세요.' : '새로운 리츄얼을 받아보시겠습니까?'}
                  </p>
                </div>
              </div>
            </Card>

            {/* 리추얼 실천하기 */}
            <Card className="w-[380px] p-3">
              <div className="font-semibold text-slate-700 text-[13px] mb-2">오늘의 리추얼</div>
              {loading ? (
                <div className="text-center py-4 text-slate-400 text-[12px]">로딩 중...</div>
              ) : todayRitual ? (
                <div className="flex flex-col gap-2">
                  <div 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={handleRitualComplete}
                  >
                    <CheckIcon done={todayRitual.is_completed} />
                    <div className={"text-[12px] flex-1 " + (todayRitual.is_completed ? "text-blue-700" : "text-slate-600")}>
                      {todayRitual.title}
                    </div>
                  </div>
                  {todayRitual.is_completed && (
                    <div className="text-[10px] text-green-600 ml-6">
                      ✨ 오늘의 리츄얼을 완료했어요!
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-2 text-slate-400 text-[11px]">
                  아직 오늘의 리츄얼이 없어요.
                  <br />
                  <Link to="/steps" className="text-blue-600 hover:underline mt-1 inline-block text-[11px]">
                    리츄얼 받으러 가기 →
                  </Link>
                </div>
              )}
            </Card>

            {/* 마음나무 상태 */}
            {dashboardData?.tree && (
              <Card className="w-[380px] p-3">
                <div className="font-semibold text-slate-700 text-[13px] mb-2">나의 마음나무</div>
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-slate-600">
                      {dashboardData.tree.stage_label} 단계
                    </span>
                    <span className="text-[10px] text-green-600">
                      {dashboardData.tree.level}/28일
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-1 rounded-full transition-all"
                      style={{ width: `${dashboardData.tree.percentage}%` }}
                    />
                  </div>
                  {dashboardData.tree.next_milestone && (
                    <div className="mt-1 text-[9px] text-slate-500">
                      다음 단계까지 {dashboardData.tree.next_milestone - dashboardData.tree.level}일 남았어요
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* 달력 카드 */}
            <MiniCalendar />
          </div>
        </aside>
      </main>

{/* 나무 이미지 (중앙 왼쪽) */}
<div className="absolute bottom-10 left-1/2 transform -translate-x-[350px] z-5">
  <img 
    src={require('../assets/images/tree-asset14.png')}
    alt="마음나무"
    className="h-[350px] w-auto object-contain opacity-95"
    style={{ filter: 'drop-shadow(0 20px 40px rgba(100,150,200,0.12))' }}
  />
</div>

{/* 메아리 실행하기 버튼 (하단 중앙) */}
<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
  <Link to="/steps" className="inline-block hover:scale-105 transition-transform">
    <img 
      src={require('../assets/images/group4480.png')}
      alt="오늘의 리추얼 받기"
      className="h-[40px] w-auto drop-shadow-md"
    />
  </Link>
</div>


    </div>

    
  );
  
}
