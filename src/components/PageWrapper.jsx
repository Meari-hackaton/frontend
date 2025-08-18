import PillTag from "./PillTag";

export default function PageWrapper({ title, subtitle, tags, children }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-800">“{title}”</h1>
      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        {tags?.map((t, i) => (
          <PillTag key={i}>{t}</PillTag>
        ))}
      </div>
      <p className="text-slate-600 text-center mt-3 max-w-2xl mx-auto">{subtitle}</p>
      <div className="mt-10">{children}</div>
    </section>
  );
}
