import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { SpeedPoint } from "@/hooks/use-speed-history";
import { TrendingDown, TrendingUp } from "lucide-react";

const DL_COLOR = "#50B492";
const UL_COLOR = "#f87171";

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const dl = payload.find((p: any) => p.dataKey === "dl");
  const ul = payload.find((p: any) => p.dataKey === "ul");
  return (
    <div className="card-formal px-3 py-2 text-xs shadow-lg" style={{ minWidth: 120 }}>
      {dl && (
        <div className="flex items-center gap-1.5 text-primary">
          <TrendingDown className="h-3 w-3" />
          <span>تحميل: {dl.value.toFixed(1)} م.ب/ث</span>
        </div>
      )}
      {ul && (
        <div className="mt-0.5 flex items-center gap-1.5 text-red-400">
          <TrendingUp className="h-3 w-3" />
          <span>رفع: {ul.value.toFixed(1)} م.ب/ث</span>
        </div>
      )}
    </div>
  );
}

export function SpeedChart({ data }: { data: SpeedPoint[] }) {
  if (data.length < 2) {
    return (
      <div className="card-formal flex h-36 items-center justify-center">
        <p className="text-xs text-muted-foreground">جارٍ تجميع بيانات السرعة...</p>
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => Math.max(d.dl, d.ul)), 1);

  return (
    <div className="card-formal p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="h-2 w-4 rounded-full" style={{ background: DL_COLOR }} />
            <span className="text-muted-foreground">تحميل</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-4 rounded-full" style={{ background: UL_COLOR }} />
            <span className="text-muted-foreground">رفع</span>
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">م.بايت/ث · آخر {data.length} قراءة</span>
      </div>

      <ResponsiveContainer width="100%" height={110}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="dlGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={DL_COLOR} stopOpacity={0.28} />
              <stop offset="95%" stopColor={DL_COLOR} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ulGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={UL_COLOR} stopOpacity={0.2} />
              <stop offset="95%" stopColor={UL_COLOR} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.07} />
          <XAxis dataKey="time" hide />
          <YAxis hide domain={[0, maxVal * 1.2]} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="dl"
            stroke={DL_COLOR}
            fill="url(#dlGrad)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="ul"
            stroke={UL_COLOR}
            fill="url(#ulGrad)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
