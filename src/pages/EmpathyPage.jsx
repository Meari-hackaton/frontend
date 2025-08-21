import React from "react";
import PageWrapper from "../components/PageWrapper";
import AirplaneIcon from "../components/AirplaneIcon";

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

export default function EmpathyPage({ sessionData }) {
  // 세션 데이터에서 공감 카드 가져오기
  console.log('EmpathyPage sessionData:', sessionData);
  const empathyCard = sessionData?.cards?.empathy;
  
  // 세션 데이터가 있으면 사용, 없으면 기본값 사용
  const items = empathyCard?.cards ? 
    empathyCard.cards.map(card => ({
      quote: card.quote_text || card.content?.substring(0, 100) + "...",
      date: card.news_title || card.news_date || "최근 뉴스",
      sub: card.content || "",
      emotion_keywords: card.emotion_keywords || [],
      news_link: card.news_link || null,
      news_provider: card.news_provider || ""
    })) :
    [
      {
        quote:
          "매일 아침 회사에 가는 게 너무 힘들어요. 일요일 저녁이면 가슴이 답답해지고, 월요일 아침 알람 소리가 공포스러워요.",
        date: "2024년 3월 직장인 번아웃 실태 보도",
        sub: "이런 마음 정말 힘드시죠… 월요병이라고 가볍게 넘기기엔 너무 무거운 마음이에요.",
      },
      {
        quote:
          "퇴사하고 싶다는 생각을 하루에도 몇 번씩 해요. 하지만 다음 직장도 똑같을까 봐 무서워서 참고 있어요.",
        date: "2024년 5월 MZ세대 직장 문화 기사",
        sub: "떠나고 싶지만 떠날 수 없는 막막함, 갇혀있는 느낌이 들겠어요.",
      },
      {
        quote:
          "주변 사람들은 다 잘 지내는 것 같은데, 나만 이렇게 힘든가 싶어서 더 외로웠어요.",
        date: "2024년 4월 청년 고민담 특집 기사",
        sub: "SNS 속 행복한 모습들 사이에서 혼자만 뒤처진 것 같은 외로움… 당신만 느끼는 감정이 아니에요.",
      },
    ];

  return (
    <PageWrapper
      title={empathyCard?.title || "당신의 마음을 이해해요"}
      titleClass="text-[#5C4033]" // 제목 색상 브라운
      subtitle={
        <span className="text-[#6B4F3B]">
          {empathyCard?.cards?.length > 0 ? 
            <>같은 고민을 하는 사람들의 목소리를 들어보세요. <br className="hidden md:inline" />
            당신의 마음이 충분히 이해받을 만한 것임을 알게 될 거예요.</> :
            <>이 모든 목소리들이 당신의 이야기예요. <br className="hidden md:inline" />
            당신은 혼자가 아닙니다. 나와 비슷한 사람들의 목소리를 들어보세요.</>
          }
        </span>
      }
      tags={empathyCard?.emotion_keywords || ["진로/취업", "취업이 계속 안돼요"]}
      tagClass="bg-white text-blue-600 border border-blue-200 shadow-sm"
    >
      <div className="relative">
        {/* 하단 강조 그라데이션 (뒤로 보내기 z-0) */}
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
          {items.map((it, i) => (
            <Card key={i}>
              <div className="flex flex-col items-center text-center gap-6">
                <AirplaneIcon className="w-9 h-9 text-blue-600" />

                {/* 인용구: 글자 크기 줄이고 색상 제목과 동일 */}
                <blockquote className="text-base md:text-lg font-semibold leading-relaxed text-[#5C4033]">
                  “{it.quote}”
                </blockquote>

                <p className="text-xs md:text-sm text-slate-500">
                  [ {it.news_provider || "출처"} {it.date && it.date !== "관련 뉴스" ? `- ${it.date}` : ""} ]
                </p>

                {it.news_link ? (
                  <a 
                    href={it.news_link}
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

                <p className="text-sm md:text-base leading-6 font-bold text-blue-700">
                  {it.sub}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
