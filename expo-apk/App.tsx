import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  BackHandler,
  Platform,
} from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const ROUTER_APP_HTML = require("./web-build/index.html");

export default function App() {
  const webviewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);

  const handleNavigationChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "ready") {
        SplashScreen.hideAsync();
        setLoading(false);
      }
    } catch {}
  };

  const injectedJS = `
    (function() {
      window.isNativeApp = true;
      window.platform = '${Platform.OS}';
      window.postMessage(JSON.stringify({ type: 'ready' }), '*');
    })();
    true;
  `;

  if (Platform.OS === "android") {
    BackHandler.addEventListener("hardwareBackPress", () => {
      if (canGoBack && webviewRef.current) {
        webviewRef.current.goBack();
        return true;
      }
      return false;
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#0B0D14" />

      <WebView
        ref={webviewRef}
        source={ROUTER_APP_HTML}
        style={styles.webview}
        onLoad={() => {
          SplashScreen.hideAsync();
          setLoading(false);
        }}
        onNavigationStateChange={handleNavigationChange}
        onMessage={handleMessage}
        injectedJavaScript={injectedJS}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        mixedContentMode="always"
        originWhitelist={["*"]}
        startInLoadingState={false}
        scalesPageToFit={false}
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        geolocationEnabled={false}
        mediaPlaybackRequiresUserAction={false}
        allowsBackForwardNavigationGestures={true}
        decelerationRate="normal"
        androidLayerType="hardware"
      />

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#50B492" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0D14",
  },
  webview: {
    flex: 1,
    backgroundColor: "#0B0D14",
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0B0D14",
    alignItems: "center",
    justifyContent: "center",
  },
});
