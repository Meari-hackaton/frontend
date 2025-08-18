export default function StepBullets({ total = 3, active = 1 }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <div
          key={n}
          className={
            "h-1.5 w-16 rounded-full transition-all " +
            (n <= active ? "bg-blue-500" : "bg-blue-200")
          }
        />
      ))}
    </div>
  );
}
