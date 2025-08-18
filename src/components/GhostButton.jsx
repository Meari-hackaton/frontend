// src/components/GhostButton.jsx
export default function GhostButton({ children, className = "", ...props }) {
  return (
    <button
      className={
        "w-full rounded-[28px] px-6 py-6 bg-white/60 backdrop-blur " +
        "border border-blue-100 text-blue-700 " +
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_10px_20px_rgba(30,64,175,0.08)] " +
        "hover:bg-white/80 transition " +
        className
      }
      {...props} // ← onClick 등 전달
    >
      {children}
    </button>
  );
}
