import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Download, Upload, Users, Wifi, Shield, Power, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "سياج — لوحة التحكم" }] }),
});

function Stat({ icon: Icon, label, value, unit }: { icon: any; label: string; value: string; unit?: string }) {
  return (
    <div className="glass rounded-3xl p-4 shadow-card transition-smooth hover:-translate-y-0.5 hover:shadow-glow">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-xs">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-2xl font-bold text-foreground tabular-nums">{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, to }: { icon: any; label: string; to: string }) {
  return (
    <Link to={to} className="glass group flex flex-col items-center gap-2 rounded-2xl p-4 transition-smooth hover:-translate-y-1 hover:shadow-glow">
      <div className="bg-gradient-primary flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground shadow-glow transition-smooth group-hover:scale-110">
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </Link>
  );
}

function useLive(initial: number, range: number, decimals = 1) {
  const [v, setV] = useState(initial);
  useEffect(() => {
    const id = setInterval(() => {
      setV((p) => {
        const next = p + (Math.random() - 0.5) * range;
        return Math.max(0.1, Number(next.toFixed(decimals)));
      });
    }, 1500);
    return () => clearInterval(id);
  }, [range, decimals]);
  return v;
}

function Dashboard() {
  const dl = useLive(48.2, 6);
  const ul = useLive(12.6, 3);

  return (
    <MobileShell>
      {/* Brand header */}
      <div className="mb-5 flex items-center gap-3">
        <Logo size={48} />
        <div>
          <h1 className="font-display text-xl font-bold leading-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">سياج</span>
          </h1>
          <p className="text-[11px] text-muted-foreground">حماية ذكية لشبكتك</p>
        </div>
      </div>

      {/* Hero status card */}
      <div className="bg-gradient-surface relative mb-6 overflow-hidden rounded-3xl border border-border p-6 shadow-card">
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/30 blur-3xl animate-nebula" />
        <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-primary-glow/20 blur-3xl animate-nebula" style={{ animationDelay: "3s" }} />
        {/* Orbit dot */}
        <div className="absolute right-6 top-6 h-2 w-2">
          <span className="absolute h-2 w-2 rounded-full bg-primary animate-orbit" />
        </div>
        <div className="relative">
          <div className="mb-1 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs text-muted-foreground">متصل</span>
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">شبكتك آمنة</h2>
          <p className="mt-1 text-sm text-muted-foreground">TP-Link_2.4G</p>

          <div className="mt-5 flex gap-3">
            <button className="bg-gradient-primary animate-gradient-shift flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth active:scale-95">
              <Shield className="h-4 w-4" /> فحص الشبكة
            </button>
            <button className="glass flex items-center justify-center rounded-xl px-4 text-foreground transition-smooth hover:text-primary active:scale-95">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <Stat icon={Download} label="تحميل" value={dl.toFixed(1)} unit="ميجا/ث" />
        <Stat icon={Upload} label="رفع" value={ul.toFixed(1)} unit="ميجا/ث" />
        <Stat icon={Users} label="المتصلون" value="7" unit="جهاز" />
        <Stat icon={Activity} label="مدة التشغيل" value="3" unit="أيام" />
      </div>

      {/* Quick actions */}
      <h3 className="mb-3 font-display text-lg font-semibold">إجراءات سريعة</h3>
      <div className="grid grid-cols-4 gap-3">
        <QuickAction icon={Users} label="المستخدمون" to="/users" />
        <QuickAction icon={Wifi} label="الواي فاي" to="/wifi" />
        <QuickAction icon={Shield} label="الحماية" to="/settings" />
        <QuickAction icon={Power} label="إعادة تشغيل" to="/settings" />
      </div>
    </MobileShell>
  );
}
