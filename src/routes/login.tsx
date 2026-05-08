import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Wifi, ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { detectRouterType, createRouterClient, setActiveClient } from "@/lib/router-api";
import { useConnectionStore } from "@/lib/connection-store";
import type { RouterType } from "@/lib/router-api/types";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "سياج — تسجيل الدخول" }] }),
});

const ROUTER_TYPES: { value: RouterType; label: string; hint: string }[] = [
  { value: "unknown", label: "كشف تلقائي", hint: "يحدد النوع تلقائياً" },
  { value: "tp-link", label: "TP-Link", hint: "Archer · TL-WR · TL-MR" },
  { value: "mikrotik", label: "Mikrotik / nits", hint: "RouterOS · hAP · RB" },
];

function LoginPage() {
  const nav = useNavigate();
  const { setConnection } = useConnectionStore();
  const [ip, setIp] = useState("192.168.1.1");
  const [user, setUser] = useState("admin");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [routerType, setRouterType] = useState<RouterType>("unknown");
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [status, setStatus] = useState<"idle" | "detecting" | "connecting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    let detectedType = routerType;

    if (routerType === "unknown") {
      setStatus("detecting");
      try {
        detectedType = await detectRouterType(ip);
      } catch {
        detectedType = "unknown";
      }
    }

    setStatus("connecting");
    try {
      const client = createRouterClient({ ip, username: user, password: pass, type: detectedType });
      await client.login();
      const info = await client.getRouterInfo().catch(() => ({
        model: detectedType === "tp-link" ? "TP-Link" : detectedType === "mikrotik" ? "MikroTik" : "راوتر",
        firmware: "",
        type: detectedType,
      }));
      setActiveClient(client);
      setConnection({ ip, username: user, password: pass, routerType: detectedType, token: "", routerModel: info.model });
      setStatus("idle");
      nav({ to: "/" });
    } catch (err: any) {
      setStatus("error");
      if (err?.message?.includes("fetch") || err?.message?.includes("Failed")) {
        setErrorMsg("تعذّر الوصول إلى الراوتر. تأكد أنك متصل بنفس الشبكة.");
      } else if (err?.message?.includes("401") || err?.message?.includes("403")) {
        setErrorMsg("اسم المستخدم أو كلمة المرور غير صحيحة.");
      } else {
        setErrorMsg("حدث خطأ أثناء الاتصال. جارٍ تشغيل الوضع التجريبي...");
        setTimeout(enterDemo, 1500);
      }
    }
  };

  const enterDemo = () => {
    const demoClient = createRouterClient({ ip: "demo", username: "admin", password: "", type: "unknown" });
    setActiveClient(demoClient);
    setConnection({ ip: "demo", username: "admin", password: "", routerType: "unknown", token: "", routerModel: "وضع تجريبي" });
    nav({ to: "/" });
  };

  const selectedType = ROUTER_TYPES.find((t) => t.value === routerType)!;
  const loading = status === "detecting" || status === "connecting";

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex justify-center">
            <Logo size={96} />
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">سياج</h1>
          <p className="mt-2 text-sm text-muted-foreground">تحكّم كامل بالراوتر بأمان</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Field icon={Wifi} placeholder="عنوان الراوتر (IP)" value={ip} onChange={setIp} dir="ltr" />
          <Field placeholder="اسم المستخدم" value={user} onChange={setUser} />

          <div className="card-formal flex items-center gap-2 px-4 py-3.5">
            <input
              type={show ? "text" : "password"}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="كلمة المرور"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              dir="ltr"
            />
            <button type="button" onClick={() => setShow((v) => !v)} className="text-muted-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTypeMenu((v) => !v)}
              className="card-formal flex w-full items-center justify-between px-4 py-3 transition-smooth hover:border-primary/40"
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{selectedType.label}</p>
                <p className="text-[11px] text-muted-foreground">{selectedType.hint}</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-smooth ${showTypeMenu ? "rotate-180" : ""}`} />
            </button>

            {showTypeMenu && (
              <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-border bg-card shadow-card">
                {ROUTER_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => { setRouterType(t.value); setShowTypeMenu(false); }}
                    className={`flex w-full items-center justify-between px-4 py-3 transition-smooth hover:bg-primary/10 ${routerType === t.value ? "text-primary" : "text-foreground"}`}
                  >
                    <span className="text-[11px] text-muted-foreground">{t.hint}</span>
                    <span className="text-sm font-semibold">{t.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {status === "error" && errorMsg && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <p className="text-xs text-destructive">{errorMsg}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground transition-smooth hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {status === "detecting" ? "جارٍ التعرف على الراوتر..." : "جارٍ الاتصال..."}
              </>
            ) : "دخول"}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            لا راوتر حالياً؟{" "}
            <button type="button" className="text-primary underline underline-offset-2" onClick={enterDemo}>
              الوضع التجريبي
            </button>
          </p>
        </form>
      </div>
      <p className="text-center text-[11px] text-muted-foreground">© 2026 سياج · جميع الحقوق محفوظة</p>
    </div>
  );
}

function Field({ icon: Icon, placeholder, value, onChange, dir }: { icon?: any; placeholder: string; value: string; onChange: (v: string) => void; dir?: string }) {
  return (
    <div className="card-formal flex items-center gap-2 px-4 py-3.5">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} dir={dir}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
    </div>
  );
}
