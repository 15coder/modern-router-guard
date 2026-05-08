import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RouterType, ConnectedDevice } from "./router-api/types";

interface ConnectionState {
  connected: boolean;
  ip: string;
  username: string;
  password: string;
  routerType: RouterType;
  token: string;
  routerModel: string;
  blockedMacs: string[];

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

      setConnection: (data) =>
        set({ ...data, connected: true }),

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
    }),
    {
      name: "siyaj-connection",
      partialState: ["ip", "username", "routerType", "blockedMacs"],
    } as any
  )
);
