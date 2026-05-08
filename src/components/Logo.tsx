import logo from "@/assets/logo.jpg";

export function Logo({ size = 80, glow = true, animate = true }: { size?: number; glow?: boolean; animate?: boolean }) {
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {glow && (
        <>
          <span className="absolute inset-0 rounded-3xl bg-primary/30 blur-2xl animate-nebula" />
          <span className="absolute inset-0 rounded-full border border-primary/30 animate-pulse-ring" />
          <span
            className="absolute inset-0 rounded-full border border-primary/20 animate-pulse-ring"
            style={{ animationDelay: "1.2s" }}
          />
        </>
      )}
      <img
        src={logo}
        alt="سياج"
        className={`relative h-full w-full rounded-3xl object-cover shadow-glow ${animate ? "animate-float" : ""}`}
        style={{ width: size, height: size }}
      />
    </div>
  );
}
