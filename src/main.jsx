import { prepareNewPurchaseIdentity } from "@/lib/purchaseIdentity";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";

// Schriftarten werden mit der App ausgeliefert (kein Abruf bei Google Fonts).
import "@fontsource/outfit/300.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource/outfit/800.css";
import "@fontsource/outfit/900.css";
import "@fontsource/space-grotesk/300.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@/index.css";

import { Capacitor } from "@capacitor/core";
import {
  Purchases,
  LOG_LEVEL,
} from "@revenuecat/purchases-capacitor";

/*
 * App sofort rendern.
 * RevenueCat wird danach im Hintergrund initialisiert,
 * damit ein Problem mit IAP niemals den App-Start blockiert.
 */

async function startApp() {
  try {
    await prepareNewPurchaseIdentity();
  } catch (error) {
    console.warn("Kauf-Sitzung konnte nicht vorbereitet werden:", error);
  }

  ReactDOM.createRoot(
    document.getElementById("root")
  ).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

startApp();

// Service Worker: macht Lumaga auf dem Handy installierbar
// (Startbildschirm) und erlaubt das Öffnen ohne Verbindung.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.warn("Service Worker konnte nicht registriert werden:", error);
    });
  });
}

async function initRevenueCat() {
  const platform = Capacitor.getPlatform();

  if (
    platform !== "android" &&
    platform !== "ios"
  ) {
    return;
  }

  try {
    await Purchases.setLogLevel({
      level: LOG_LEVEL.DEBUG,
    });

    const apiKey =
      platform === "ios"
        ? import.meta.env.VITE_REVENUECAT_IOS_API_KEY
        : import.meta.env.VITE_REVENUECAT_ANDROID_API_KEY;

    if (!apiKey) {
      console.warn(
        `RevenueCat API key fehlt für Plattform: ${platform}`
      );
      return;
    }

    await Purchases.configure({
      apiKey,
    });

    console.log(
      `RevenueCat erfolgreich initialisiert: ${platform}`
    );

    try {
      const result =
        await Purchases.getAppUserID();

      console.log(
        "RevenueCat App User ID:",
        result?.appUserID
      );
    } catch (idError) {
      console.warn(
        "RevenueCat App User ID konnte nicht gelesen werden:",
        idError
      );
    }
  } catch (error) {
    console.error(
      "RevenueCat initialization error:",
      error
    );
  }
}

initRevenueCat();