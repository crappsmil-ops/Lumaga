
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

let partySessionPromise = null;

export async function getLumagaPartySession() {
  if (!partySessionPromise) {
    partySessionPromise = fetch("/api/party-session", {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Party-Sitzung nicht verfügbar");
        }

        const data = await response.json();

        if (
          typeof data.appUserId !== "string" ||
          !data.appUserId
        ) {
          throw new Error("Ungültige Party-Sitzung");
        }

        return data.appUserId;
      })
      .catch((error) => {
        partySessionPromise = null;
        throw error;
      });
  }

  return partySessionPromise;
}
