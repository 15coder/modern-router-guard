import { createFileRoute, Link } from "@tanstack/react-router";
import { Power, RefreshCw, Lock, Globe, Info, ChevronLeft, MessageCircle, Send, Instagram, Code2 } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "سياج — الإعدادات" }] }),
});

function Row({ icon: Icon, label, hint, danger, onClick, href }: any) {
  const cls = `glass flex w-full items-center gap-3 rounded-2xl p-4 transition-smooth active:scale-[0.98] ${danger ? "text-destructive" : ""}`;
  const inner = (
    <>
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${danger ? "bg-destructive/15" : "bg-primary/15 text-primary"}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 text-right">
        <p className="text-sm font-semibold">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <ChevronLeft className="h-4 w-4 text-muted-foreground" />
    </>
  );
  if (href) return <a href={href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>;
  return <button onClick={onClick} className={cls}>{inner}</button>;
}

function SettingsPage() {
  return (
    <MobileShell>
      <PageHeader title="الإعدادات" subtitle="إدارة الراوتر والتطبيق" />

      <p className="mb-2 px-2 text-xs text-muted-foreground">الراوتر</p>
      <div className="mb-5 space-y-2">
        <Row icon={RefreshCw} label="إعادة تشغيل الراوتر" hint="إعادة التشغيل ستقطع الاتصال مؤقتاً" />
        <Row icon={Lock} label="تغيير كلمة مرور المسؤول" />
        <Row icon={Globe} label="إعدادات الشبكة (DHCP / DNS)" />
        <Row icon={Power} label="إيقاف الواي فاي مؤقتاً" danger />
      </div>

      <p className="mb-2 px-2 text-xs text-muted-foreground">التطبيق</p>
      <div className="mb-5 space-y-2">
        <Row icon={Info} label="حول التطبيق" hint="الإصدار 1.0.0" />
      </div>

      {/* Developer card */}
      <div className="bg-gradient-surface relative overflow-hidden rounded-3xl border border-border p-5 shadow-card">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">المبرمج</span>
          </div>
          <p className="font-display text-lg font-bold">نداء الرحمن محمد عبّود</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <a href="https://wa.me/963980362204" target="_blank" rel="noreferrer" className="glass flex flex-col items-center gap-1 rounded-2xl p-3 transition-smooth active:scale-95">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="text-[10px]">واتساب</span>
            </a>
            <a href="https://instagram.com/15coder" target="_blank" rel="noreferrer" className="glass flex flex-col items-center gap-1 rounded-2xl p-3 transition-smooth active:scale-95">
              <Instagram className="h-5 w-5 text-primary" />
              <span className="text-[10px]">انستغرام</span>
            </a>
            <a href="https://t.me/qqq_support" target="_blank" rel="noreferrer" className="glass flex flex-col items-center gap-1 rounded-2xl p-3 transition-smooth active:scale-95">
              <Send className="h-5 w-5 text-primary" />
              <span className="text-[10px]">تلغرام</span>
            </a>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
