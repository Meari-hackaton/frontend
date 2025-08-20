// src/components/TodayRitualCard.jsx
import { useEffect, useState } from "react";
import axios from "axios";

// 체크박스 UI 재사용용 (필요 없으면 간단 span으로 바꿔도 됨)
function CheckIcon({ done }) {
  return done ? (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600">
      <path fill="currentColor" d="M9.5 16.2 5.8 12.5l1.4-1.4 2.3 2.3 6.3-6.3 1.4 1.4z" />
    </svg>
  ) : (
    <span className="inline-block w-[18px] h-[18px] rounded-[4px] bg-blue-100 border border-blue-200" />
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={"rounded-2xl bg-white/85 border border-blue-100/70 p-5 shadow-[0_18px_40px_rgba(30,64,175,0.12)] " + className}>
      {children}
    </div>
  );
}

export default function TodayRitualCard() {
  const api = axios.create({
    baseURL: import.meta?.env?.VITE_API_BASE_URL || "",
    withCredentials: true, // 쿠키(me ari_session) 기반 인증일 때 필요
  });

  const [ritual, setRitual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchToday = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/v1/dashboard/rituals/today");
      setRitual(data || null);
      setErr(null);
    } catch (e) {
      console.error(e);
      setErr(e);
      setRitual(null);
    } finally {
      setLoading(false);
    }
  };

  const complete = async () => {
    if (!ritual?.id || ritual.is_completed) return;
    try {
      setSubmitting(true);
      await api.patch(`/api/v1/dashboard/rituals/${ritual.id}/complete`);
      await fetchToday();
    } catch (e) {
      console.error(e);
      alert("리추얼 완료 처리에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  return (
    <Card className="w-[520px]">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-slate-700">리추얼 실천하기</div>
        {ritual && !ritual.is_completed && (
          <button
            onClick={complete}
            disabled={submitting}
            className="rounded-full bg-blue-600 text-white px-3 py-1.5 text-xs hover:brightness-110 disabled:opacity-60"
          >
            {submitting ? "처리 중..." : "완료하기"}
          </button>
        )}
      </div>

      {loading ? (
        <div className="h-6 w-60 bg-slate-200 rounded animate-pulse" />
      ) : err ? (
        <div className="text-[13px] text-red-500">오늘의 리추얼을 불러오지 못했습니다.</div>
      ) : ritual ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <CheckIcon done={ritual.is_completed} />
            <div className={"text-[14px] " + (ritual.is_completed ? "text-blue-700" : "text-slate-700")}>
              {ritual.title}
            </div>
          </div>

          {ritual.description && (
            <p className="text-[13px] text-slate-500 leading-relaxed whitespace-pre-line">
              {ritual.description}
            </p>
          )}

          <div className="grid grid-cols-3 gap-2 text-[12px] text-slate-600">
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

          {/* 완료된 경우 메모/기분 표시 */}
          {ritual.is_completed && (
            <div className="mt-2 text-[12px] text-slate-500">
              {ritual.completed_at && <div>완료시간: {ritual.completed_at}</div>}
              {ritual.user_mood && <div>기분: {ritual.user_mood}</div>}
              {ritual.user_note && <div>메모: {ritual.user_note}</div>}
            </div>
          )}
        </div>
      ) : (
        <div className="text-[13px] text-slate-400">오늘의 리추얼이 없습니다.</div>
      )}
    </Card>
  );
}
