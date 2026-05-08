export type RouterType = "tp-link" | "mikrotik" | "unknown";

export interface RouterCredentials {
  ip: string;
  username: string;
  password: string;
  type: RouterType;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  mac: string;
  ip: string;
  deviceType: "phone" | "laptop" | "tv" | "tablet" | "unknown";
  blocked: boolean;
  isNew?: boolean;
  vendor?: string;
  rxBytes?: number;
  txBytes?: number;
  signal?: number;
  connected: boolean;
}

export interface WifiSettings {
  ssid_2g: string;
  ssid_5g: string;
  password_2g: string;
  password_5g: string;
  hidden_2g: boolean;
  hidden_5g: boolean;
  band: "2.4" | "5" | "both";
  channel_2g: number;
  channel_5g: number;
  security: "WPA2" | "WPA3" | "WPA2/WPA3";
}

export interface NetworkStats {
  downloadMbps: number;
  uploadMbps: number;
  connectedDevices: number;
  uptimeSeconds: number;
  wanIp: string;
  dns1: string;
  dns2: string;
}

export interface RouterInfo {
  model: string;
  firmware: string;
  type: RouterType;
}

export interface RouterClient {
  login(): Promise<void>;
  getDevices(): Promise<ConnectedDevice[]>;
  getWifiSettings(): Promise<WifiSettings>;
  updateWifiSettings(settings: Partial<WifiSettings>): Promise<void>;
  getNetworkStats(): Promise<NetworkStats>;
  blockDevice(mac: string): Promise<void>;
  unblockDevice(mac: string): Promise<void>;
  restartRouter(): Promise<void>;
  getRouterInfo(): Promise<RouterInfo>;
}
