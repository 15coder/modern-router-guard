# سياج — تطبيق إدارة الراوتر

## نظرة عامة
تطبيق ويب عربي متكامل لإدارة الراوتر ومراقبة الشبكة. مبني بـ TanStack Start (React SSR) مع دعم TP-Link و Mikrotik.

## التقنيات المستخدمة
- **Framework**: TanStack Start (React 19 + SSR)
- **Routing**: TanStack Router (file-based)
- **State**: Zustand (connection store) + TanStack Query (server state)
- **Styling**: Tailwind CSS v4
- **Build**: Vite 7

## هيكل المشروع
```
src/
  routes/          # الصفحات (login, index, users, wifi, settings)
  components/      # مكوّنات مشتركة (MobileShell, Logo, etc.)
  hooks/           # hooks مخصصة (use-router-api, use-contrast)
  lib/
    router-api/    # طبقة API الراوتر (tp-link, mikrotik, demo)
    connection-store.ts  # حالة الاتصال (Zustand)
expo-apk/          # ملفات بناء Expo APK
```

## تشغيل التطبيق
```bash
npm run dev
```
يعمل على المنفذ 5000.

## الميزات
- دعم TP-Link (Archer, TL-WR, TL-MR) عبر stok API
- دعم Mikrotik / nits عبر REST API
- كشف تلقائي لنوع الراوتر
- تحديث لحظي للأجهزة المتصلة (كل 5 ثوانٍ)
- حظر/رفع حظر الأجهزة
- إدارة إعدادات WiFi (2.4GHz و 5GHz)
- إعدادات DNS مع خيارات جاهزة (Google, Cloudflare, OpenDNS)
- وضع تجريبي كامل
- نمط التباين العالي

## تصدير APK
انظر `expo-apk/BUILD-INSTRUCTIONS.md` للتعليمات الكاملة.

## تفضيلات المستخدم
- اللغة العربية (RTL)
- تصميم داكن
- يدعم TP-Link و Mikrotik بالأساس
