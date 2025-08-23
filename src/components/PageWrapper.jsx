import React from "react";

const cx = (...args) => args.filter(Boolean).join(" ");

export default function PageWrapper({
  title,
  subtitle,
  tags,
  children,
  titleClass,
  subtitleClass,
  tagClass,
  className,
  rightElement,
}) {
  return (
    <section className={cx("relative mx-auto max-w-6xl px-6 py-12", className)}>
      {/* 중앙 강조 그라데이션 (뒤로 보내기 z-0) */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-48 blur-2xl z-0">
        <div className="mx-auto h-full w-8/12 rounded-full bg-gradient-to-b from-blue-200/90 via-blue-100/70 to-transparent" />
      </div>

      {/* 우측 상단 요소 */}
      {rightElement && (
        <div className="absolute top-6 right-6 z-20">
          {rightElement}
        </div>
      )}

      <header className="relative z-10 text-center space-y-4">
        <h1
          className={cx(
            "text-3xl md:text-4xl font-extrabold tracking-tight",
            titleClass || "text-[#5C4033]"
          )}
        >
          “{title}”
        </h1>

        {Array.isArray(tags) && tags.length > 0 && (
          <div className="flex justify-center gap-3">
            {tags.map((t, i) => (
              <span
                key={i}
                className={cx(
                  "inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium",
                  tagClass || "bg-white text-blue-600 border border-blue-200 shadow-sm"
                )}
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {subtitle && (
          <p className={cx("text-base md:text-lg", subtitleClass || "text-[#6B4F3B]")}>
            {subtitle}
          </p>
        )}
      </header>

      <main className="relative z-10 mt-10">{children}</main>
    </section>
  );
}
