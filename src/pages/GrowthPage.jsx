// src/pages/GrowthPage.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

export default function GrowthPage() {
  const navigate = useNavigate();

  // ✅ 각 알약을 독립적으로 토글
  const [open, setOpen] = useState({ info: false, exp: false, sup: false });
  const toggle = (key) => setOpen((p) => ({ ...p, [key]: !p[key] }));

  return (
    <PageWrapper
      title="성장의 메아리"
      subtitle={
        // 서브카피 2줄 + 브라운톤
        <span className="block text-[#6b4a2f]">
          <span>당신의 작은 용기가 곧 변화의 시작이 될 거예요.</span>
          <br />
          <span>천천히, 함께 세상을 향해 나아가볼까요?</span>
        </span>
      }
      tags={["진로/취업", "취업이 계속 안돼요"]}
    >
      {/* 중앙 라디얼 블루 하이라이트 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[36%] h-[720px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(600px_420px_at_center,rgba(118,163,255,0.32),transparent_65%)]" />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 pt-8 md:grid-cols-3">
        {/* 정보 연결 */}
        <PillColumn
          title={"도움이 될만한\n정보를 얻고 싶다면?"}
          label="정보 연결"
          active={open.info}
          onToggle={() => toggle("info")}
        >
          <PanelCard>
            <PanelHeader>최신 검색 결과</PanelHeader>
            <PanelTitle>시청에서 ‘청년 창업 아이디어 피칭데이’ 개최</PanelTitle>
            <PanelBody>
              참여 대상: 예비청년 창업자(만 39세 이하), 선착순 50팀 모집. 우수팀에 사업화 지원금, 입주 공간 제공.
              <br />
              행사 일시: 9월 토요일 14:00
            </PanelBody>
            <PanelCta onClick={() => navigate("/connect/info")}>바로가기</PanelCta>
          </PanelCard>
        </PillColumn>

        {/* 경험 연결 */}
        <PillColumn
          title={"힐링 경험을\n체험하고 싶다면?"}
          label="경험 연결"
          active={open.exp}
          onToggle={() => toggle("exp")}
        >
          <PanelCard>
            <PanelHeader>오늘의 미션!</PanelHeader>
            <PanelTitle>새로운 길로 10분 산책하기</PanelTitle>
            <PanelTip>
              Tip: 산책 중 ‘오늘의 마음’을 대표하는 장면 사진 찍기
              <br />
              효과: 스트레스 완화, 일상 리듬 회복
            </PanelTip>
          </PanelCard>
        </PillColumn>

        {/* 지원 연결 */}
        <PillColumn
          title={"나한테 맞는 정책과\n지원들이 궁금하다면?"}
          label="지원 연결"
          active={open.sup}
          onToggle={() => toggle("sup")}
        >
          <PanelCard>
            <PanelHeader>나를 위한 정책</PanelHeader>
            <PanelTitle>청년 마음건강 바우처</PanelTitle>
            <PanelBody>
              대상: 만 19–34세 / 1인당 연 6회 심리상담 지원
              <br />
              신청: 정부24 – ‘마음건강 바우처’ 검색
              <br />
              마감: 2월 예정
            </PanelBody>
            <PanelCta onClick={() => navigate("/connect/support")}>바로가기</PanelCta>
          </PanelCard>
        </PillColumn>
      </div>
    </PageWrapper>
  );
}

/* ================= Subcomponents ================= */

function PillColumn({ title, label, active, onToggle, children }) {
  const [line1, line2 = ""] = String(title).split("\n");

  return (
    <div className="relative">
      {/* 비행기 + 제목 (중앙 정렬) */}
      <div className="mb-4 flex flex-col items-center text-center gap-2">
        <Airplane className="h-8 w-8 text-[#497BFF]" />
        <div className="text-[17px] md:text-[18px] font-semibold leading-[1.35] text-[#6b4a2f]">
          <span className="block">{line1}</span>
          {line2 && <span className="block">{line2}</span>}
        </div>
      </div>

      {/* 알약 버튼: 기본(통통 96px) → 활성(얇음 56px) */}
      <motion.button
        layout
        onClick={onToggle}
        className="mx-auto block w-full max-w-[400px]"
        initial={false}
        animate={active ? "active" : "idle"}
        variants={{
          idle: {
            height: 96,
            borderRadius: 999,
            boxShadow: "0px 28px 52px rgba(82,127,255,0.30)",
          },
          active: {
            height: 56,
            borderRadius: 999,
            boxShadow: "0px 18px 30px rgba(82,127,255,0.22)",
          },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <div className="grid h-full w-full place-items-center rounded-full bg-gradient-to-r from-[#d8e7ff] via-[#edf4ff] to-[#d8e7ff]">
          <span className="text-[16px] font-semibold text-[#6e98ff]">{label}</span>
        </div>
      </motion.button>

      {/* 패널: 버튼 바로 아래 스르륵 */}
      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 14, scale: 1 }}
            exit={{ opacity: 0, y: 22, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="mx-auto mt-5 w-[94%] max-w-[400px]"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PanelCard({ children }) {
  return (
    <div className="rounded-[24px] bg-white/94 p-6 text-center shadow-[0_36px_70px_rgba(82,127,255,0.24)] backdrop-blur">
      {children}
    </div>
  );
}

// ✅ 브라운톤 텍스트, 라인은 제거
function PanelHeader({ children }) {
  return (
    <div className="text-center text-[12px] font-semibold text-[#6b4a2f]">
      {children}
    </div>
  );
}

function PanelTitle({ children }) {
  return (
    <h3 className="mt-2 text-center text-[18px] font-bold leading-7 text-[#3b5ed3]">
      {children}
    </h3>
  );
}

// 본문 왼쪽 정렬
function PanelBody({ children }) {
  return <p className="mt-3 text-left text-[14px] leading-7 text-slate-600">{children}</p>;
}

function PanelTip({ children }) {
  return (
    <div className="mt-3 rounded-[16px] bg-[#f3f7ff] p-4 text-left text-[13px] text-[#6881bf]">
      {children}
    </div>
  );
}

function PanelCta({ children, ...props }) {
  return (
    <div className="mt-5 flex items-center justify-center">
      <button
        {...props}
        className="rounded-full bg-[#497BFF] px-6 py-2.5 text-[14px] font-semibold text-white shadow-[0_14px_24px_rgba(73,123,255,0.35)] hover:brightness-105"
      >
        {children}
      </button>
    </div>
  );
}

/* 간단 종이비행기 아이콘 */
function Airplane({ className = "" }) {
  return (
    <svg viewBox="0 0 60 40" className={className} fill="none" stroke="currentColor">
      <path d="M0 0 L60 20 L0 40 L12 26 L12 14 Z" fill="white" />
      <path d="M12 14 L50 20 L12 26" />
    </svg>
  );
}
