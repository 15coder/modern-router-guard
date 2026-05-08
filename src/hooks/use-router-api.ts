import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getActiveClient } from "@/lib/router-api";
import { useConnectionStore } from "@/lib/connection-store";
import type { WifiSettings } from "@/lib/router-api/types";

export const DEVICES_KEY = ["router", "devices"];
export const WIFI_KEY = ["router", "wifi"];
export const STATS_KEY = ["router", "stats"];

export function useDevices() {
  const { blockedMacs, deviceAliases } = useConnectionStore();
  return useQuery({
    queryKey: DEVICES_KEY,
    queryFn: async () => {
      const devices = await getActiveClient().getDevices();
      return devices.map((d) => ({
        ...d,
        blocked: blockedMacs.includes(d.mac) || d.blocked,
        name: deviceAliases[d.mac] || d.name,
      }));
    },
    refetchInterval: 5000,
    staleTime: 3000,
    retry: 2,
  });
}

export function useNetworkStats() {
  return useQuery({
    queryKey: STATS_KEY,
    queryFn: () => getActiveClient().getNetworkStats(),
    refetchInterval: 5000,
    staleTime: 3000,
    retry: 2,
  });
}

export function useWifiSettings() {
  return useQuery({
    queryKey: WIFI_KEY,
    queryFn: () => getActiveClient().getWifiSettings(),
    staleTime: 30000,
    retry: 2,
  });
}

export function useBlockDevice() {
  const qc = useQueryClient();
  const { blockMac, unblockMac } = useConnectionStore();

  return useMutation({
    mutationFn: async ({ mac, block }: { mac: string; block: boolean }) => {
      if (block) {
        await getActiveClient().blockDevice(mac);
        blockMac(mac);
      } else {
        await getActiveClient().unblockDevice(mac);
        unblockMac(mac);
      }
    },
    onMutate: async ({ mac, block }) => {
      await qc.cancelQueries({ queryKey: DEVICES_KEY });
      const prev = qc.getQueryData(DEVICES_KEY);
      qc.setQueryData(DEVICES_KEY, (old: any[]) =>
        old?.map((d) => (d.mac === mac ? { ...d, blocked: block } : d))
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(DEVICES_KEY, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: DEVICES_KEY }),
  });
}

export function useUpdateWifi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (settings: Partial<WifiSettings>) =>
      getActiveClient().updateWifiSettings(settings),
    onSuccess: () => qc.invalidateQueries({ queryKey: WIFI_KEY }),
  });
}

export function useRestartRouter() {
  return useMutation({
    mutationFn: () => getActiveClient().restartRouter(),
  });
}

export function useChangeAdminPassword() {
  return useMutation({
    mutationFn: ({ oldPass, newPass }: { oldPass: string; newPass: string }) =>
      getActiveClient().changeAdminPassword(oldPass, newPass),
  });
}
