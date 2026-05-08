import { useMemo } from "react";

export function SpaceBackground() {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 6,
        duration: 2 + Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.7,
      })),
    [],
  );

  const shooters = useMemo(
    () =>
      Array.from({ length: 3 }).map((_, i) => ({
        id: i,
        top: 10 + Math.random() * 60,
        delay: i * 5 + Math.random() * 4,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Nebula glows */}
      <div className="absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-primary/20 blur-[120px] animate-nebula" />
      <div
        className="absolute -right-32 top-1/2 h-[380px] w-[380px] rounded-full bg-primary/15 blur-[120px] animate-nebula"
        style={{ animationDelay: "4s" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-primary-glow/10 blur-[120px] animate-nebula"
        style={{ animationDelay: "8s" }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.74 0.13 165) 1px, transparent 1px), linear-gradient(90deg, oklch(0.74 0.13 165) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Stars */}
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

      {/* Shooting stars */}
      {shooters.map((s) => (
        <span
          key={s.id}
          className="absolute h-px w-24 animate-shoot"
          style={{
            top: `${s.top}%`,
            left: "-10%",
            background: "linear-gradient(90deg, transparent, oklch(0.82 0.14 165), transparent)",
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
