import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";
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

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

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