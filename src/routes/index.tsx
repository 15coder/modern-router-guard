import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Download, Upload, Users, Wifi, Shield, Power, RefreshCw } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "سياج — لوحة التحكم" }] }),
});

function Stat({ icon: Icon, label, value, unit }: { icon: any; label: string; value: string; unit?: string }) {
  return (
    <div className="glass rounded-3xl p-4 shadow-card">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-2xl font-bold text-foreground">{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, to }: { icon: any; label: string; to: string }) {
  return (
    <Link to={to} className="glass flex flex-col items-center gap-2 rounded-2xl p-4 transition-smooth hover:shadow-glow">
      <div className="bg-gradient-primary flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </Link>
  );
}

function Dashboard() {
  return (
    <MobileShell>
      {/* Hero status card */}
      <div className="bg-gradient-surface relative mb-6 overflow-hidden rounded-3xl border border-border p-6 shadow-card">
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
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
            <button className="bg-gradient-primary flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth active:scale-95">
              <Shield className="h-4 w-4" /> فحص الشبكة
            </button>
            <button className="glass flex items-center justify-center rounded-xl px-4 text-foreground transition-smooth active:scale-95">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <Stat icon={Download} label="تحميل" value="48.2" unit="ميجا/ث" />
        <Stat icon={Upload} label="رفع" value="12.6" unit="ميجا/ث" />
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
