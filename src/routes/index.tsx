import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, Upload, Users, Shield, RefreshCw, Loader2, Wifi, Globe, Clock } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { Logo } from "@/components/Logo";
import { SpeedChart } from "@/components/SpeedChart";
import { SpeedTest } from "@/components/SpeedTest";
import { useNetworkStats, useDevices } from "@/hooks/use-router-api";
import { useConnectionStore } from "@/lib/connection-store";
import { useSpeedHistory } from "@/hooks/use-speed-history";
import { useDeviceNotifications } from "@/hooks/use-notifications";
import { formatUptime } from "@/lib/router-api/utils";
import { useState } from "react";
import { getActiveClient } from "@/lib/router-api";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "سياج — لوحة التحكم" }] }),
});

function Stat({
  icon: Icon,
  label,
  value,
  unit,
  loading,
}: {
  icon: any;
  label: string;
  value: string;
  unit?: string;
  loading?: boolean;
}) {
  return (
    <div className="card-formal p-4">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-xs">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        {loading ? (
          <div className="h-7 w-16 animate-pulse rounded-md bg-muted" />
        ) : (
          <>
            <span className="font-display text-2xl font-bold text-foreground tabular-nums stat-update">
              {value}
            </span>
            {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
          </>
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const nav = useNavigate();
  const { routerModel, routerType, connected, ip, disconnect } = useConnectionStore();
  const { data: stats, isLoading: statsLoading, dataUpdatedAt } = useNetworkStats();
  const { data: devices } = useDevices();
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [restarting, setRestarting] = useState(false);

  const speedHistory = useSpeedHistory(stats);
  useDeviceNotifications(devices);

  const dl = stats?.downloadMbps ?? 0;
  const ul = stats?.uploadMbps ?? 0;
  const uptime = stats?.uptimeSeconds ?? 0;
  const connectedCount =
    devices?.filter((d) => d.connected && !d.blocked).length ?? (stats?.connectedDevices ?? 0);
  const lastUpdate = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString("ar-SA") : null;

  const handleScan = async () => {
    setScanning(true);
    setScanResult(null);
    await new Promise((r) => setTimeout(r, 1800));
    const blocked = devices?.filter((d) => d.blocked).length ?? 0;
    const newDevices = devices?.filter((d) => d.isNew).length ?? 0;
    setScanResult(
      newDevices > 0
        ? `تم اكتشاف ${newDevices} جهاز جديد`
        : blocked > 0
        ? `${blocked} جهاز محظور نشط`
        : "الشبكة سليمة ✓"
    );
    setScanning(false);
  };

  const handleRestart = async () => {
    if (!confirm("هل أنت متأكد من إعادة تشغيل الراوتر؟")) return;
    setRestarting(true);
    try {
      await getActiveClient().restartRouter();
    } catch {}
    await new Promise((r) => setTimeout(r, 2000));
    setRestarting(false);
  };

  const routerLabel =
    routerType === "tp-link" ? "TP-Link" : routerType === "mikrotik" ? "MikroTik" : "راوتر";

  return (
    <MobileShell>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={44} />
          <div>
            <h1 className="font-display text-xl font-bold leading-tight text-foreground">سياج</h1>
            <p className="text-[11px] text-muted-foreground">حماية ذكية لشبكتك</p>
          </div>
        </div>
        {connected && (
          <button
            onClick={() => {
              disconnect();
              nav({ to: "/login" });
            }}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-smooth hover:border-destructive/50 hover:text-destructive"
          >
            قطع
          </button>
        )}
      </div>

      <div className="card-formal mb-4 p-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${connected ? "bg-primary" : "bg-destructive"} ${connected ? "animate-pulse" : ""}`}
            />
            <span className="text-xs text-muted-foreground">{connected ? "متصل" : "غير متصل"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
              {routerLabel}
            </span>
            {lastUpdate && (
              <span className="text-[10px] text-muted-foreground/60">آخر تحديث: {lastUpdate}</span>
            )}
          </div>
        </div>

        <h2 className="font-display text-xl font-bold text-foreground">
          {scanResult ?? (connected ? "شبكتك آمنة" : "غير متصل بالراوتر")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{routerModel || ip || "—"}</p>

        {stats?.wanIp && (
          <div className="mt-2 flex items-center gap-1.5">
            <Globe className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground" dir="ltr">
              {stats.wanIp}
            </span>
          </div>
        )}

        <div className="mt-5 flex gap-2">
          <button
            onClick={handleScan}
            disabled={scanning}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-smooth hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60"
          >
            {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
            {scanning ? "جارٍ الفحص..." : "فحص الشبكة"}
          </button>
          <button
            onClick={handleRestart}
            disabled={restarting}
            title="إعادة تشغيل الراوتر"
            className="flex items-center justify-center rounded-xl border border-border px-4 text-foreground transition-smooth hover:border-primary/50 hover:text-primary disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${restarting ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat icon={Download} label="تحميل" value={dl.toFixed(1)} unit="م.بايت/ث" loading={statsLoading} />
        <Stat icon={Upload} label="رفع" value={ul.toFixed(1)} unit="م.بايت/ث" loading={statsLoading} />
        <Stat icon={Users} label="المتصلون" value={String(connectedCount)} unit="جهاز" loading={statsLoading} />
        <Stat
          icon={Clock}
          label="مدة التشغيل"
          value={uptime > 0 ? formatUptime(uptime).split(" ").slice(0, 2).join(" ") : "—"}
          loading={statsLoading}
        />
      </div>

      <div className="mb-4">
        <SpeedChart data={speedHistory} />
      </div>

      <div className="mb-4">
        <SpeedTest />
      </div>

      {stats?.dns1 && (
        <div className="card-formal p-4">
          <div className="mb-2 flex items-center gap-2">
            <Wifi className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">معلومات الشبكة</span>
          </div>
          <div className="space-y-1.5">
            <InfoRow label="DNS الأول" value={stats.dns1} />
            <InfoRow label="DNS الثاني" value={stats.dns2} />
            {stats.wanIp && <InfoRow label="IP الخارجي" value={stats.wanIp} />}
          </div>
        </div>
      )}
    </MobileShell>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground" dir="ltr">
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
