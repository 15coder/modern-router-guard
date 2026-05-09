import { StatusBar } from "expo-status-bar";
import { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  BackHandler,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

// Default: your deployed Replit URL
// The user can change this from the settings overlay inside the app
const DEFAULT_URL = "https://81fc12f1-a851-4ed8-a350-c02e582ee3f2-00-2pdk4i6omvpcz.worf.replit.dev";

const COLORS = {
  bg: "#0B0D14",
  surface: "#171923",
  primary: "#50B492",
  border: "#2a2d3a",
  text: "#f0f4f8",
  muted: "#8896a4",
};

export default function App() {
  const webviewRef = useRef<WebView>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState(DEFAULT_URL);
  const [showSetup, setShowSetup] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Use default URL on first launch
    setServerUrl(DEFAULT_URL);
    setAppReady(true);
  }, []);

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  useEffect(() => {
    if (Platform.OS === "android") {
      const handler = BackHandler.addEventListener("hardwareBackPress", () => {
        if (showSetup) {
          setShowSetup(false);
          return true;
        }
        if (canGoBack && webviewRef.current) {
          webviewRef.current.goBack();
          return true;
        }
        return false;
      });
      return () => handler.remove();
    }
  }, [canGoBack, showSetup]);

  const handleConnect = () => {
    const url = inputUrl.trim().replace(/\/$/, "");
    if (!url) return;
    const normalized = url.startsWith("http") ? url : `http://${url}`;
    setServerUrl(normalized);
    setShowSetup(false);
    setLoading(true);
    setLoadError(false);
  };

  const injectedJS = `
    (function() {
      window.isNativeApp = true;
      window.platform = '${Platform.OS}';
    })();
    true;
  `;

  if (!appReady) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.bg} />

      {/* Server URL Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerLabel} numberOfLines={1}>
          {serverUrl?.replace(/^https?:\/\//, "")}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setInputUrl(serverUrl || DEFAULT_URL);
            setShowSetup(true);
          }}
          style={styles.bannerBtn}
        >
          <Text style={styles.bannerBtnText}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* WebView */}
      {serverUrl && !showSetup && (
        <WebView
          ref={webviewRef}
          source={{ uri: serverUrl }}
          style={styles.webview}
          onLoad={() => {
            setLoading(false);
            setLoadError(false);
          }}
          onError={() => {
            setLoading(false);
            setLoadError(true);
          }}
          onHttpError={() => {
            setLoading(false);
          }}
          onNavigationStateChange={(s: WebViewNavigation) =>
            setCanGoBack(s.canGoBack)
          }
          injectedJavaScript={injectedJS}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mixedContentMode="always"
          originWhitelist={["*"]}
          startInLoadingState={false}
          scalesPageToFit={false}
          bounces={false}
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          mediaPlaybackRequiresUserAction={false}
          androidLayerType="hardware"
          userAgent="Mozilla/5.0 (Linux; Android 14) SiyajApp/1.0"
        />
      )}

      {/* Loading Spinner */}
      {loading && !loadError && !showSetup && (
        <View style={styles.overlay}>
          <View style={styles.loadingCard}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>س</Text>
            </View>
            <Text style={styles.loadingTitle}>سياج</Text>
            <Text style={styles.loadingSubtitle}>جارٍ تحميل التطبيق...</Text>
            <ActivityIndicator
              style={{ marginTop: 16 }}
              size="small"
              color={COLORS.primary}
            />
          </View>
        </View>
      )}

      {/* Error Screen */}
      {loadError && !showSetup && (
        <View style={styles.overlay}>
          <View style={styles.loadingCard}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.loadingTitle}>تعذّر الاتصال</Text>
            <Text style={styles.loadingSubtitle}>
              تأكد من عنوان الخادم واتصالك بالإنترنت
            </Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => {
                setLoadError(false);
                setLoading(true);
                webviewRef.current?.reload();
              }}
            >
              <Text style={styles.retryBtnText}>إعادة المحاولة</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.retryBtn, styles.setupBtn]}
              onPress={() => {
                setInputUrl(serverUrl || DEFAULT_URL);
                setShowSetup(true);
              }}
            >
              <Text style={styles.retryBtnText}>تغيير العنوان</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Setup Screen */}
      {showSetup && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.overlay}
        >
          <View style={styles.setupCard}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>س</Text>
            </View>
            <Text style={styles.setupTitle}>إعداد سياج</Text>
            <Text style={styles.setupSubtitle}>
              أدخل عنوان الخادم (URL) للتطبيق
            </Text>

            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={inputUrl}
                onChangeText={setInputUrl}
                placeholder="https://your-app.replit.app"
                placeholderTextColor={COLORS.muted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                returnKeyType="done"
                onSubmitEditing={handleConnect}
                dir="ltr"
              />
            </View>

            <Text style={styles.hint}>
              مثال:{"\n"}
              https://your-app.repl.co{"\n"}
              http://192.168.1.100:5000
            </Text>

            <TouchableOpacity style={styles.connectBtn} onPress={handleConnect}>
              <Text style={styles.connectBtnText}>اتصال</Text>
            </TouchableOpacity>

            {serverUrl && (
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowSetup(false)}
              >
                <Text style={styles.cancelBtnText}>إلغاء</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                setInputUrl(DEFAULT_URL);
              }}
            >
              <Text style={styles.defaultBtn}>استخدام الافتراضي</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  splash: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  bannerLabel: {
    flex: 1,
    fontSize: 11,
    color: COLORS.muted,
    fontFamily: Platform.OS === "android" ? "monospace" : "Courier",
    textAlign: "left",
  },
  bannerBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerBtnText: {
    fontSize: 16,
    color: COLORS.primary,
  },
  webview: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.bg + "ee",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.primary + "22",
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  loadingTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
  },
  loadingSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
  },
  setupBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  retryBtnText: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 15,
  },
  setupCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    width: "100%",
    maxWidth: 360,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  setupTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 6,
    textAlign: "center",
  },
  setupSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: "center",
    marginBottom: 20,
  },
  inputWrap: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.bg,
    marginBottom: 12,
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: COLORS.text,
    textAlign: "left",
    writingDirection: "ltr",
  },
  hint: {
    fontSize: 11,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  connectBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  connectBtnText: {
    color: COLORS.bg,
    fontWeight: "800",
    fontSize: 16,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 14,
  },
  cancelBtnText: {
    color: COLORS.muted,
    fontWeight: "600",
    fontSize: 14,
  },
  defaultBtn: {
    fontSize: 12,
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
});
