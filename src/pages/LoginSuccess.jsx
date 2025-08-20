import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function LoginSuccess() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/profile") // 또는 /api/me
      .then(setMe)
      .catch(() => setError("인증 정보를 불러오지 못했어요."));
  }, []);

  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!me) return <div className="p-10 text-center">불러오는 중…</div>;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="text-xl font-semibold">{me.name || me.email}</div>
        <div className="text-slate-500">{me.email}</div>

        <button
          className="px-4 py-2 text-sm rounded-full bg-slate-200 hover:bg-slate-300"
          onClick={async () => {
            await apiPost("/auth/sessionLogout");
            navigate("/login");
          }}
        >
          로그아웃
        </button>

        <div>
          <button
            className="ml-2 px-4 py-2 text-sm rounded-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => navigate("/")}
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
