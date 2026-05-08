import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Wifi, Eye, EyeOff, Save, Radio, Loader2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";
import { useWifiSettings, useUpdateWifi } from "@/hooks/use-router-api";
import type { WifiSettings } from "@/lib/router-api/types";

export const Route = createFileRoute("/wifi")({
  component: WifiPage,
  head: () => ({ meta: [{ title: "سياج — الواي فاي" }] }),
});

function WifiPage() {
  const { data: remote, isLoading, error, refetch, isRefetching } = useWifiSettings();
  const updateWifi = useUpdateWifi();

  const [show2g, setShow2g] = useState(false);
  const [show5g, setShow5g] = useState(false);
  const [form, setForm] = useState<WifiSettings>({
    ssid_2g: "", ssid_5g: "", password_2g: "", password_5g: "",
    hidden_2g: false, hidden_5g: false, band: "both",
    channel_2g: 6, channel_5g: 36, security: "WPA2",
  });
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [activeTab, setActiveTab] = useState<"2g" | "5g" | "advanced">("2g");

  useEffect(() => {
    if (remote) setForm(remote);
  }, [remote]);

  const set = <K extends keyof WifiSettings>(key: K, val: WifiSettings[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      await updateWifi.mutateAsync(form);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2500);
    }
  };

  const channels2g = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const channels5g = [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 149, 153, 157, 161];
  const securities: WifiSettings["security"][] = ["WPA2", "WPA3", "WPA2/WPA3"];

  if (isLoading) return (
    <MobileShell>
      <PageHeader title="إعدادات الواي فاي" subtitle="تحميل البيانات..." />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <div key={i} className="card-formal h-16 animate-pulse bg-muted" />)}
      </div>
    </MobileShell>
  );

  return (
    <MobileShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">الواي فاي</h1>
          <p className="mt-1 text-sm text-muted-foreground">إدارة شبكتك اللاسلكية</p>
        </div>
        <button onClick={() => refetch()} className="card-formal flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-smooth hover:text-primary">
          <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
          <p className="text-xs text-destructive">يعمل بالبيانات الافتراضية — الراوتر غير متاح</p>
        </div>
      )}

      <div className="card-formal mb-5 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wifi className="h-6 w-6" />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-foreground">{form.ssid_2g || "—"}</p>
            <p className="text-xs text-muted-foreground">
              {form.band === "both" ? "ثنائية النطاق" : `${form.band}GHz`} · {form.security}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 card-formal grid grid-cols-3 gap-1 p-1">
        {(["2g", "5g", "advanced"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg py-2 text-xs font-semibold transition-smooth ${activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab === "2g" ? "2.4GHz" : tab === "5g" ? "5GHz" : "متقدم"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {activeTab === "2g" && (
          <>
            <Field label="اسم الشبكة 2.4GHz (SSID)">
              <input value={form.ssid_2g} onChange={(e) => set("ssid_2g", e.target.value)}
                className="w-full bg-transparent text-sm outline-none" placeholder="اسم الشبكة" />
            </Field>
            <Field label="كلمة مرور 2.4GHz">
              <div className="flex items-center gap-2">
                <input type={show2g ? "text" : "password"} value={form.password_2g}
                  onChange={(e) => set("password_2g", e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none" dir="ltr" placeholder="••••••••" />
                <button onClick={() => setShow2g((v) => !v)} className="text-muted-foreground hover:text-foreground">
                  {show2g ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
            <Field label="القناة (Channel)">
              <select value={form.channel_2g} onChange={(e) => set("channel_2g", parseInt(e.target.value))}
                className="w-full bg-transparent text-sm outline-none" dir="ltr">
                {channels2g.map((c) => <option key={c} value={c}>قناة {c}</option>)}
              </select>
            </Field>
            <ToggleRow label="إخفاء الشبكة 2.4GHz" hint="عدم بث اسم SSID"
              on={form.hidden_2g} onToggle={() => set("hidden_2g", !form.hidden_2g)} />
          </>
        )}

        {activeTab === "5g" && (
          <>
            <Field label="اسم الشبكة 5GHz (SSID)">
              <input value={form.ssid_5g} onChange={(e) => set("ssid_5g", e.target.value)}
                className="w-full bg-transparent text-sm outline-none" placeholder="اسم الشبكة" />
            </Field>
            <Field label="كلمة مرور 5GHz">
              <div className="flex items-center gap-2">
                <input type={show5g ? "text" : "password"} value={form.password_5g}
                  onChange={(e) => set("password_5g", e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none" dir="ltr" placeholder="••••••••" />
                <button onClick={() => setShow5g((v) => !v)} className="text-muted-foreground hover:text-foreground">
                  {show5g ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
            <Field label="القناة (Channel)">
              <select value={form.channel_5g} onChange={(e) => set("channel_5g", parseInt(e.target.value))}
                className="w-full bg-transparent text-sm outline-none" dir="ltr">
                {channels5g.map((c) => <option key={c} value={c}>قناة {c}</option>)}
              </select>
            </Field>
            <ToggleRow label="إخفاء الشبكة 5GHz" hint="عدم بث اسم SSID"
              on={form.hidden_5g} onToggle={() => set("hidden_5g", !form.hidden_5g)} />
          </>
        )}

        {activeTab === "advanced" && (
          <>
            <div>
              <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">نطاق التشغيل</p>
              <div className="card-formal grid grid-cols-3 gap-1 p-1">
                {(["2.4", "5", "both"] as const).map((b) => (
                  <button key={b} onClick={() => set("band", b)}
                    className={`rounded-lg py-2.5 text-xs font-semibold transition-smooth ${form.band === b ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    {b === "both" ? "كلاهما" : `${b}GHz`}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">بروتوكول الحماية</p>
              <div className="card-formal grid grid-cols-3 gap-1 p-1">
                {securities.map((s) => (
                  <button key={s} onClick={() => set("security", s)}
                    className={`rounded-lg py-2.5 text-xs font-semibold transition-smooth ${form.security === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <button
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition-smooth active:scale-[0.98] disabled:opacity-60 ${
            saveStatus === "success" ? "bg-green-600 text-white" :
            saveStatus === "error" ? "bg-destructive text-white" :
            "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {saveStatus === "saving" ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> جارٍ الحفظ...</>
          ) : saveStatus === "success" ? (
            <><CheckCircle2 className="h-4 w-4" /> تم الحفظ</>
          ) : saveStatus === "error" ? (
            <><AlertCircle className="h-4 w-4" /> فشل الحفظ</>
          ) : (
            <><Save className="h-4 w-4" /> حفظ التغييرات</>
          )}
        </button>
      </div>
    </MobileShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="card-formal px-4 py-3">
      <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function ToggleRow({ label, hint, on, onToggle }: { label: string; hint: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="card-formal flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Radio className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </div>
      <button onClick={onToggle}
        className={`relative h-7 w-12 rounded-full border transition-smooth ${on ? "border-primary bg-primary" : "border-border bg-muted"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-smooth ${on ? "right-0.5" : "right-[1.625rem]"}`} />
      </button>
    </div>
  );
}
