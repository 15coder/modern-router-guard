import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Smartphone, Laptop, Tv, Search, Ban, CheckCircle2, ShieldAlert } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/users")({
  component: UsersPage,
  head: () => ({ meta: [{ title: "سياج — المستخدمون" }] }),
});

type Device = { id: string; name: string; mac: string; ip: string; type: "phone" | "laptop" | "tv"; blocked: boolean; isNew?: boolean };

const initial: Device[] = [
  { id: "1", name: "iPhone — أحمد", mac: "A4:C3:F0:12:88:01", ip: "192.168.1.12", type: "phone", blocked: false },
  { id: "2", name: "MacBook Pro", mac: "B2:91:AC:55:21:7E", ip: "192.168.1.5", type: "laptop", blocked: false },
  { id: "3", name: "Samsung TV", mac: "C8:14:79:33:A1:09", ip: "192.168.1.8", type: "tv", blocked: false },
  { id: "4", name: "جهاز غير معروف", mac: "F1:22:8E:90:11:42", ip: "192.168.1.22", type: "phone", blocked: false, isNew: true },
  { id: "5", name: "Redmi Note", mac: "11:88:DD:42:90:FF", ip: "192.168.1.18", type: "phone", blocked: true },
];

const icons = { phone: Smartphone, laptop: Laptop, tv: Tv } as const;

function UsersPage() {
  const [devices, setDevices] = useState(initial);
  const [blockNew, setBlockNew] = useState(false);
  const [q, setQ] = useState("");

  const filtered = devices.filter((d) => d.name.includes(q) || d.ip.includes(q));

  const toggle = (id: string) =>
    setDevices((ds) => ds.map((d) => (d.id === id ? { ...d, blocked: !d.blocked } : d)));

  return (
    <MobileShell>
      <PageHeader title="المستخدمون" subtitle={`${devices.length} جهاز متصل بالشبكة`} />

      {/* Block new toggle */}
      <div className="glass mb-4 flex items-center justify-between rounded-2xl p-4 shadow-card">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-primary flex h-10 w-10 items-center justify-center rounded-xl">
            <ShieldAlert className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold">حظر المستخدمين الجدد</p>
            <p className="text-xs text-muted-foreground">منع أي جهاز جديد تلقائياً</p>
          </div>
        </div>
        <button
          onClick={() => setBlockNew((v) => !v)}
          className={`relative h-7 w-12 rounded-full transition-smooth ${blockNew ? "bg-gradient-primary" : "bg-muted"}`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-background shadow transition-smooth ${
              blockNew ? "right-1" : "right-6"
            }`}
          />
        </button>
      </div>

      {/* Search */}
      <div className="glass mb-4 flex items-center gap-2 rounded-2xl px-4 py-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث عن جهاز..."
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Devices list */}
      <div className="space-y-3">
        {filtered.map((d) => {
          const Icon = icons[d.type];
          return (
            <div key={d.id} className="glass flex items-center gap-3 rounded-2xl p-3 shadow-card">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${d.blocked ? "bg-destructive/20 text-destructive" : "bg-primary/15 text-primary"}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold">{d.name}</p>
                  {d.isNew && <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-primary">جديد</span>}
                </div>
                <p className="text-xs text-muted-foreground" dir="ltr">{d.ip} · {d.mac}</p>
              </div>
              <button
                onClick={() => toggle(d.id)}
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-smooth active:scale-90 ${
                  d.blocked ? "bg-primary text-primary-foreground" : "bg-destructive/15 text-destructive"
                }`}
              >
                {d.blocked ? <CheckCircle2 className="h-5 w-5" /> : <Ban className="h-5 w-5" />}
              </button>
            </div>
          );
        })}
      </div>
    </MobileShell>
  );
}
