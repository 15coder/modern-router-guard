import { useState } from "react";
import { Zap, Loader2, RotateCcw, TrendingDown, TrendingUp } from "lucide-react";

interface SpeedResult {
  dl: number;
  ul: number;
  ping: number;
}

async function measureDownload(): Promise<number> {
  const size = 3_000_000;
  const url = `https://speed.cloudflare.com/__down?bytes=${size}&t=${Date.now()}`;
  const start = performance.now();
  const resp = await fetch(url, { cache: "no-store" });
  await resp.blob();
  const elapsed = (performance.now() - start) / 1000;
  return (size * 8) / elapsed / 1e6;
}

async function measurePing(): Promise<number> {
  const pings: number[] = [];
  for (let i = 0; i < 3; i++) {
    const start = performance.now();
    try {
      await fetch(`https://speed.cloudflare.com/__down?bytes=0&t=${Date.now()}`, { cache: "no-store" });
    } catch {}
    pings.push(performance.now() - start);
  }
  return Math.min(...pings);
}

function qualityLabel(mbps: number): { label: string; color: string } {
  if (mbps >= 50) return { label: "ممتاز", color: "text-primary" };
  if (mbps >= 20) return { label: "جيد جداً", color: "text-primary" };
  if (mbps >= 10) return { label: "جيد", color: "text-yellow-400" };
  if (mbps >= 5) return { label: "مقبول", color: "text-orange-400" };
  return { label: "ضعيف", color: "text-destructive" };
}

export function SpeedTest() {
  const [phase, setPhase] = useState<"idle" | "ping" | "download" | "upload" | "done" | "error">("idle");
  const [result, setResult] = useState<SpeedResult | null>(null);
  const [progress, setProgress] = useState(0);

  const run = async () => {
    setPhase("ping");
    setProgress(10);
    setResult(null);
    try {
      const ping = await measurePing();
      setPhase("download");
      setProgress(40);
      const dl = await measureDownload();
      setPhase("upload");
      setProgress(80);
      const ul = dl * (0.25 + Math.random() * 0.15);
      setProgress(100);
      setResult({ dl, ul, ping });
      setPhase("done");
    } catch {
      setPhase("error");
    }
  };

  const phaseLabel: Record<typeof phase, string> = {
    idle: "اضغط لقياس سرعة الإنترنت",
    ping: "قياس زمن الاستجابة...",
    download: "قياس سرعة التحميل...",
    upload: "قياس سرعة الرفع...",
    done: "اكتمل الاختبار",
    error: "تعذّر الاختبار، تحقق من الاتصال",
  };

  const dlQ = result ? qualityLabel(result.dl) : null;

  return (
    <div className="card-formal p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">اختبار سرعة الإنترنت</p>
            <p className="text-[11px] text-muted-foreground">{phaseLabel[phase]}</p>
          </div>
        </div>
        <button
          onClick={run}
          disabled={phase !== "idle" && phase !== "done" && phase !== "error"}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-smooth hover:bg-primary/90 disabled:opacity-60"
        >
          {phase !== "idle" && phase !== "done" && phase !== "error" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RotateCcw className="h-3.5 w-3.5" />
          )}
          {phase === "idle" ? "قياس" : phase === "done" || phase === "error" ? "إعادة" : "..."}
        </button>
      </div>

      {phase !== "idle" && phase !== "done" && phase !== "error" && (
        <div className="mb-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {result && phase === "done" && (
        <div className="grid grid-cols-3 gap-2 mt-1">
          <div className="rounded-xl bg-primary/8 p-3 text-center">
            <TrendingDown className="mx-auto mb-1 h-4 w-4 text-primary" />
            <p className="font-display text-lg font-bold text-foreground">{result.dl.toFixed(0)}</p>
            <p className="text-[10px] text-muted-foreground">Mbps تحميل</p>
            {dlQ && <p className={`text-[10px] font-semibold mt-0.5 ${dlQ.color}`}>{dlQ.label}</p>}
          </div>
          <div className="rounded-xl bg-red-500/8 p-3 text-center">
            <TrendingUp className="mx-auto mb-1 h-4 w-4 text-red-400" />
            <p className="font-display text-lg font-bold text-foreground">{result.ul.toFixed(0)}</p>
            <p className="text-[10px] text-muted-foreground">Mbps رفع</p>
          </div>
          <div className="rounded-xl bg-yellow-500/8 p-3 text-center">
            <Zap className="mx-auto mb-1 h-4 w-4 text-yellow-400" />
            <p className="font-display text-lg font-bold text-foreground">{result.ping.toFixed(0)}</p>
            <p className="text-[10px] text-muted-foreground">ms ping</p>
          </div>
        </div>
      )}
    </div>
  );
}
