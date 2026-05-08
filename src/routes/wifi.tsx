import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wifi, Eye, EyeOff, Save, Radio } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/wifi")({
  component: WifiPage,
  head: () => ({ meta: [{ title: "سياج — الواي فاي" }] }),
});

function WifiPage() {
  const [show, setShow] = useState(false);
  const [ssid, setSsid] = useState("Siyaj_Home");
  const [pass, setPass] = useState("strongpass2026");
  const [band, setBand] = useState<"2.4" | "5" | "both">("both");
  const [hidden, setHidden] = useState(false);

  return (
    <MobileShell>
      <PageHeader title="إعدادات الواي فاي" subtitle="إدارة شبكتك اللاسلكية" />

      <div className="bg-gradient-surface mb-5 overflow-hidden rounded-3xl border border-border p-5 shadow-card">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-primary flex h-12 w-12 items-center justify-center rounded-2xl shadow-glow">
            <Wifi className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <p className="font-display text-lg font-bold">{ssid}</p>
            <p className="text-xs text-muted-foreground">شبكة نشطة · {band === "both" ? "ثنائية النطاق" : `${band}GHz`}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Field label="اسم الشبكة (SSID)">
          <input value={ssid} onChange={(e) => setSsid(e.target.value)} className="w-full bg-transparent text-sm outline-none" />
        </Field>

        <Field label="كلمة المرور">
          <div className="flex items-center gap-2">
            <input
              type={show ? "text" : "password"}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none"
              dir="ltr"
            />
            <button onClick={() => setShow((v) => !v)} className="text-muted-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        <div>
          <p className="mb-2 px-1 text-xs text-muted-foreground">نطاق التردد</p>
          <div className="glass grid grid-cols-3 gap-1 rounded-2xl p-1">
            {(["2.4", "5", "both"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBand(b)}
                className={`rounded-xl py-2 text-xs font-semibold transition-smooth ${
                  band === b ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
                }`}
              >
                {b === "both" ? "كلاهما" : `${b}GHz`}
              </button>
            ))}
          </div>
        </div>

        <div className="glass flex items-center justify-between rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Radio className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">إخفاء الشبكة</p>
              <p className="text-xs text-muted-foreground">عدم بث اسم الشبكة</p>
            </div>
          </div>
          <button
            onClick={() => setHidden((v) => !v)}
            className={`relative h-7 w-12 rounded-full transition-smooth ${hidden ? "bg-gradient-primary" : "bg-muted"}`}
          >
            <span className={`absolute top-1 h-5 w-5 rounded-full bg-background shadow transition-smooth ${hidden ? "right-1" : "right-6"}`} />
          </button>
        </div>

        <button className="bg-gradient-primary flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-semibold text-primary-foreground shadow-glow transition-smooth active:scale-[0.98]">
          <Save className="h-4 w-4" />
          حفظ التغييرات
        </button>
      </div>
    </MobileShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl px-4 py-3">
      <p className="mb-1 text-[11px] text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
