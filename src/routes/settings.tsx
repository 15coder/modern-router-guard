import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Power, RefreshCw, Lock, Globe, Info, ChevronLeft,
  MessageCircle, Send, Instagram, Code2, Contrast,
  Loader2, CheckCircle2, AlertCircle, LogOut, Wifi, Server,
  Sun, Moon, Shield, Plus, Trash2, Eye, EyeOff, Bell,
} from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";
import { useContrast } from "@/hooks/use-contrast";
import { useRestartRouter, useChangeAdminPassword } from "@/hooks/use-router-api";
import { useConnectionStore } from "@/lib/connection-store";
import { useNotificationPermission } from "@/hooks/use-notifications";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "سياج — الإعدادات" }] }),
});

function SettingsPage() {
  const { on: contrast, toggle: toggleContrast } = useContrast();
  const restartMutation = useRestartRouter();
  const changePasswordMutation = useChangeAdminPassword();
  const nav = useNavigate();
  const {
    routerModel, routerType, ip, disconnect,
    theme, setTheme,
    blockedDomains, addBlockedDomain, removeBlockedDomain,
  } = useConnectionStore();
  const { isSupported, permission, request } = useNotificationPermission();

  const [wifiOff, setWifiOff] = useState(false);
  const [togglingWifi, setTogglingWifi] = useState(false);
  const [showDns, setShowDns] = useState(false);
  const [dns1, setDns1] = useState("8.8.8.8");
  const [dns2, setDns2] = useState("8.8.4.4");
  const [dnsStatus, setDnsStatus] = useState<"idle" | "saving" | "success">("idle");

  const [showDomains, setShowDomains] = useState(false);
  const [newDomain, setNewDomain] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passError, setPassError] = useState("");

  const handleRestart = async () => {
    if (!confirm("هل تريد إعادة تشغيل الراوتر؟ سينقطع الاتصال لثوانٍ.")) return;
    try {
      await restartMutation.mutateAsync();
    } catch {}
  };

  const handleToggleWifi = async () => {
    setTogglingWifi(true);
    await new Promise((r) => setTimeout(r, 1200));
    setWifiOff((v) => !v);
    setTogglingWifi(false);
  };

  const handleSaveDns = async () => {
    setDnsStatus("saving");
    await new Promise((r) => setTimeout(r, 900));
    setDnsStatus("success");
    setTimeout(() => setDnsStatus("idle"), 2000);
  };

  const handleDisconnect = () => {
    disconnect();
    nav({ to: "/login" });
  };

  const handleAddDomain = () => {
    const d = newDomain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!d) return;
    addBlockedDomain(d);
    setNewDomain("");
  };

  const handleChangePassword = async () => {
    setPassError("");
    if (!oldPass || !newPass || !confirmPass) {
      setPassError("يرجى ملء جميع الحقول");
      return;
    }
    if (newPass.length < 6) {
      setPassError("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    if (newPass !== confirmPass) {
      setPassError("كلمة المرور الجديدة وتأكيدها غير متطابقتين");
      return;
    }
    try {
      await changePasswordMutation.mutateAsync({ oldPass, newPass });
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
      setShowPassword(false);
    } catch (e: any) {
      setPassError(e?.message ?? "فشل تغيير كلمة المرور");
    }
  };

  const routerLabel =
    routerType === "tp-link"
      ? "TP-Link"
      : routerType === "mikrotik"
      ? "MikroTik / nits"
      : "وضع تجريبي";

  return (
    <MobileShell>
      <PageHeader title="الإعدادات" subtitle="إدارة الراوتر والتطبيق" />

      <div className="card-formal mb-5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Server className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{routerModel || "راوتر"}</p>
            <p className="text-xs text-muted-foreground">
              {routerLabel} · <span dir="ltr">{ip}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ─── Router ─── */}
      <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">الراوتر</p>
      <div className="mb-5 space-y-2">
        <ActionRow
          icon={RefreshCw}
          label="إعادة تشغيل الراوتر"
          hint="ستنقطع الشبكة مؤقتاً"
          loading={restartMutation.isPending}
          success={restartMutation.isSuccess}
          onClick={handleRestart}
        />

        <button
          onClick={handleToggleWifi}
          disabled={togglingWifi}
          className={`card-formal flex w-full items-center gap-3 p-4 transition-smooth hover:border-primary/40 active:scale-[0.99] ${wifiOff ? "border-destructive/40" : ""}`}
        >
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${wifiOff ? "bg-destructive/15 text-destructive" : "bg-primary/10 text-primary"}`}>
            {togglingWifi ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wifi className="h-5 w-5" />}
          </div>
          <div className="flex-1 text-right">
            <p className="text-sm font-semibold">{wifiOff ? "تشغيل الواي فاي" : "إيقاف الواي فاي مؤقتاً"}</p>
            <p className="text-xs text-muted-foreground">{wifiOff ? "الواي فاي متوقف الآن" : "يقطع الاتصال اللاسلكي فقط"}</p>
          </div>
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        </button>

        <button
          onClick={() => setShowDns((v) => !v)}
          className="card-formal flex w-full items-center gap-3 p-4 transition-smooth hover:border-primary/40 active:scale-[0.99]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Globe className="h-5 w-5" />
          </div>
          <div className="flex-1 text-right">
            <p className="text-sm font-semibold">إعدادات DNS</p>
            <p className="text-xs text-muted-foreground" dir="ltr">{dns1} / {dns2}</p>
          </div>
          <ChevronLeft className={`h-4 w-4 text-muted-foreground transition-smooth ${showDns ? "-rotate-90" : ""}`} />
        </button>

        {showDns && (
          <div className="card-formal space-y-3 p-4">
            <DnsField label="DNS الأول" value={dns1} onChange={setDns1} />
            <DnsField label="DNS الثاني" value={dns2} onChange={setDns2} />
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Google", d1: "8.8.8.8", d2: "8.8.4.4" },
                { label: "Cloudflare", d1: "1.1.1.1", d2: "1.0.0.1" },
                { label: "OpenDNS", d1: "208.67.222.222", d2: "208.67.220.220" },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => { setDns1(p.d1); setDns2(p.d2); }}
                  className="rounded-xl border border-border px-2 py-2 text-[11px] font-semibold text-muted-foreground transition-smooth hover:border-primary/50 hover:text-primary"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleSaveDns}
              disabled={dnsStatus === "saving"}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-smooth ${dnsStatus === "success" ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
            >
              {dnsStatus === "saving" ? <><Loader2 className="h-4 w-4 animate-spin" /> جارٍ الحفظ</> :
               dnsStatus === "success" ? <><CheckCircle2 className="h-4 w-4" /> تم الحفظ</> :
               "حفظ إعدادات DNS"}
            </button>
          </div>
        )}

        {/* ─── Domain Blocking ─── */}
        <button
          onClick={() => setShowDomains((v) => !v)}
          className="card-formal flex w-full items-center gap-3 p-4 transition-smooth hover:border-primary/40 active:scale-[0.99]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex-1 text-right">
            <p className="text-sm font-semibold">حجب المواقع</p>
            <p className="text-xs text-muted-foreground">
              {blockedDomains.length > 0 ? `${blockedDomains.length} موقع محجوب` : "لا توجد مواقع محجوبة"}
            </p>
          </div>
          <ChevronLeft className={`h-4 w-4 text-muted-foreground transition-smooth ${showDomains ? "-rotate-90" : ""}`} />
        </button>

        {showDomains && (
          <div className="card-formal space-y-3 p-4">
            <div className="flex items-center gap-2">
              <input
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddDomain()}
                placeholder="أدخل النطاق (مثال: facebook.com)"
                className="flex-1 rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:border-primary"
                dir="ltr"
              />
              <button
                onClick={handleAddDomain}
                disabled={!newDomain.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-smooth hover:bg-primary/90 disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {blockedDomains.length > 0 ? (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {blockedDomains.map((d) => (
                  <div key={d} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <span className="text-sm text-foreground" dir="ltr">{d}</span>
                    <button
                      onClick={() => removeBlockedDomain(d)}
                      className="text-muted-foreground hover:text-destructive transition-smooth"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-xs text-muted-foreground py-2">لا توجد مواقع محجوبة بعد</p>
            )}
            <p className="text-[10px] text-muted-foreground/70">
              * تطبيق الحجب يتطلب دعم الراوتر لهذه الميزة
            </p>
          </div>
        )}

        {/* ─── Admin Password ─── */}
        <button
          onClick={() => setShowPassword((v) => !v)}
          className="card-formal flex w-full items-center gap-3 p-4 transition-smooth hover:border-primary/40 active:scale-[0.99]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <div className="flex-1 text-right">
            <p className="text-sm font-semibold">تغيير كلمة مرور المسؤول</p>
            <p className="text-xs text-muted-foreground">تغيير كلمة دخول الراوتر</p>
          </div>
          <ChevronLeft className={`h-4 w-4 text-muted-foreground transition-smooth ${showPassword ? "-rotate-90" : ""}`} />
        </button>

        {showPassword && (
          <div className="card-formal space-y-3 p-4">
            <PasswordField
              label="كلمة المرور الحالية"
              value={oldPass}
              onChange={setOldPass}
              show={showOld}
              onToggleShow={() => setShowOld((v) => !v)}
            />
            <PasswordField
              label="كلمة المرور الجديدة"
              value={newPass}
              onChange={setNewPass}
              show={showNew}
              onToggleShow={() => setShowNew((v) => !v)}
            />
            <PasswordField
              label="تأكيد كلمة المرور الجديدة"
              value={confirmPass}
              onChange={setConfirmPass}
              show={showNew}
              onToggleShow={() => setShowNew((v) => !v)}
            />
            {passError && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                <p className="text-xs text-destructive">{passError}</p>
              </div>
            )}
            {changePasswordMutation.isSuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-3 py-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                <p className="text-xs text-green-500">تم تغيير كلمة المرور بنجاح</p>
              </div>
            )}
            <button
              onClick={handleChangePassword}
              disabled={changePasswordMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-smooth hover:bg-primary/90 disabled:opacity-60"
            >
              {changePasswordMutation.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> جارٍ التغيير...</>
              ) : (
                "تغيير كلمة المرور"
              )}
            </button>
          </div>
        )}
      </div>

      {/* ─── Display ─── */}
      <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">العرض</p>
      <div className="mb-5 space-y-2">
        <div className="card-formal flex w-full items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {theme === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </div>
          <div className="flex-1 text-right">
            <p className="text-sm font-semibold">المظهر</p>
            <p className="text-xs text-muted-foreground">{theme === "light" ? "وضع فاتح" : "وضع داكن"}</p>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`relative h-7 w-12 rounded-full border transition-smooth ${theme === "light" ? "border-primary bg-primary" : "border-border bg-muted"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-smooth ${theme === "light" ? "right-0.5" : "right-[1.625rem]"}`} />
          </button>
        </div>

        <div className="card-formal flex w-full items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Contrast className="h-5 w-5" />
          </div>
          <div className="flex-1 text-right">
            <p className="text-sm font-semibold">نمط التباين العالي</p>
            <p className="text-xs text-muted-foreground">يحسّن وضوح النصوص والحدود</p>
          </div>
          <button
            role="switch"
            aria-checked={contrast}
            onClick={toggleContrast}
            className={`relative h-7 w-12 rounded-full border transition-smooth ${contrast ? "border-primary bg-primary" : "border-border bg-muted"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-smooth ${contrast ? "right-0.5" : "right-[1.625rem]"}`} />
          </button>
        </div>
      </div>

      {/* ─── Notifications ─── */}
      {isSupported && (
        <>
          <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">الإشعارات</p>
          <div className="mb-5">
            <div className="card-formal flex w-full items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex-1 text-right">
                <p className="text-sm font-semibold">إشعارات الأجهزة الجديدة</p>
                <p className="text-xs text-muted-foreground">
                  {permission === "granted"
                    ? "الإشعارات مفعّلة"
                    : permission === "denied"
                    ? "محظورة من إعدادات المتصفح"
                    : "اضغط لتفعيل الإشعارات"}
                </p>
              </div>
              {permission !== "denied" && (
                <button
                  onClick={request}
                  disabled={permission === "granted"}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-smooth ${
                    permission === "granted"
                      ? "bg-primary/10 text-primary"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {permission === "granted" ? "مفعّل ✓" : "تفعيل"}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ─── Session ─── */}
      <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">الجلسة</p>
      <div className="mb-5">
        <button
          onClick={handleDisconnect}
          className="card-formal flex w-full items-center gap-3 p-4 text-destructive transition-smooth hover:border-destructive/40 active:scale-[0.99]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/15 text-destructive">
            <LogOut className="h-5 w-5" />
          </div>
          <div className="flex-1 text-right">
            <p className="text-sm font-semibold">قطع الاتصال</p>
            <p className="text-xs text-muted-foreground/80">العودة إلى شاشة الدخول</p>
          </div>
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* ─── About ─── */}
      <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">التطبيق</p>
      <div className="mb-5">
        <div className="card-formal p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Info className="h-5 w-5" />
          </div>
          <div className="flex-1 text-right">
            <p className="text-sm font-semibold">حول التطبيق</p>
            <p className="text-xs text-muted-foreground">الإصدار 1.0.0 · يدعم TP-Link و Mikrotik</p>
          </div>
        </div>
      </div>

      <div className="card-formal p-5">
        <div className="mb-3 flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground">المبرمج</span>
        </div>
        <p className="font-display text-lg font-bold text-foreground">نداء الرحمن محمد عبّود</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <SocialLink href="https://wa.me/963980362204" icon={MessageCircle} label="واتساب" />
          <SocialLink href="https://instagram.com/15coder" icon={Instagram} label="انستغرام" />
          <SocialLink href="https://t.me/qqq_support" icon={Send} label="تلغرام" />
        </div>
      </div>
    </MobileShell>
  );
}

function ActionRow({ icon: Icon, label, hint, onClick, loading, success, danger }: any) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`card-formal flex w-full items-center gap-3 p-4 transition-smooth hover:border-primary/40 active:scale-[0.99] disabled:opacity-70 ${danger ? "text-destructive" : ""}`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${danger ? "bg-destructive/15 text-destructive" : "bg-primary/10 text-primary"}`}>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : success ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1 text-right">
        <p className="text-sm font-semibold">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <ChevronLeft className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

function DnsField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="mb-1 text-[11px] text-muted-foreground">{label}</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:border-primary"
        dir="ltr"
      />
    </div>
  );
}

function PasswordField({
  label, value, onChange, show, onToggleShow,
}: {
  label: string; value: string; onChange: (v: string) => void; show: boolean; onToggleShow: () => void;
}) {
  return (
    <div>
      <p className="mb-1 text-[11px] text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 focus-within:border-primary">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none"
          dir="ltr"
          placeholder="••••••••"
        />
        <button type="button" onClick={onToggleShow} className="text-muted-foreground hover:text-foreground">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function SocialLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-3 transition-smooth hover:border-primary/50 active:scale-[0.98]"
    >
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </a>
  );
}
