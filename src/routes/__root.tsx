import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { SpaceBackground } from "@/components/SpaceBackground";
import { useConnectionStore } from "@/lib/connection-store";
import { createRouterClient, setActiveClient } from "@/lib/router-api";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">الصفحة غير موجودة</h2>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">حدث خطأ</h1>
        <p className="mt-2 text-sm text-muted-foreground">جرّب إعادة التحميل.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            إعادة المحاولة
          </button>
          <a href="/" className="rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium text-foreground">
            الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "سياج — إدارة الراوتر" },
      { name: "description", content: "سياج: تطبيق ذكي وعصري لإدارة الراوتر وحماية الشبكة" },
      { name: "author", content: "نداء الرحمن محمد عبّود" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/jpeg", href: "/logo.jpg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ThemeApplier() {
  const { theme } = useConnectionStore();
  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);
  return null;
}

function AuthGuard() {
  const { connected, ip, username, password, routerType } = useConnectionStore();
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (path === "/login") return;

    if (!connected) {
      nav({ to: "/login" });
    } else {
      const client = createRouterClient({ ip, username, password, type: routerType });
      setActiveClient(client);
    }
  }, [connected, path]);

  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SpaceBackground />
      <ThemeApplier />
      <AuthGuard />
      <Outlet />
    </QueryClientProvider>
  );
}
