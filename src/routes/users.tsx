import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  Smartphone, Laptop, Tv, Tablet, HelpCircle,
  Search, Ban, CheckCircle2, ShieldAlert, RefreshCw,
  Loader2, Wifi, WifiOff, Pencil, Check, X,
} from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";
import { useDevices, useBlockDevice, DEVICES_KEY } from "@/hooks/use-router-api";
import { useQueryClient } from "@tanstack/react-query";
import { useConnectionStore } from "@/lib/connection-store";
import { useNotificationPermission, useDeviceNotifications } from "@/hooks/use-notifications";
import type { ConnectedDevice } from "@/lib/router-api/types";

export const Route = createFileRoute("/users")({
  component: UsersPage,
  head: () => ({ meta: [{ title: "سياج — المستخدمون" }] }),
});

const typeIcons: Record<ConnectedDevice["deviceType"], any> = {
  phone: Smartphone,
  laptop: Laptop,
  tv: Tv,
  tablet: Tablet,
  unknown: HelpCircle,
};

function SignalBar({ signal }: { signal?: number }) {
  if (!signal) return null;
  const abs = Math.abs(signal);
  const quality = abs < 55 ? "excellent" : abs < 65 ? "good" : abs < 75 ? "fair" : "weak";
  const colors = {
    excellent: "text-primary",
    good: "text-primary/80",
    fair: "text-yellow-400",
    weak: "text-destructive",
  };
  return (
    <span title={`${signal} dBm`} className={`text-[10px] font-medium ${colors[quality]}`}>
      {quality === "excellent" ? "ممتاز" : quality === "good" ? "جيد" : quality === "fair" ? "مقبول" : "ضعيف"}
    </span>
  );
}

function DeviceCard({
  device,
  onToggle,
  toggling,
  onRename,
}: {
  device: ConnectedDevice;
  onToggle: () => void;
  toggling: boolean;
  onRename: (mac: string, name: string) => void;
}) {
  const Icon = typeIcons[device.deviceType];
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(device.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setEditName(device.name);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const confirmEdit = () => {
    if (editName.trim()) onRename(device.mac, editName.trim());
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditName(device.name);
    setEditing(false);
  };

  return (
    <div
      className={`card-formal flex items-center gap-3 p-3 transition-smooth ${
        !device.connected ? "opacity-60" : ""
      } ${device.isNew ? "new-device-flash" : ""}`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          device.blocked
            ? "bg-destructive/15 text-destructive"
            : device.connected
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex items-center gap-1.5">
            <input
              ref={inputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmEdit();
                if (e.key === "Escape") cancelEdit();
              }}
              className="flex-1 min-w-0 rounded-lg border border-primary bg-transparent px-2 py-1 text-sm text-foreground outline-none"
              dir="auto"
            />
            <button onClick={confirmEdit} className="text-primary hover:text-primary/80">
              <Check className="h-4 w-4" />
            </button>
            <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={startEdit}
              className="group flex items-center gap-1 hover:text-primary transition-smooth"
              title="تعديل الاسم"
            >
              <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                {device.name}
              </p>
              <Pencil className="h-3 w-3 shrink-0 text-muted-foreground/0 group-hover:text-primary/60 transition-smooth" />
            </button>
            {device.isNew && (
              <span className="shrink-0 rounded-md border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                جديد
              </span>
            )}
            {device.blocked && (
              <span className="shrink-0 rounded-md border border-destructive/40 bg-destructive/10 px-1.5 py-0.5 text-[10px] text-destructive">
                محظور
              </span>
            )}
          </div>
        )}
        <p className="text-[11px] text-muted-foreground truncate" dir="ltr">
          {device.ip} · {device.mac}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          {device.vendor && (
            <span className="text-[10px] text-muted-foreground/70">{device.vendor}</span>
          )}
          {device.connected ? (
            <SignalBar signal={device.signal} />
          ) : (
            <span className="text-[10px] text-muted-foreground/60">غير متصل</span>
          )}
        </div>
      </div>

      <button
        onClick={onToggle}
        disabled={toggling}
        title={device.blocked ? "رفع الحظر" : "حظر الجهاز"}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-smooth active:scale-90 disabled:opacity-50 ${
          device.blocked
            ? "bg-primary text-primary-foreground"
            : "border border-border text-destructive hover:border-destructive/50 hover:bg-destructive/10"
        }`}
      >
        {toggling ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : device.blocked ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <Ban className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

function UsersPage() {
  const { data: devices = [], isLoading, isRefetching, error } = useDevices();
  const blockDevice = useBlockDevice();
  const qc = useQueryClient();
  const { autoBlockNew, setAutoBlockNew, setDeviceAlias } = useConnectionStore();
  const { isSupported, permission, request } = useNotificationPermission();
  const [q, setQ] = useState("");
  const [togglingMac, setTogglingMac] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "connected" | "blocked">("all");

  useDeviceNotifications(devices);

  const connected = devices.filter((d) => d.connected && !d.blocked);
  const blocked = devices.filter((d) => d.blocked);
  const filtered = devices.filter((d) => {
    const matchQ =
      !q ||
      d.name.includes(q) ||
      d.ip.includes(q) ||
      d.mac.toLowerCase().includes(q.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "connected" && d.connected && !d.blocked) ||
      (filter === "blocked" && d.blocked);
    return matchQ && matchFilter;
  });

  const handleToggle = async (device: ConnectedDevice) => {
    setTogglingMac(device.mac);
    try {
      await blockDevice.mutateAsync({ mac: device.mac, block: !device.blocked });
    } catch {}
    setTogglingMac(null);
  };

  const handleRename = (mac: string, name: string) => {
    setDeviceAlias(mac, name);
    qc.invalidateQueries({ queryKey: DEVICES_KEY });
  };

  const handleToggleAutoBlock = async () => {
    const next = !autoBlockNew;
    setAutoBlockNew(next);
    if (next && isSupported && permission !== "granted") {
      await request();
    }
  };

  return (
    <MobileShell>
      <PageHeader
        title="المستخدمون"
        subtitle={`${connected.length} متصل · ${blocked.length} محظور`}
      />

      <div className="card-formal mb-3 flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">حظر الأجهزة الجديدة</p>
            <p className="text-xs text-muted-foreground">منع أي جهاز غير معروف تلقائياً</p>
          </div>
        </div>
        <Toggle on={autoBlockNew} onToggle={handleToggleAutoBlock} />
      </div>

      {isSupported && permission === "default" && (
        <button
          onClick={request}
          className="card-formal mb-3 flex w-full items-center gap-3 p-4 text-right transition-smooth hover:border-primary/40"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">تفعيل الإشعارات</p>
            <p className="text-xs text-muted-foreground">لتلقّي تنبيهات عند اتصال جهاز جديد</p>
          </div>
        </button>
      )}

      <div className="mb-3 card-formal flex items-center gap-2 px-4 py-3">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث بالاسم أو IP أو MAC..."
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        {q && (
          <button onClick={() => setQ("")} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        )}
      </div>

      <div className="mb-4 flex gap-2">
        {(["all", "connected", "blocked"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-smooth ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "card-formal text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all"
              ? `الكل (${devices.length})`
              : f === "connected"
              ? `متصل (${connected.length})`
              : `محظور (${blocked.length})`}
          </button>
        ))}
        <button
          onClick={() => qc.invalidateQueries({ queryKey: DEVICES_KEY })}
          className="card-formal flex items-center justify-center rounded-xl px-3 text-muted-foreground transition-smooth hover:text-primary"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card-formal h-20 animate-pulse bg-muted" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <WifiOff className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">تعذّر جلب قائمة الأجهزة</p>
          <button
            onClick={() => qc.invalidateQueries({ queryKey: DEVICES_KEY })}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Wifi className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">{q ? "لا توجد نتائج" : "لا توجد أجهزة"}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((d) => (
            <DeviceCard
              key={d.id}
              device={d}
              onToggle={() => handleToggle(d)}
              toggling={togglingMac === d.mac}
              onRename={handleRename}
            />
          ))}
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <p className="mt-4 text-center text-[11px] text-muted-foreground/60">
          يتجدد تلقائياً كل 5 ثوانٍ · اضغط على الاسم لتعديله
        </p>
      )}
    </MobileShell>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative h-7 w-12 rounded-full border transition-smooth ${
        on ? "border-primary bg-primary" : "border-border bg-muted"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-smooth ${
          on ? "right-0.5" : "right-[1.625rem]"
        }`}
      />
    </button>
  );
}
