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
    <div className="card-formal p-4">
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
    <Link to={to} className="card-formal flex flex-col items-center gap-2 p-4 transition-smooth hover:border-primary/40">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
    }, 2500);
    return () => clearInterval(id);
  }, [range, decimals]);
  return v;
}

function Dashboard() {
  const dl = useLive(48.2, 4);
  const ul = useLive(12.6, 2);

  return (
    <MobileShell>
      {/* Brand header */}
      <div className="mb-6 flex items-center gap-3">
        <Logo size={44} />
        <div>
          <h1 className="font-display text-xl font-bold leading-tight text-foreground">سياج</h1>
          <p className="text-[11px] text-muted-foreground">حماية ذكية لشبكتك</p>
        </div>
      </div>

      {/* Hero status card */}
      <div className="card-formal mb-6 p-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">متصل</span>
          </div>
          <span className="rounded-md border border-border px-2 py-0.5 text-[10px] text-muted-foreground">آمن</span>
        </div>
        <h2 className="font-display text-xl font-bold text-foreground">شبكتك آمنة</h2>
        <p className="mt-1 text-sm text-muted-foreground">TP-Link_2.4G</p>

        <div className="mt-5 flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-smooth hover:bg-primary/90 active:scale-[0.98]">
            <Shield className="h-4 w-4" /> فحص الشبكة
          </button>
          <button className="flex items-center justify-center rounded-lg border border-border px-4 text-foreground transition-smooth hover:border-primary/50 hover:text-primary">
            <RefreshCw className="h-4 w-4" />
          </button>
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
      <h3 className="mb-3 font-display text-base font-semibold text-foreground">إجراءات سريعة</h3>
      <div className="grid grid-cols-4 gap-3">
        <QuickAction icon={Users} label="المستخدمون" to="/users" />
        <QuickAction icon={Wifi} label="الواي فاي" to="/wifi" />
        <QuickAction icon={Shield} label="الحماية" to="/settings" />
        <QuickAction icon={Power} label="إعادة تشغيل" to="/settings" />
      </div>
    </MobileShell>
  );
}
