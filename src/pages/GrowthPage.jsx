// src/pages/GrowthPage.jsx
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import SoftCard from "../components/SoftCard";
import AirplaneIcon from "../components/AirplaneIcon";
import GhostButton from "../components/GhostButton";

export default function GrowthPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper
      title="성장의 메아리"
      subtitle="당신의 작은 용기가 큰 변화의 시작이 될 거예요."
      tags={["진로/취업", "취업이 계속 안돼요"]}
    >
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <SoftCard>
          <div className="flex flex-col items-center text-center gap-4">
            <AirplaneIcon className="w-7 h-7 text-blue-700" />
            <div className="text-sm text-slate-700">도움이 될만한 정보를 알고 싶다면?</div>
            <GhostButton onClick={() => navigate("/connect/info")}>
              정보 연결
            </GhostButton>
          </div>
        </SoftCard>

        <SoftCard>
          <div className="flex flex-col items-center text-center gap-4">
            <AirplaneIcon className="w-7 h-7 text-blue-700" />
            <div className="text-sm text-slate-700">힐링 경험을 체험하고 싶다면?</div>
            <GhostButton onClick={() => navigate("/connect/experience")}>
              경험 연결
            </GhostButton>
          </div>
        </SoftCard>

        <SoftCard>
          <div className="flex flex-col items-center text-center gap-4">
            <AirplaneIcon className="w-7 h-7 text-blue-700" />
            <div className="text-sm text-slate-700">나한테 맞는 정책과 지원들이 궁금하다면?</div>
            <GhostButton onClick={() => navigate("/connect/support")}>
              지원 연결
            </GhostButton>
          </div>
        </SoftCard>
      </div>

      <div className="mt-10 h-12 w-full max-w-5xl mx-auto bg-gradient-to-r from-blue-100/60 via-blue-50 to-blue-100/60 rounded-full" />
    </PageWrapper>
  );
}
