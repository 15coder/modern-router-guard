import { useEffect, useState } from "react";

const SEED_STARS = Array.from({ length: 28 }).map((_, i) => {
  const s = Math.sin(i * 9301 + 49297) * 233280;
  const r = (n: number) => (Math.sin(i * 9301 + n) * 233280) % 1;
  return {
    id: i,
    top: Math.abs(r(49297)) * 100,
    left: Math.abs(r(233280)) * 100,
    size: Math.abs(r(1234)) * 1.4 + 0.4,
    delay: Math.abs(r(5678)) * 6,
    duration: 4 + Math.abs(r(9012)) * 5,
    opacity: 0.15 + Math.abs(r(3456)) * 0.35,
  };
});

export function SpaceBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="absolute -left-40 -top-20 h-[420px] w-[420px] rounded-full bg-primary/[0.06] blur-[140px]" />
      <div className="absolute -right-40 top-1/2 h-[380px] w-[380px] rounded-full bg-primary/[0.04] blur-[140px]" />

      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.94 0.008 200) 1px, transparent 1px), linear-gradient(90deg, oklch(0.94 0.008 200) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
        }}
      />

      {mounted &&
        SEED_STARS.map((s) => (
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
