import { createFileRoute } from "@tanstack/react-router";
import { Power, RefreshCw, Lock, Globe, Info, ChevronLeft, MessageCircle, Send, Instagram, Code2, Contrast } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";
import { useContrast } from "@/hooks/use-contrast";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "سياج — الإعدادات" }] }),
});

function Row({ icon: Icon, label, hint, danger, onClick, href }: any) {
  const cls = `card-formal flex w-full items-center gap-3 p-4 transition-smooth hover:border-primary/40 active:scale-[0.99] ${danger ? "text-destructive" : ""}`;
  const inner = (
    <>
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${danger ? "bg-destructive/15 text-destructive" : "bg-primary/10 text-primary"}`}>
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
  const { on: contrast, toggle: toggleContrast } = useContrast();

  return (
    <MobileShell>
      <PageHeader title="الإعدادات" subtitle="إدارة الراوتر والتطبيق" />

      <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">الراوتر</p>
      <div className="mb-5 space-y-2">
        <Row icon={RefreshCw} label="إعادة تشغيل الراوتر" hint="إعادة التشغيل ستقطع الاتصال مؤقتاً" />
        <Row icon={Lock} label="تغيير كلمة مرور المسؤول" />
        <Row icon={Globe} label="إعدادات الشبكة (DHCP / DNS)" />
        <Row icon={Power} label="إيقاف الواي فاي مؤقتاً" danger />
      </div>

      <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">العرض</p>
      <div className="mb-5 space-y-2">
        <div className="card-formal flex w-full items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-smooth ${
                contrast ? "right-0.5" : "right-[1.625rem]"
              }`}
            />
          </button>
        </div>
      </div>

      <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">التطبيق</p>
      <div className="mb-5 space-y-2">
        <Row icon={Info} label="حول التطبيق" hint="الإصدار 1.0.0" />
      </div>

      {/* Developer card */}
      <div className="card-formal p-5">
        <div className="mb-3 flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground">المبرمج</span>
        </div>
        <p className="font-display text-lg font-bold text-foreground">نداء الرحمن محمد عبّود</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <a href="https://wa.me/963980362204" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 rounded-lg border border-border p-3 transition-smooth hover:border-primary/50 active:scale-[0.98]">
            <MessageCircle className="h-5 w-5 text-primary" />
            <span className="text-[10px]">واتساب</span>
          </a>
          <a href="https://instagram.com/15coder" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 rounded-lg border border-border p-3 transition-smooth hover:border-primary/50 active:scale-[0.98]">
            <Instagram className="h-5 w-5 text-primary" />
            <span className="text-[10px]">انستغرام</span>
          </a>
          <a href="https://t.me/qqq_support" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 rounded-lg border border-border p-3 transition-smooth hover:border-primary/50 active:scale-[0.98]">
            <Send className="h-5 w-5 text-primary" />
            <span className="text-[10px]">تلغرام</span>
          </a>
        </div>
      </div>
    </MobileShell>
  );
}
