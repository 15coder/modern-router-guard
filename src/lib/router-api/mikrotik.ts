import type {
  RouterClient,
  ConnectedDevice,
  WifiSettings,
  NetworkStats,
  RouterInfo,
} from "./types";
import { guessDeviceType, guessVendor } from "./utils";

export class MikrotikClient implements RouterClient {
  private ip: string;
  private username: string;
  private password: string;
  private baseUrl: string;
  private authHeader: string;

  constructor(ip: string, username: string, password: string) {
    this.ip = ip;
    this.username = username;
    this.password = password;
    this.baseUrl = `http://${ip}/rest`;
    this.authHeader =
      "Basic " + btoa(`${username}:${password}`);
  }

  private async get(path: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error(`Mikrotik ${path} → ${res.status}`);
    return res.json();
  }

  private async post(path: string, body: object): Promise<any> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Mikrotik POST ${path} → ${res.status}`);
    return res.json().catch(() => ({}));
  }

  private async patch(path: string, body: object): Promise<any> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "PATCH",
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Mikrotik PATCH ${path} → ${res.status}`);
    return res.json().catch(() => ({}));
  }

  async login(): Promise<void> {
    await this.get("/system/identity");
  }

  async getDevices(): Promise<ConnectedDevice[]> {
    const [arpList, leases, regTable] = await Promise.all([
      this.get("/ip/arp").catch(() => [] as any[]),
      this.get("/ip/dhcp-server/lease").catch(() => [] as any[]),
      this.get("/interface/wireless/registration-table").catch(() => [] as any[]),
    ]);

    const leaseMap = new Map<string, any>();
    for (const l of leases) leaseMap.set(l["mac-address"], l);

    const regMap = new Map<string, any>();
    for (const r of regTable) regMap.set(r["mac-address"], r);

    const seen = new Set<string>();
    const devices: ConnectedDevice[] = [];

    for (const arp of arpList) {
      const mac = arp["mac-address"] ?? "";
      if (!mac || seen.has(mac)) continue;
      seen.add(mac);

      const lease = leaseMap.get(mac);
      const reg = regMap.get(mac);
      const hostname =
        lease?.["host-name"] ?? lease?.comment ?? arp.comment ?? "";

      devices.push({
        id: mac,
        name: hostname || "جهاز غير معروف",
        mac,
        ip: arp.address ?? "",
        deviceType: guessDeviceType(hostname),
        vendor: guessVendor(mac),
        blocked: lease?.disabled === "true",
        connected: arp.complete === "true",
        isNew: false,
        signal: reg ? parseInt(reg["signal-strength"] ?? "0") : undefined,
        rxBytes: reg ? parseInt(reg.bytes?.split(",")[0] ?? "0") : undefined,
        txBytes: reg ? parseInt(reg.bytes?.split(",")[1] ?? "0") : undefined,
      });
    }
    return devices;
  }

  async getWifiSettings(): Promise<WifiSettings> {
    const ifaces: any[] = await this.get("/interface/wireless").catch(() => []);
    const iface2g = ifaces.find((i) => i.band?.includes("2ghz")) ?? ifaces[0] ?? {};
    const iface5g = ifaces.find((i) => i.band?.includes("5ghz")) ?? ifaces[1] ?? {};

    return {
      ssid_2g: iface2g.ssid ?? "MikroTik",
      ssid_5g: iface5g.ssid ?? "MikroTik_5G",
      password_2g: "",
      password_5g: "",
      hidden_2g: iface2g.hide_ssid === "true",
      hidden_5g: iface5g.hide_ssid === "true",
      band: "both",
      channel_2g: parseInt(iface2g.frequency ?? "2412"),
      channel_5g: parseInt(iface5g.frequency ?? "5180"),
      security: "WPA2",
    };
  }

  async updateWifiSettings(settings: Partial<WifiSettings>): Promise<void> {
    const ifaces: any[] = await this.get("/interface/wireless").catch(() => []);
    const iface2g = ifaces.find((i) => i.band?.includes("2ghz")) ?? ifaces[0];
    const iface5g = ifaces.find((i) => i.band?.includes("5ghz")) ?? ifaces[1];

    if (iface2g?.[".id"]) {
      await this.patch(`/interface/wireless/${iface2g[".id"]}`, {
        ssid: settings.ssid_2g,
        "hide-ssid": settings.hidden_2g ? "true" : "false",
      });
    }
    if (iface5g?.[".id"]) {
      await this.patch(`/interface/wireless/${iface5g[".id"]}`, {
        ssid: settings.ssid_5g,
        "hide-ssid": settings.hidden_5g ? "true" : "false",
      });
    }
  }

  async getNetworkStats(): Promise<NetworkStats> {
    const [identity, ifaces, resources] = await Promise.all([
      this.get("/system/identity").catch(() => ({})),
      this.get("/interface").catch(() => [] as any[]),
      this.get("/system/resource").catch(() => ({})),
    ]);

    const wan = (ifaces as any[]).find((i) => i.type === "ether" && i.running === "true") ?? {};
    const uptimeStr: string = resources.uptime ?? "0s";
    const uptimeSec = parseUptime(uptimeStr);

    return {
      downloadMbps: parseFloat(wan["rx-byte"] ?? "0") / 1e6,
      uploadMbps: parseFloat(wan["tx-byte"] ?? "0") / 1e6,
      connectedDevices: 0,
      uptimeSeconds: uptimeSec,
      wanIp: "",
      dns1: "8.8.8.8",
      dns2: "8.8.4.4",
    };
  }

  async blockDevice(mac: string): Promise<void> {
    const leases: any[] = await this.get("/ip/dhcp-server/lease").catch(() => []);
    const lease = leases.find((l) => l["mac-address"] === mac);
    if (lease?.[".id"]) {
      await this.patch(`/ip/dhcp-server/lease/${lease[".id"]}`, {
        disabled: "true",
      });
    } else {
      await this.post("/ip/firewall/filter", {
        chain: "forward",
        "src-mac-address": mac,
        action: "drop",
        comment: `siyaj-block-${mac}`,
        disabled: "false",
      });
    }
  }

  async unblockDevice(mac: string): Promise<void> {
    const leases: any[] = await this.get("/ip/dhcp-server/lease").catch(() => []);
    const lease = leases.find((l) => l["mac-address"] === mac);
    if (lease?.[".id"]) {
      await this.patch(`/ip/dhcp-server/lease/${lease[".id"]}`, {
        disabled: "false",
      });
    }
    const rules: any[] = await this.get("/ip/firewall/filter").catch(() => []);
    for (const r of rules) {
      if (r.comment?.includes(mac) && r[".id"]) {
        await fetch(`${this.baseUrl}/ip/firewall/filter/${r[".id"]}`, {
          method: "DELETE",
          headers: { Authorization: this.authHeader },
        });
      }
    }
  }

  async restartRouter(): Promise<void> {
    await this.post("/system/reboot", {});
  }

  async getRouterInfo(): Promise<RouterInfo> {
    const [identity, resources] = await Promise.all([
      this.get("/system/identity").catch(() => ({})),
      this.get("/system/resource").catch(() => ({})),
    ]);
    return {
      model: resources["board-name"] ?? "MikroTik",
      firmware: resources.version ?? "Unknown",
      type: "mikrotik",
    };
  }
}

function parseUptime(uptime: string): number {
  let total = 0;
  const weeks = uptime.match(/(\d+)w/);
  const days = uptime.match(/(\d+)d/);
  const hours = uptime.match(/(\d+)h/);
  const mins = uptime.match(/(\d+)m/);
  const secs = uptime.match(/(\d+)s/);
  if (weeks) total += parseInt(weeks[1]) * 7 * 86400;
  if (days) total += parseInt(days[1]) * 86400;
  if (hours) total += parseInt(hours[1]) * 3600;
  if (mins) total += parseInt(mins[1]) * 60;
  if (secs) total += parseInt(secs[1]);
  return total;
}
