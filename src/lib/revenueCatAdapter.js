
import { getRevenueCatWeb } from "@/lib/revenueCatWeb";

// Adapter für die vorhandene PremiumContext.jsx.
// Stellt zunächst nur die Kaufstatus-Abfrage bereit.

export const Purchases = {
  async getCustomerInfo() {
    return await getRevenueCatWeb().getCustomerInfo();
  },

  // Der bisherige Capacitor-Listener wird im Web
  // vorerst nicht registriert.
  async addCustomerInfoUpdateListener() {
    return null;
  },
};
