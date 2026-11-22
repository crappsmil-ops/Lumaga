import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { subscribePurchaseConsent } from "@/lib/purchaseConsent";

const AGB_URL = "/lumaga-agb.html#widerruf";

export function WithdrawalConsentCheckbox({ checked, onChange, disabled = false, className = "" }) {
  const { lang } = useLanguage();
  const en = lang === "en";

  return (
    <label
      className={`flex items-start gap-3 rounded-xl border border-border bg-secondary/40 p-3 text-left text-xs leading-snug text-muted-foreground cursor-pointer ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-primary cursor-pointer"
      />
      <span>
        {en
          ? "I agree that Lumaga unlocks the content immediately, and I understand that I thereby lose my right of withdrawal. "
          : "Ich stimme zu, dass Lumaga den Inhalt sofort freischaltet, und weiß, dass ich dadurch mein Widerrufsrecht verliere. "}
        <a
          href={AGB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          {en ? "Terms & withdrawal policy" : "AGB & Widerrufsbelehrung"}
        </a>
      </span>
    </label>
  );
}

// Zentrales Fenster für Käufe ohne eigenes Kauffenster.
export function PurchaseConsentHost() {
  const { lang } = useLanguage();
  const en = lang === "en";
  const [request, setRequest] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => subscribePurchaseConsent((req) => {
    setRequest(req);
    setChecked(false);
  }), []);

  if (!request) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-heading"
        className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6 shadow-2xl"
      >
        <h2 id="consent-heading" className="font-heading text-xl font-bold">
          {en ? "Before you buy" : "Vor dem Kauf"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {en
            ? "The content is unlocked right after payment. Please confirm:"
            : "Der Inhalt wird direkt nach der Zahlung freigeschaltet. Bitte bestätige:"}
        </p>
        <WithdrawalConsentCheckbox checked={checked} onChange={setChecked} />
        <Button className="w-full" disabled={!checked} onClick={() => request.resolve(true)}>
          {en ? "Continue to payment" : "Weiter zur Zahlung"}
        </Button>
        <Button className="w-full" variant="ghost" onClick={() => request.resolve(false)}>
          {en ? "Cancel" : "Abbrechen"}
        </Button>
      </div>
    </div>
  );
}
