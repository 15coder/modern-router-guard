import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, Wifi, Settings, Network } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { to: "/", icon: LayoutDashboard, label: "الرئيسية" },
  { to: "/users", icon: Users, label: "المستخدمون" },
  { to: "/network", icon: Network, label: "الشبكة" },
  { to: "/wifi", icon: Wifi, label: "الواي فاي" },
  { to: "/settings", icon: Settings, label: "الإعدادات" },
] as const;

export function MobileShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col">
      <main className="flex-1 px-5 pb-28 pt-6">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-50">
        <div className="mx-auto max-w-md px-3 pb-4">
          <div className="glass flex items-center justify-around rounded-xl px-1 py-1.5">
            {tabs.map(({ to, icon: Icon, label }) => {
              const active = path === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg py-2 transition-smooth ${
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-[9px] font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
