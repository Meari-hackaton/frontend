import React from "react";
import PageWrapper from "../components/PageWrapper";
import AirplaneIcon from "../components/AirplaneIcon";

// 공감 페이지와 동일한 Card 컴포넌트 사용
function Card({ children, className = "" }) {
  return (
    <div
      className={[
        "relative overflow-hidden",
        "rounded-[999px] border border-blue-300/70",
        "bg-gradient-to-b from-blue-100/70 via-blue-50/70 to-white/80 backdrop-blur-xl",
        "shadow-[0_18px_40px_rgba(37,99,235,0.20)]",
        "px-8 py-10 md:px-12 md:py-14",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[999px] bg-gradient-to-b from-white/50 via-transparent to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function ReflectionPage({ sessionData }) {
  // 세션 데이터에서 성찰 카드 가져오기
  console.log('ReflectionPage sessionData:', sessionData);
  const reflectionCard = sessionData?.cards?.reflection;
  
  // cards 배열이 있으면 사용, 없으면 기본값 사용
  const items = reflectionCard?.cards ? 
    reflectionCard.cards.map((card, index) => ({
      title: card.title,
      content: card.content,
      news_title: card.news_title,
      news_link: card.news_link,
      news_provider: card.news_provider,
      news_date: card.news_date,
      key_points: card.key_points || []
    })) : 
    [
      {
        title: "뉴스가 말해주는 진짜 이유",
        content: "직장인 70%가 번아웃 경험. 과도한 업무량과 성과 압박이 주요 원인입니다.",
        news_title: "MZ세대 직장인 번아웃 실태",
        news_provider: "한국경제",
        news_date: "2024년 12월",
        key_points: ["구조적 문제", "사회 현상"]
      },
      {
        title: "왜 이런 일이 생기는 걸까요?",
        content: "청년 직장인 대부분이 비슷한 어려움을 겪고 있어요. 혼자가 아닙니다.",
        news_title: "무한경쟁 사회, 청년들의 고민",
        news_provider: "중앙일보",
        news_date: "2024년 11월",
        key_points: ["공통 경험", "함께 극복"]
      },
      {
        title: "희망적인 변화들도 있어요",
        content: "근로자지원프로그램 등 실질적 지원이 확대되고 있습니다.",
        news_title: "청년 지원 정책 확대",
        news_provider: "연합뉴스",
        news_date: "2024년 12월",
        key_points: ["정부 지원", "기관 노력"]
      }
    ];

  // insights 정보 추출 (태그 표시용)
  const tags = reflectionCard?.insights ? 
    [reflectionCard.insights.problem || "청년 문제"] :
    ["진로/취업", "번아웃"];

  return (
    <PageWrapper
      title={reflectionCard?.title || "성찰의 메아리"}
      titleClass="text-[#5C4033]" // 제목 색상 브라운 (공감과 동일)
      subtitle={
        <span className="text-[#6B4F3B]">
          당신의 상황을 데이터와 뉴스로 객관적으로 바라봅니다. <br className="hidden md:inline" />
          AI가 관련성 높은 최신 뉴스를 분석해 구조적 원인을 찾아드려요.
        </span>
      }
      tags={tags}
      tagClass="bg-white text-blue-600 border border-blue-200 shadow-sm"
    >
      
      <div className="relative">
        {/* 하단 강조 그라데이션 */}
        <div aria-hidden className="absolute inset-x-0 -bottom-28 h-48 blur-2xl z-0">
          <div className="mx-auto h-full w-7/12 rounded-full bg-gradient-to-t from-blue-200/90 via-blue-100/70 to-transparent" />
        </div>

        {/* 연결 곡선 */}
        <svg
          aria-hidden
          viewBox="0 0 1200 200"
          className="pointer-events-none absolute left-1/2 top-16 hidden -translate-x-1/2 md:block w-[90%] text-blue-400/70 z-0"
        >
          <path
            d="M0 150 C 250 80, 450 220, 600 130 S 950 80, 1200 150"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>

        <div className="relative grid gap-6 md:grid-cols-3 z-10">
          {items.map((item, i) => (
            <Card key={i}>
              <div className="flex flex-col items-center text-center gap-6">
                <AirplaneIcon className="w-9 h-9 text-blue-600" />

                {/* 카드 제목 (1,2,3 대신) */}
                <h3 className="text-lg md:text-xl font-bold text-[#5C4033]">
                  {item.title}
                </h3>

                {/* 간결한 내용 */}
                <p className="text-sm md:text-base leading-relaxed text-slate-700">
                  {item.content}
                </p>

                {/* 뉴스 정보 */}
                <p className="text-xs md:text-sm text-slate-500">
                  [ {item.news_provider} - {item.news_date} ]
                </p>

                {/* 뉴스 제목 */}
                <p className="text-xs md:text-sm font-medium text-slate-600">
                  "{item.news_title}"
                </p>

                {/* 뉴스 링크 */}
                {item.news_link ? (
                  <a 
                    href={item.news_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                  >
                    원문 보기 &gt;
                  </a>
                ) : (
                  <div className="text-sm text-gray-400">
                    뉴스 링크 준비 중
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-blue-500/90">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                </div>

                {/* 핵심 포인트 (간결하게) */}
                {item.key_points && item.key_points.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {item.key_points.map((point, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200"
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* 뉴스 선정 기준 설명 */}
        <div className="mt-12 p-6 bg-blue-50/50 rounded-2xl border border-blue-200/50">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">
            📊 AI 뉴스 분석 기준
          </h4>
          <p className="text-xs text-blue-700 leading-relaxed">
            Neo4j 지식그래프에서 당신의 상황과 가장 관련성 높은 뉴스를 선정했습니다.
            <br />
            1) 문제의 근본 원인을 다룬 뉴스 2) 사회적 맥락을 제공하는 뉴스 3) 해결 방안을 제시하는 뉴스
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}