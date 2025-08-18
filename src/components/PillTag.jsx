export default function PillTag({ children }) {
  return (
    <span className="text-xs sm:text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
      #{children}
    </span>
  );
}
