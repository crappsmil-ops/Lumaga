const STORAGE_KEY = "lumaga_revenuecat_user_id";

export function getPurchaseIdentityType() {
  const customerId = localStorage.getItem(STORAGE_KEY);

  if (!customerId) {
    return "missing";
  }

  return "existing";
}
