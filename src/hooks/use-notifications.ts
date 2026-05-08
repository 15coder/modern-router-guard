import { useEffect, useRef, useCallback } from "react";
import { useConnectionStore } from "@/lib/connection-store";
import type { ConnectedDevice } from "@/lib/router-api/types";

function notify(title: string, body: string, tag: string) {
  if (typeof window === "undefined") return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: "/logo.jpg", tag });
  } catch {}
}

export function useNotificationPermission() {
  const isSupported = typeof window !== "undefined" && "Notification" in window;
  const permission = isSupported ? Notification.permission : "denied";

  const request = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) return "denied";
    if (Notification.permission === "granted") return "granted";
    return Notification.requestPermission();
  }, [isSupported]);

  return { isSupported, permission, request };
}

export function useDeviceNotifications(devices: ConnectedDevice[] | undefined) {
  const { knownMacs, addKnownMac, autoBlockNew } = useConnectionStore();
  const initializedRef = useRef(false);
  const knownRef = useRef<Set<string>>(new Set(knownMacs));

  useEffect(() => {
    if (!devices || devices.length === 0) return;

    if (!initializedRef.current) {
      initializedRef.current = true;
      devices.forEach((d) => {
        if (!knownRef.current.has(d.mac)) {
          knownRef.current.add(d.mac);
          addKnownMac(d.mac);
        }
      });
      return;
    }

    const newDevices = devices.filter(
      (d) => d.connected && !knownRef.current.has(d.mac)
    );

    newDevices.forEach((device) => {
      knownRef.current.add(device.mac);
      addKnownMac(device.mac);

      const willBeBlocked = device.blocked || autoBlockNew;

      if (willBeBlocked) {
        notify(
          "🚫 سياج — جهاز محظور تلقائياً",
          `${device.name} (${device.ip})\nتم حظره لأن الحظر التلقائي مفعّل`,
          `blocked-${device.mac}`
        );
      } else {
        notify(
          "📡 سياج — جهاز جديد",
          `${device.name} (${device.ip}) اتصل بشبكتك`,
          `new-${device.mac}`
        );
      }
    });
  }, [devices]);
}
