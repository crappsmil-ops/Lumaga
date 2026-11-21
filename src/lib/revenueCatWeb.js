
import { Purchases } from "@revenuecat/purchases-js";
import {
  getLumagaCustomerId,
  getLumagaPartySession,
} from "@/lib/revenueCatIdentity";

let purchasesInstance = null;

export function getRevenueCatWeb() {
  if (purchasesInstance) {
    return purchasesInstance;
  }

  const apiKey =
    import.meta.env.VITE_REVENUECAT_WEB_API_KEY;

  if (!apiKey) {
    throw new Error(
      "RevenueCat Web API-Key fehlt in .env.local"
    );
  }

  const appUserId = getLumagaCustomerId();

  purchasesInstance = Purchases.configure({
    apiKey,
    appUserId,
  });

  return purchasesInstance;
}

export async function checkLumagaPartyPass() {
  // Sicherstellen, dass das signierte Sitzungscookie existiert.
  await getLumagaPartySession();

  const response = await fetch("/api/party-pass-status", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Party-Pass-Prüfung fehlgeschlagen (${response.status})`
    );
  }

  const data = await response.json();

  return {
    active: data.active === true,
    expiresAt: data.expiresAt ?? null,
  };
}

// Bisheriger Test-Link (RevenueCat-Sandbox, kein echtes Geld).
// Wird nur genutzt, solange VITE_REVENUECAT_PARTY_PASS_CHECKOUT_URL
// nicht gesetzt ist.
const SANDBOX_PARTY_PASS_CHECKOUT =
  "https://pay.rev.cat/sandbox/pvxxufauyosngefk/";

export async function getLumagaPartyPassCheckoutUrl() {
  const appUserId = await getLumagaPartySession();

  // Echter Kauf-Link aus dem RevenueCat-Dashboard (Web Purchase Link,
  // Production), z. B. "https://pay.rev.cat/<token>/".
  const configured =
    import.meta.env.VITE_REVENUECAT_PARTY_PASS_CHECKOUT_URL?.trim();

  const base = configured
    ? configured.replace(/\/?$/, "/")
    : SANDBOX_PARTY_PASS_CHECKOUT;

  return base + encodeURIComponent(appUserId);
}