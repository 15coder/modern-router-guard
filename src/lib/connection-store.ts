import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RouterType } from "./router-api/types";

interface ConnectionState {
  connected: boolean;
  ip: string;
  username: string;
  password: string;
  routerType: RouterType;
  token: string;
  routerModel: string;
  blockedMacs: string[];
  theme: "dark" | "light";
  deviceAliases: Record<string, string>;
  blockedDomains: string[];
  autoBlockNew: boolean;
  knownMacs: string[];

  setConnection: (data: {
    ip: string;
    username: string;
    password: string;
    routerType: RouterType;
    token: string;
    routerModel: string;
  }) => void;
  disconnect: () => void;
  setToken: (token: string) => void;
  blockMac: (mac: string) => void;
  unblockMac: (mac: string) => void;
  setTheme: (theme: "dark" | "light") => void;
  setDeviceAlias: (mac: string, name: string) => void;
  removeDeviceAlias: (mac: string) => void;
  addBlockedDomain: (domain: string) => void;
  removeBlockedDomain: (domain: string) => void;
  setAutoBlockNew: (v: boolean) => void;
  addKnownMac: (mac: string) => void;
}

export const useConnectionStore = create<ConnectionState>()(
  persist(
    (set) => ({
      connected: false,
      ip: "192.168.1.1",
      username: "admin",
      password: "",
      routerType: "unknown",
      token: "",
      routerModel: "",
      blockedMacs: [],
      theme: "dark",
      deviceAliases: {},
      blockedDomains: [],
      autoBlockNew: false,
      knownMacs: [],

      setConnection: (data) => set({ ...data, connected: true }),

      disconnect: () =>
        set({
          connected: false,
          token: "",
          routerModel: "",
          blockedMacs: [],
        }),

      setToken: (token) => set({ token }),

      blockMac: (mac) =>
        set((s) => ({
          blockedMacs: s.blockedMacs.includes(mac)
            ? s.blockedMacs
            : [...s.blockedMacs, mac],
        })),

      unblockMac: (mac) =>
        set((s) => ({
          blockedMacs: s.blockedMacs.filter((m) => m !== mac),
        })),

      setTheme: (theme) => set({ theme }),

      setDeviceAlias: (mac, name) =>
        set((s) => ({
          deviceAliases: { ...s.deviceAliases, [mac]: name.trim() || s.deviceAliases[mac] },
        })),

      removeDeviceAlias: (mac) =>
        set((s) => {
          const next = { ...s.deviceAliases };
          delete next[mac];
          return { deviceAliases: next };
        }),

      addBlockedDomain: (domain) =>
        set((s) => ({
          blockedDomains: s.blockedDomains.includes(domain)
            ? s.blockedDomains
            : [...s.blockedDomains, domain.trim().toLowerCase()],
        })),

      removeBlockedDomain: (domain) =>
        set((s) => ({
          blockedDomains: s.blockedDomains.filter((d) => d !== domain),
        })),

      setAutoBlockNew: (v) => set({ autoBlockNew: v }),

      addKnownMac: (mac) =>
        set((s) => ({
          knownMacs: s.knownMacs.includes(mac)
            ? s.knownMacs
            : [...s.knownMacs, mac],
        })),
    }),
    {
      name: "siyaj-connection",
      partialState: [
        "ip",
        "username",
        "routerType",
        "blockedMacs",
        "theme",
        "deviceAliases",
        "blockedDomains",
        "autoBlockNew",
        "knownMacs",
      ],
    } as any,
  ),
);
