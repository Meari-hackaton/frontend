export default function SoftCard({ children, className = "" }) {
  return (
    <div
      className={
        "relative rounded-[28px] border border-blue-100/80 bg-white/80 backdrop-blur p-6 sm:p-8 shadow-[0_10px_30px_rgba(30,64,175,0.08)] " +
        className
      }
    >
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/40 to-blue-50/40 pointer-events-none" />
      <div className="relative">{children}</div>
    </div>
  );
}
