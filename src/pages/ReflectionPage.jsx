import PageWrapper from "../components/PageWrapper";
import SoftCard from "../components/SoftCard";

function ReasonCard({ idx, title, date, bullets }) {
  return (
    <SoftCard>
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white border border-blue-200 flex items-center justify-center text-blue-700 font-bold shadow-sm">
          {idx}
        </div>
        <div className="font-semibold text-slate-800">{title}</div>
        <p className="text-xs text-slate-400">{date}</p>
        <button className="text-xs text-blue-600 hover:underline">더 자세히 보기 &gt;</button>
        <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
    </SoftCard>
  );
}

export default function ReflectionPage() {
  const data = [
    {
      idx: 1,
      title: "뉴스가 말해주는 진짜 이유",
      date: "2024년 6월 발행기사",
      bullets: ["실업 10명 중 7명, 번아웃 경험", "개인만 문제 아님: 사회 안전망"]
    },
    {
      idx: 2,
      title: "왜 이런 일이 생기는 걸까요?",
      date: "2024년 4월 칼럼",
      bullets: ["무한경쟁 사회, 청년 번아웃", "임금 정체율 30%↑, 물가 대비 소득 격차"]
    },
    {
      idx: 3,
      title: "희망적인 변화들도 있어요",
      date: "2024년 7월 해설기사",
      bullets: ["기업·지자체 청년 지원 확대", "100개 기관 연대 프로젝트"]
    },
  ];

  return (
    <PageWrapper
      title="성찰의 메아리"
      subtitle="당신만의 문제가 아닐 수 있어요. 당신의 고민은 정당해요."
      tags={["진로/취업", "취업이 계속 안돼요"]}
    >
      <div className="grid md:grid-cols-3 gap-6">
        {data.map((d) => (
          <ReasonCard key={d.idx} {...d} />
        ))}
      </div>
    </PageWrapper>
  );
}
