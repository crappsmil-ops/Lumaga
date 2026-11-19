let sessionPromise = null;

export function getPurchaseSession() {
  if (!sessionPromise) {
    sessionPromise = fetch("/api/purchase-session", {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Kauf-Sitzung nicht verfuegbar");
        }

        const data = await response.json();

        if (
          data.ok !== true ||
          typeof data.appUserId !== "string" ||
          !/^[0-9a-f-]{36}$/.test(data.appUserId)
        ) {
          throw new Error("Ungueltige Kauf-Sitzung");
        }

        return data.appUserId;
      })
      .catch((error) => {
        sessionPromise = null;
        throw error;
      });
  }

  return sessionPromise;
}
