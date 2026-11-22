// Zustimmung zum vorzeitigen Erlöschen des Widerrufsrechts (§ 356 Abs. 5 BGB).
// Jeder kostenpflichtige Kauf (außer der freiwilligen Eis-Spende) braucht diese
// ausdrückliche Zustimmung. Kauffenster mit eigenem Häkchen übergeben
// { consented: true } an purchaseProduct; alle anderen Käufe öffnen vorher das
// zentrale Zustimmungsfenster (PurchaseConsentHost).

const LOG_KEY = "lumaga_withdrawal_consents_v1";

let pending = null;
const listeners = new Set();

function emit() {
  listeners.forEach((fn) => fn(pending));
}

export function subscribePurchaseConsent(fn) {
  listeners.add(fn);
  fn(pending);
  return () => listeners.delete(fn);
}

export function recordPurchaseConsent(productId) {
  try {
    const log = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
    log.push({ productId: productId || null, at: new Date().toISOString() });
    localStorage.setItem(LOG_KEY, JSON.stringify(log.slice(-50)));
  } catch {
    // Protokoll ist nur eine Komfortfunktion.
  }
}

// Öffnet das Zustimmungsfenster; löst mit true (zugestimmt) oder false (abgebrochen) auf.
export function requestPurchaseConsent(productId) {
  if (pending) pending.resolve(false);
  return new Promise((resolve) => {
    pending = {
      productId,
      resolve: (value) => {
        pending = null;
        emit();
        if (value) recordPurchaseConsent(productId);
        resolve(value);
      },
    };
    emit();
  });
}
