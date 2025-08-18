import PageWrapper from "../components/PageWrapper";
import SoftCard from "../components/SoftCard";
import AirplaneIcon from "../components/AirplaneIcon";

export default function EmpathyPage() {
  const items = [
    {
      quote: "매일 아침 회사에 가는 게 너무 힘들어요...",
      date: "2024년 3월 직장인 사례",
      sub: "이런 마음 정말 힘드시죠…"
    },
    {
      quote: "퇴사하고 싶다는 생각을 하루에도 몇 번씩 해요...",
      date: "2024년 5월 MZ세대 사례",
      sub: "떠나고 싶지만 떠날 수 없는…"
    },
    {
      quote: "주변 사람들은 다 잘 지내는 것 같은데...",
      date: "2024년 4월 청년 근로자 사례",
      sub: "혼자만 뒤쳐진 것 같은 외로움…"
    },
  ];

  return (
    <PageWrapper
      title="공감의 메아리"
      subtitle="이 모든 목소리들이 당신의 이야기예요. 당신은 혼자가 아닙니다."
      tags={["진로/취업", "취업이 계속 안돼요"]}
    >
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it, i) => (
          <SoftCard key={i}>
            <div className="flex flex-col items-center text-center gap-4">
              <AirplaneIcon className="w-7 h-7 text-blue-700" />
              <blockquote className="text-[15px] leading-relaxed text-slate-800">“{it.quote}”</blockquote>
              <p className="text-xs text-slate-400">{it.date}</p>
              <button className="text-xs text-blue-600 hover:underline">더 자세히 보기 &gt;</button>
              <p className="text-sm text-slate-600">{it.sub}</p>
            </div>
          </SoftCard>
        ))}
      </div>
    </PageWrapper>
  );
}
