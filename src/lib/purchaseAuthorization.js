export async function getWebPurchaseAuthorization() {
  const response = await fetch("/api/purchase-authorization", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Kaufberechtigung konnte nicht geprüft werden");
  }

  const data = await response.json();

  if (
    typeof data.authorized !== "boolean" ||
!Array.isArray(data.products) ||
    !data.products.every((id) => typeof id === "string")
  ) {
    throw new Error("Ungültige Antwort der Kaufprüfung");
  }

  return {
    authorized: data.authorized,
    recoveryManaged: data.recoveryManaged === true,
    products: data.authorized ? data.products : [],
  };
}
