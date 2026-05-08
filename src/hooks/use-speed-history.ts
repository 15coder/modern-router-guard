import { useState, useEffect } from "react";
import type { NetworkStats } from "@/lib/router-api/types";

export interface SpeedPoint {
  time: string;
  dl: number;
  ul: number;
}

const MAX_POINTS = 20;

export function useSpeedHistory(stats: NetworkStats | undefined): SpeedPoint[] {
  const [history, setHistory] = useState<SpeedPoint[]>([]);

  useEffect(() => {
    if (!stats) return;
    const time = new Date().toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setHistory((prev) => {
      const next = [
        ...prev,
        { time, dl: Math.max(0, stats.downloadMbps), ul: Math.max(0, stats.uploadMbps) },
      ];
      return next.slice(-MAX_POINTS);
    });
  }, [stats]);

  return history;
}
