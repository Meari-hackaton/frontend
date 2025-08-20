export default function StepBullets({ total = 1, active = 0 }) {
  return (
    <div className="flex items-center">
      <div
        className={
          "h-1.5 w-16 rounded-full transition-all " +
          (active ? "bg-blue-600" : "bg-slate-300")
        }
      />
    </div>
  );
}
