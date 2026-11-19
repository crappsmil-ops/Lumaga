import { useState } from "react";
import { getPurchaseSession } from "@/lib/purchaseSession";

const CODE_KEY = "lumaga_recovery_code_v1";
const ENABLED = import.meta.env.VITE_RECOVERY_ENABLED === "true";

// Returns the legacy customer ID stored in localStorage (old RevenueCat identity).
// Only present for users who purchased before the session-cookie system was introduced.
function getLegacyCustomerId() {
  try {
    const id = localStorage.getItem("lumaga_revenuecat_user_id");
    return typeof id === "string" && /^[0-9a-f-]{36}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export default function RecoverySettings() {
  const [code, setCode] = useState(
    () => {
      try {
        return localStorage.getItem(CODE_KEY) || "";
      } catch {
        return "";
      }
    }
  );
  const [enteredCode, setEnteredCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  if (!ENABLED) return null;

  function setOk(text) {
    setMessage({ text, isError: false });
  }

  function setErr(text) {
    setMessage({ text, isError: true });
  }

  async function request(endpoint, body = {}) {
    const response = await fetch(endpoint, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || "Die Anfrage ist fehlgeschlagen."
      );
    }

    return result;
  }

  async function createCode() {
    setBusy(true);
    setMessage({ text: "", isError: false });

    let sessionId = null;

    try {
      sessionId = await getPurchaseSession();

      const result = await request("/api/recovery-issue", {});

      if (typeof result.code !== "string") {
        throw new Error("Kein Wiederherstellungscode empfangen.");
      }

      try {
        localStorage.setItem(CODE_KEY, result.code);
      } catch {
        // localStorage blocked – code is still shown to the user
      }
      setCode(result.code);
      setOk("Dein Wiederherstellungscode wurde erstellt. Bewahre ihn sicher auf.");
    } catch (error) {
      // A legacy buyer has a localStorage customer ID that DIFFERS from their
      // current session ID. If they match, the user simply has no purchase yet.
      const legacyId = getLegacyCustomerId();
      const isLegacyBuyer =
        error.message.includes("Kein berechtigter Dauerkauf") &&
        legacyId !== null &&
        legacyId !== sessionId;

      if (isLegacyBuyer) {
        setErr(
          "Deine Käufe wurden mit einem älteren Konto verknüpft, " +
          "das nicht automatisch übertragen werden kann. " +
          "Bitte wende dich an den Support."
        );
      } else {
        setErr(error.message);
      }
    } finally {
      setBusy(false);
    }
  }

  async function redeemCode() {
    const trimmed = enteredCode.trim();
    if (!trimmed) return;

    setBusy(true);
    setMessage({ text: "", isError: false });

    try {
      await getPurchaseSession();

      const result = await request("/api/recovery-redeem", { code: trimmed });

      if (!result.ok || typeof result.code !== "string") {
        throw new Error("Wiederherstellung nicht bestätigt.");
      }

      try {
        localStorage.setItem(CODE_KEY, result.code);
      } catch {
        // ignore
      }
      setCode(result.code);
      setEnteredCode("");

      setOk(
        "Käufe wiederhergestellt. Dein neuer Wiederherstellungscode wurde oben angezeigt. " +
        "Der vorherige Browser hat keinen Zugriff mehr. Seite wird neu geladen…"
      );

      // Reload so the web auth check picks up the new session state.
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (error) {
      setErr(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setOk("Code kopiert.");
    } catch {
      setErr("Kopieren fehlgeschlagen. Bitte Code manuell markieren und kopieren.");
    }
  }

  return (
    <section className="bg-card border border-border rounded-2xl p-5 mt-8 space-y-4">
      <div>
        <h2 className="font-heading font-semibold text-lg">
          Käufe wiederherstellen
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Mit einem Wiederherstellungscode kannst du deine dauerhaft gekauften
          Modi auf einen anderen Browser übertragen. Der bisherige Browser
          verliert danach den Zugriff auf diese Käufe.
        </p>
      </div>

      {code ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold">
            Dein Wiederherstellungscode
          </p>
          <div className="rounded-xl bg-secondary p-3 break-all font-mono text-sm select-all">
            {code}
          </div>
          <button
            type="button"
            onClick={copyCode}
            disabled={busy}
            className="w-full rounded-xl bg-primary text-primary-foreground p-3 font-semibold disabled:opacity-50"
          >
            Code kopieren
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={createCode}
          disabled={busy}
          className="w-full rounded-xl bg-primary text-primary-foreground p-3 font-semibold disabled:opacity-50"
        >
          {busy ? "Bitte warten…" : "Wiederherstellungscode erstellen"}
        </button>
      )}

      <div className="space-y-2">
        <label className="text-sm font-semibold block">
          Vorhandenen Code auf diesem Browser einlösen
        </label>
        <input
          type="text"
          value={enteredCode}
          onChange={(event) => setEnteredCode(event.target.value)}
          placeholder="LMG-…"
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-xl border border-border bg-background p-3 font-mono text-sm"
        />
        <button
          type="button"
          onClick={redeemCode}
          disabled={busy || !enteredCode.trim()}
          className="w-full rounded-xl border border-border p-3 font-semibold disabled:opacity-50"
        >
          {busy ? "Bitte warten…" : "Käufe wiederherstellen"}
        </button>
      </div>

      {message.text && (
        <p
          className={`text-sm ${message.isError ? "text-destructive" : "text-foreground"}`}
          role="status"
        >
          {message.text}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Hinweise: Der 24h-Party-Pass wird nicht übertragen.
        Eigene Karten aus „Mein Deck" werden ebenfalls nicht übertragen
        – nur die Freischaltung des Modus selbst.
        Bewahre den Code wie ein Passwort auf.
      </p>
    </section>
  );
}
