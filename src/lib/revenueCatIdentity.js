
const STORAGE_KEY = "lumaga_revenuecat_user_id";

export function getLumagaCustomerId() {
  const existingId = localStorage.getItem(STORAGE_KEY);

  if (existingId) {
    return existingId;
  }

  const newId = crypto.randomUUID();

  localStorage.setItem(STORAGE_KEY, newId);

  return newId;
}
