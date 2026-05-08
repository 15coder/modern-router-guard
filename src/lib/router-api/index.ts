import type { RouterClient, RouterType, RouterCredentials, ConnectedDevice, WifiSettings, NetworkStats } from "./types";
import { TpLinkClient } from "./tp-link";
import { MikrotikClient } from "./mikrotik";
import { generateDemoDevices, generateDemoStats } from "./utils";

export * from "./types";

export async function detectRouterType(ip: string): Promise<RouterType> {
  const tryFetch = async (path: string, timeout = 4000) => {
    const ctrl = new AbortController();
    const id = setTimeout(() => ctrl.abort(), timeout);
    try {
      const res = await fetch(`http://${ip}${path}`, { signal: ctrl.signal });
      clearTimeout(id);
      return res;
    } catch {
      clearTimeout(id);
      return null;
    }
  };

  const [mikrotikRes, tplinkRes] = await Promise.all([
    tryFetch("/rest/system/identity"),
    tryFetch("/cgi-bin/luci/;stok=/login"),
  ]);

  if (mikrotikRes?.status === 401 || mikrotikRes?.ok) return "mikrotik";
  if (tplinkRes?.ok || tplinkRes?.status === 200) return "tp-link";

  const rootRes = await tryFetch("/");
  if (!rootRes) return "unknown";
  const html = await rootRes.text().catch(() => "");
  if (html.toLowerCase().includes("mikrotik") || html.toLowerCase().includes("routeros"))
    return "mikrotik";
  if (html.toLowerCase().includes("tp-link") || html.toLowerCase().includes("tplink"))
    return "tp-link";
  return "unknown";
}

export function createRouterClient(creds: RouterCredentials): RouterClient {
  switch (creds.type) {
    case "tp-link":
      return new TpLinkClient(creds.ip, creds.username, creds.password);
    case "mikrotik":
      return new MikrotikClient(creds.ip, creds.username, creds.password);
    default:
      return new DemoClient();
  }
}

class DemoClient implements RouterClient {
  private _blocked = new Set<string>();

  async login() {}

  async getDevices(): Promise<ConnectedDevice[]> {
    const devices = generateDemoDevices();
    return devices.map((d) => ({
      ...d,
      blocked: this._blocked.has(d.mac),
    }));
  }

  async getWifiSettings(): Promise<WifiSettings> {
    return {
      ssid_2g: "Siyaj_Home",
      ssid_5g: "Siyaj_Home_5G",
      password_2g: "strongpass2026",
      password_5g: "strongpass2026",
      hidden_2g: false,
      hidden_5g: false,
      band: "both",
      channel_2g: 6,
      channel_5g: 36,
      security: "WPA2",
    };
  }

  async updateWifiSettings(_settings: Partial<WifiSettings>): Promise<void> {
    await new Promise((r) => setTimeout(r, 800));
  }

  async getNetworkStats(): Promise<NetworkStats> {
    return generateDemoStats();
  }

  async blockDevice(mac: string): Promise<void> {
    this._blocked.add(mac);
    await new Promise((r) => setTimeout(r, 400));
  }

  async unblockDevice(mac: string): Promise<void> {
    this._blocked.delete(mac);
    await new Promise((r) => setTimeout(r, 400));
  }

  async restartRouter(): Promise<void> {
    await new Promise((r) => setTimeout(r, 2000));
  }

  async getRouterInfo() {
    return { model: "Demo Router", firmware: "v2.0", type: "unknown" as RouterType };
  }
}

let _client: RouterClient | null = null;

export function setActiveClient(client: RouterClient) {
  _client = client;
}

export function getActiveClient(): RouterClient {
  if (!_client) {
    _client = new DemoClient();
  }
  return _client;
}
