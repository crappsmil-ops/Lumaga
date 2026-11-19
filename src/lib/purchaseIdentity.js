import { getPurchaseSession } from "@/lib/purchaseSession";

const STORAGE_KEY = "lumaga_revenuecat_user_id";

export async function prepareNewPurchaseIdentity() {
  // Always ensure the signed session cookie exists, even for existing users.
  // The cookie is required by the server-side purchase authorisation endpoints.
  // For existing buyers (localStorage already has an ID) we keep their old ID as
  // the RevenueCat customer ID but make sure the cookie is in place so they can
  // use the recovery system without re-purchasing.
  await getPurchaseSession();

  const existingId = localStorage.getItem(STORAGE_KEY);
  if (existingId) {
    return existingId;
  }

  const sessionId = await getPurchaseSession(); // cached promise, no extra fetch

  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, sessionId);
  }

  return localStorage.getItem(STORAGE_KEY);
}
