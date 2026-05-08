import logo from "@/assets/logo.jpg";

export function Logo({ size = 80, ring = true }: { size?: number; ring?: boolean; glow?: boolean; animate?: boolean }) {
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {ring && (
        <span className="absolute inset-0 rounded-2xl border border-border" />
      )}
      <img
        src={logo}
        alt="سياج"
        className="relative h-full w-full rounded-2xl object-cover"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
