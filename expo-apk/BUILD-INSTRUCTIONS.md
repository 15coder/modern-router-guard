# إعدادات بناء سياج — APK عبر Expo

## المتطلبات

- Node.js 18+
- npm أو bun
- حساب Expo (مجاني): https://expo.dev
- EAS CLI: `npm install -g eas-cli`

---

## الخطوة 1 — بناء التطبيق الويب

```bash
# في مجلد المشروع الرئيسي (siyaj-app)
npm run build
```
سينشئ هذا مجلد `dist/` يحتوي على التطبيق كاملاً.

---

## الخطوة 2 — نسخ الملفات إلى مشروع Expo

```bash
cp -r dist/ expo-apk/web-build/
```

---

## الخطوة 3 — تهيئة مشروع Expo

```bash
cd expo-apk
npm install
```

---

## الخطوة 4 — تسجيل الدخول في Expo

```bash
eas login
# أدخل بيانات حسابك
```

---

## الخطوة 5 — إنشاء مشروع EAS

```bash
eas init
# اتبع التعليمات، سيعطيك projectId
# ضعه في app.json → extra.eas.projectId
```

---

## الخطوة 6 — بناء APK التجريبي (مباشر بدون متجر)

```bash
eas build --platform android --profile preview
```

سيبدأ البناء في السحابة (~10 دقائق). بعد الانتهاء ستحصل على رابط لتحميل APK مباشرة.

---

## الخطوة 7 — بناء APK محلياً (بدون سحابة)

إذا كان عندك Android Studio:

```bash
cd expo-apk
npx expo run:android --variant release
```

الملف الناتج:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## إعدادات البناء المهمة (app.json)

| الإعداد | القيمة | الشرح |
|---------|--------|-------|
| `usesCleartextTraffic` | `true` | للسماح بـ HTTP (192.168.x.x) |
| `package` | `com.siyaj.router` | معرّف التطبيق |
| `versionCode` | `1` | يُزاد مع كل إصدار |
| `permissions` | `INTERNET, ACCESS_WIFI_STATE` | صلاحيات الشبكة |
| `allowUniversalAccessFromFileURLs` | `true` | للوصول لـ 192.168.x.x من WebView |

---

## ملاحظات التوافق مع الراوترات

### TP-Link
- تأكد أن `usesCleartextTraffic: true` مُفعّل
- الراوتر افتراضياً على `192.168.1.1` أو `192.168.0.1`
- بروتوكول HTTP (ليس HTTPS)

### Mikrotik / nits
- REST API على المنفذ 80 (HTTP)
- قد تحتاج تفعيل REST API: `ip/services` → enable `www`
- اسم المستخدم الافتراضي: `admin` بدون كلمة مرور

---

## هيكل الملفات النهائي

```
expo-apk/
├── App.tsx              ← المكوّن الرئيسي (WebView)
├── app.json             ← إعدادات Expo
├── eas.json             ← إعدادات EAS Build
├── package.json         ← التبعيات
├── babel.config.js      ← إعدادات Babel
├── assets/
│   ├── icon.png         ← أيقونة التطبيق (1024×1024)
│   ├── splash.png       ← شاشة البداية (1284×2778)
│   └── adaptive-icon.png← أيقونة Android التكيفية
└── web-build/           ← ناتج بناء سياج الويب (dist/)
    ├── index.html
    └── ...
```

---

## تخصيص الأيقونة والاسم

في `app.json`:
- `name`: اسم التطبيق بالعربي `"سياج"`
- `android.package`: `"com.siyaj.router"` (اسم فريد)
- `icon`: ضع صورة PNG شفافة 1024×1024

---

## نشر التطبيق (اختياري)

لنشر في Google Play:

```bash
eas build --platform android --profile production
# ينتج AAB بدل APK
```

ثم ارفع الـ AAB في Google Play Console.
