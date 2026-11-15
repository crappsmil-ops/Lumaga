
import React, { useEffect, useState } from "react";
import { getRevenueCatWeb } from "@/lib/revenueCatWeb";

export default function RevenueCatTest() {
  const [status, setStatus] = useState(
    "Verbindung wird geprüft ..."
  );

  useEffect(() => {
    let cancelled = false;

    async function checkConnection() {
      try {
        const purchases = getRevenueCatWeb();
        const info = await purchases.getCustomerInfo();

        if (cancelled) return;

        const entitlements = Object.keys(
          info?.entitlements?.active ?? {}
        );

        setStatus(
          entitlements.length
            ? `✅ Verbunden! Freischaltungen: ${entitlements.join(", ")}`
            : "✅ RevenueCat verbunden! Noch keine Käufe."
        );
      } catch (error) {
        if (cancelled) return;

        console.error("RevenueCat-Web-Test:", error);

        setStatus(
          `❌ Verbindungsfehler: ${error.message}`
        );
      }
    }

    checkConnection();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mt-4 p-3 rounded-xl border border-primary/30 bg-card text-sm text-center break-words">
      {status}
    </div>
  );
}
