import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";
import { NetworkMap } from "@/components/NetworkMap";
import { useDevices } from "@/hooks/use-router-api";
import { useQueryClient } from "@tanstack/react-query";
import { DEVICES_KEY } from "@/hooks/use-router-api";
import { RefreshCw, Wifi, WifiOff, Shield, Users } from "lucide-react";

export const Route = createFileRoute("/network")({
  component: NetworkPage,
  head: () => ({ meta: [{ title: "سياج — خريطة الشبكة" }] }),
});

function NetworkPage() {
  const { data: devices = [], isLoading, isRefetching, error } = useDevices();
  const qc = useQueryClient();

  const connected = devices.filter((d) => d.connected && !d.blocked);
  const blocked = devices.filter((d) => d.blocked);
  const offline = devices.filter((d) => !d.connected);

  return (
    <MobileShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">خريطة الشبكة</h1>
          <p className="mt-1 text-sm text-muted-foreground">عرض مرئي لجميع الأجهزة</p>
        </div>
        <button
          onClick={() => qc.invalidateQueries({ queryKey: DEVICES_KEY })}
          className="card-formal flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-smooth hover:text-primary"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <StatCard
          icon={Wifi}
          label="متصل"
          value={connected.length}
          color="text-primary"
          bg="bg-primary/10"
        />
        <StatCard
          icon={Shield}
          label="محظور"
          value={blocked.length}
          color="text-destructive"
          bg="bg-destructive/10"
        />
        <StatCard
          icon={Users}
          label="غير متصل"
          value={offline.length}
          color="text-muted-foreground"
          bg="bg-muted"
        />
      </div>

      {isLoading ? (
        <div className="card-formal flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-primary/50" />
            <p className="text-xs text-muted-foreground">جارٍ تحميل خريطة الشبكة...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <WifiOff className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">تعذّر تحميل بيانات الشبكة</p>
          <button
            onClick={() => qc.invalidateQueries({ queryKey: DEVICES_KEY })}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : (
        <NetworkMap devices={devices} />
      )}

      {devices.length > 0 && !isLoading && (
        <div className="mt-4 space-y-2">
          <p className="px-1 text-xs font-medium text-muted-foreground">تفاصيل الأجهزة</p>
          {devices.map((d) => (
            <div
              key={d.mac}
              className={`card-formal flex items-center gap-3 px-4 py-3 ${!d.connected ? "opacity-50" : ""}`}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  background: d.blocked
                    ? "#ef4444"
                    : d.connected
                    ? "#50B492"
                    : "#6b7280",
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{d.name}</p>
                <p className="text-[11px] text-muted-foreground" dir="ltr">
                  {d.ip} · {d.mac}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                  d.blocked
                    ? "bg-destructive/10 text-destructive"
                    : d.connected
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {d.blocked ? "محظور" : d.connected ? "متصل" : "غير متصل"}
              </span>
            </div>
          ))}
        </div>
      )}
    </MobileShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className="card-formal flex flex-col items-center gap-1 p-3 text-center">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg} ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className={`font-display text-xl font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
