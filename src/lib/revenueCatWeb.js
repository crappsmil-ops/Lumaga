
import { Purchases } from "@revenuecat/purchases-js";
import { getLumagaCustomerId } from "@/lib/revenueCatIdentity";

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
