
import React, { useEffect, useState } from "react";
import {
  getRevenueCatWeb,
  getLumagaPartyPassCheckoutUrl,
  checkLumagaPartyPass,
} from "@/lib/revenueCatWeb";

export default function RevenueCatTest() {
  const [status, setStatus] = useState(
    "Verbindung wird geprüft ..."
  );
  const [partyStatus, setPartyStatus] = useState("");
  const [loading, setLoading] = useState(false);

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

  async function openSandboxCheckout() {
    setLoading(true);
    setPartyStatus("");

    try {
      const url = await getLumagaPartyPassCheckoutUrl();
      window.location.assign(url);
    } catch (error) {
      console.error("Sandbox-Checkout:", error);
      setPartyStatus(`❌ ${error.message}`);
      setLoading(false);
    }
  }

  async function verifyPartyPass() {
    setLoading(true);
    setPartyStatus("Party-Pass wird geprüft ...");

    try {
      const result = await checkLumagaPartyPass();

      if (result.active) {
        setPartyStatus(
          `✅ Party-Pass aktiv bis ${new Date(
            result.expiresAt
          ).toLocaleString("de-DE")}`
        );
      } else {
        setPartyStatus(
          "ℹ️ Kein aktiver Party-Pass für diese Sitzung."
        );
      }
    } catch (error) {
      console.error("Party-Pass-Test:", error);
      setPartyStatus(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 p-3 rounded-xl border border-primary/30 bg-card text-sm text-center break-words">
      <p>{status}</p>

      <div className="mt-4 space-y-3">
        <p className="font-semibold">
          Party-Pass – Sandbox-Test
        </p>

        <button
          type="button"
          onClick={openSandboxCheckout}
          disabled={loading}
          className="w-full rounded-xl bg-primary px-4 py-3 text-primary-foreground font-semibold disabled:opacity-50"
        >
          Sandbox-Kauf testen
        </button>

        <button
          type="button"
          onClick={verifyPartyPass}
          disabled={loading}
          className="w-full rounded-xl border border-primary/40 px-4 py-3 font-semibold disabled:opacity-50"
        >
          Party-Pass-Status prüfen
        </button>

        {partyStatus && (
          <p role="status" className="mt-3">
            {partyStatus}
          </p>
        )}
      </div>
    </div>
  );
}
