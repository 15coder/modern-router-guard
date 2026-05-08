import { useMemo } from "react";
import type { ConnectedDevice } from "@/lib/router-api/types";
import { Wifi, Smartphone, Laptop, Tv, Tablet, HelpCircle } from "lucide-react";

const deviceColors = {
  connected: "#50B492",
  blocked: "#ef4444",
  offline: "#6b7280",
};

function getDeviceColor(d: ConnectedDevice): string {
  if (d.blocked) return deviceColors.blocked;
  if (!d.connected) return deviceColors.offline;
  return deviceColors.connected;
}

function DeviceIcon({ type }: { type: ConnectedDevice["deviceType"] }) {
  const props = { size: 12 };
  switch (type) {
    case "phone": return <Smartphone {...props} />;
    case "laptop": return <Laptop {...props} />;
    case "tv": return <Tv {...props} />;
    case "tablet": return <Tablet {...props} />;
    default: return <HelpCircle {...props} />;
  }
}

interface Props {
  devices: ConnectedDevice[];
}

export function NetworkMap({ devices }: Props) {
  const visible = useMemo(
    () => devices.slice(0, 16),
    [devices]
  );

  const SVG_SIZE = 300;
  const CX = SVG_SIZE / 2;
  const CY = SVG_SIZE / 2;
  const RADIUS = 110;

  const devicePositions = useMemo(() => {
    return visible.map((d, i) => {
      const angle = (2 * Math.PI * i) / visible.length - Math.PI / 2;
      return {
        device: d,
        x: CX + RADIUS * Math.cos(angle),
        y: CY + RADIUS * Math.sin(angle),
        color: getDeviceColor(d),
      };
    });
  }, [visible]);

  const connected = devices.filter((d) => d.connected && !d.blocked).length;
  const blocked = devices.filter((d) => d.blocked).length;
  const offline = devices.filter((d) => !d.connected).length;

  if (visible.length === 0) {
    return (
      <div className="card-formal flex h-48 items-center justify-center">
        <p className="text-xs text-muted-foreground">لا توجد أجهزة لعرضها</p>
      </div>
    );
  }

  return (
    <div className="card-formal overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">خريطة الشبكة</p>
          <div className="flex gap-3 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">{connected} متصل</span>
            </span>
            {blocked > 0 && (
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                <span className="text-muted-foreground">{blocked} محظور</span>
              </span>
            )}
            {offline > 0 && (
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground">{offline} غير متصل</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        className="w-full"
        style={{ maxHeight: 280 }}
      >
        {devicePositions.map(({ device, x, y, color }) => (
          <line
            key={`line-${device.mac}`}
            x1={CX}
            y1={CY}
            x2={x}
            y2={y}
            stroke={color}
            strokeWidth={device.connected && !device.blocked ? 1.5 : 1}
            strokeOpacity={device.connected && !device.blocked ? 0.4 : 0.2}
            strokeDasharray={device.blocked ? "4 4" : device.connected ? undefined : "2 4"}
          />
        ))}

        <circle
          cx={CX}
          cy={CY}
          r={36}
          fill="#50B492"
          fillOpacity={0.08}
          stroke="#50B492"
          strokeWidth={1}
          strokeOpacity={0.3}
        />
        <circle
          cx={CX}
          cy={CY}
          r={26}
          fill="#50B492"
          fillOpacity={0.14}
          stroke="#50B492"
          strokeWidth={1.5}
        />
        <foreignObject x={CX - 10} y={CY - 10} width={20} height={20}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              color: "#50B492",
            }}
          >
            <Wifi size={16} />
          </div>
        </foreignObject>

        {devicePositions.map(({ device, x, y, color }) => (
          <g key={`device-${device.mac}`}>
            <circle
              cx={x}
              cy={y}
              r={20}
              fill={color}
              fillOpacity={device.connected ? 0.14 : 0.08}
              stroke={color}
              strokeWidth={device.connected ? 1.5 : 1}
              strokeOpacity={device.connected ? 0.7 : 0.3}
            />
            <foreignObject x={x - 7} y={y - 7} width={14} height={14}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  color,
                  opacity: device.connected ? 1 : 0.5,
                }}
              >
                <DeviceIcon type={device.deviceType} />
              </div>
            </foreignObject>

            <text
              x={x}
              y={y + 32}
              textAnchor="middle"
              fontSize={8.5}
              fill="currentColor"
              fillOpacity={0.65}
            >
              {(device.name).slice(0, 10)}
            </text>
          </g>
        ))}

        {devices.length > 16 && (
          <text
            x={CX}
            y={SVG_SIZE - 8}
            textAnchor="middle"
            fontSize={9}
            fill="currentColor"
            fillOpacity={0.4}
          >
            +{devices.length - 16} جهاز إضافي
          </text>
        )}
      </svg>
    </div>
  );
}
