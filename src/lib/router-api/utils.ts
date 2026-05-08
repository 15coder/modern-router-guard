import type { ConnectedDevice } from "./types";

export function guessDeviceType(name: string): ConnectedDevice["deviceType"] {
  const n = name.toLowerCase();
  if (/iphone|android|phone|mobile|xiaomi|redmi|samsung|huawei|oppo|vivo|galaxy/.test(n))
    return "phone";
  if (/ipad|tablet/.test(n)) return "tablet";
  if (/mac|laptop|notebook|thinkpad|dell|hp|lenovo|asus|acer|surface/.test(n))
    return "laptop";
  if (/tv|smart-tv|roku|firetv|chromecast|apple-tv|shield/.test(n)) return "tv";
  return "unknown";
}

export function guessVendor(mac: string): string {
  const prefix = mac.replace(/[:-]/g, "").slice(0, 6).toUpperCase();
  const vendors: Record<string, string> = {
    "A4C3F0": "Apple",
    "B8C75A": "Apple",
    "D89695": "Apple",
    "3C2EFF": "Apple",
    "00E04C": "Realtek",
    "C81479": "Samsung",
    "B827EB": "Raspberry Pi",
    "DC2B2A": "Xiaomi",
    "F48E92": "Xiaomi",
    "601452": "Huawei",
    "001E10": "D-Link",
    "00266C": "TP-Link",
    "E84DD6": "TP-Link",
    "1811E0": "TP-Link",
  };
  return vendors[prefix] ?? "غير معروف";
}

export function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d} يوم ${h} ساعة`;
  if (h > 0) return `${h} ساعة ${m} دقيقة`;
  return `${m} دقيقة`;
}

export function generateDemoDevices(): ConnectedDevice[] {
  return [
    {
      id: "1",
      name: "iPhone — أحمد",
      mac: "A4:C3:F0:12:88:01",
      ip: "192.168.1.12",
      deviceType: "phone",
      vendor: "Apple",
      blocked: false,
      connected: true,
      signal: -55,
    },
    {
      id: "2",
      name: "MacBook Pro",
      mac: "B2:91:AC:55:21:7E",
      ip: "192.168.1.5",
      deviceType: "laptop",
      vendor: "Apple",
      blocked: false,
      connected: true,
      signal: -48,
    },
    {
      id: "3",
      name: "Samsung TV",
      mac: "C8:14:79:33:A1:09",
      ip: "192.168.1.8",
      deviceType: "tv",
      vendor: "Samsung",
      blocked: false,
      connected: true,
      signal: -62,
    },
    {
      id: "4",
      name: "جهاز غير معروف",
      mac: "F1:22:8E:90:11:42",
      ip: "192.168.1.22",
      deviceType: "unknown",
      vendor: "غير معروف",
      blocked: false,
      connected: true,
      isNew: true,
      signal: -71,
    },
    {
      id: "5",
      name: "Redmi Note 12",
      mac: "DC:2B:2A:42:90:FF",
      ip: "192.168.1.18",
      deviceType: "phone",
      vendor: "Xiaomi",
      blocked: false,
      connected: true,
      signal: -58,
    },
    {
      id: "6",
      name: "iPad — سارة",
      mac: "3C:2E:FF:11:22:AB",
      ip: "192.168.1.31",
      deviceType: "tablet",
      vendor: "Apple",
      blocked: false,
      connected: false,
      signal: -80,
    },
    {
      id: "7",
      name: "Laptop — محمد",
      mac: "60:14:52:88:77:CD",
      ip: "192.168.1.45",
      deviceType: "laptop",
      vendor: "Huawei",
      blocked: false,
      connected: true,
      signal: -65,
    },
  ];
}

export function generateDemoStats() {
  return {
    downloadMbps: 48.2 + (Math.random() - 0.5) * 8,
    uploadMbps: 12.6 + (Math.random() - 0.5) * 3,
    connectedDevices: 7,
    uptimeSeconds: 3 * 86400 + 4 * 3600 + 22 * 60,
    wanIp: "185.236.114.22",
    dns1: "8.8.8.8",
    dns2: "8.8.4.4",
  };
}
