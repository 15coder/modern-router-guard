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

      <div className="card-formal mb-5 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Wifi className="h-6 w-6" />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-foreground">{ssid}</p>
            <p className="text-xs text-muted-foreground">شبكة نشطة · {band === "both" ? "ثنائية النطاق" : `${band}GHz`}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
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
            <button onClick={() => setShow((v) => !v)} className="text-muted-foreground hover:text-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        <div>
          <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">نطاق التردد</p>
          <div className="card-formal grid grid-cols-3 gap-1 p-1">
            {(["2.4", "5", "both"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBand(b)}
                className={`rounded-md py-2 text-xs font-semibold transition-smooth ${
                  band === b ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {b === "both" ? "كلاهما" : `${b}GHz`}
              </button>
            ))}
          </div>
        </div>

        <div className="card-formal flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">إخفاء الشبكة</p>
              <p className="text-xs text-muted-foreground">عدم بث اسم الشبكة</p>
            </div>
          </div>
          <button
            onClick={() => setHidden((v) => !v)}
            className={`relative h-7 w-12 rounded-full border transition-smooth ${hidden ? "border-primary bg-primary" : "border-border bg-muted"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-smooth ${hidden ? "right-0.5" : "right-[1.625rem]"}`} />
          </button>
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 font-semibold text-primary-foreground transition-smooth hover:bg-primary/90 active:scale-[0.98]">
          <Save className="h-4 w-4" />
          حفظ التغييرات
        </button>
      </div>
    </MobileShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="card-formal px-4 py-3">
      <p className="mb-1 text-[11px] font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
