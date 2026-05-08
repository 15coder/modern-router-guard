import { useMemo } from "react";

export function SpaceBackground() {
  const stars = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 1.4 + 0.4,
        delay: Math.random() * 6,
        duration: 4 + Math.random() * 5,
        opacity: 0.15 + Math.random() * 0.35,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Subtle, formal ambient glows */}
      <div className="absolute -left-40 -top-20 h-[420px] w-[420px] rounded-full bg-primary/[0.06] blur-[140px]" />
      <div className="absolute -right-40 top-1/2 h-[380px] w-[380px] rounded-full bg-primary/[0.04] blur-[140px]" />

      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.94 0.008 200) 1px, transparent 1px), linear-gradient(90deg, oklch(0.94 0.008 200) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
        }}
      />

      {/* Quiet stars */}
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-foreground animate-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
