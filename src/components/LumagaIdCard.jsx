import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

// Zeigt die Kunden-ID dieses Browsers (= App User ID in RevenueCat).
// Damit kann der Betreiber z. B. Freischaltungen verschenken oder bei
// Kaufproblemen den richtigen Kunden finden.
function readLumagaId() {
  try {
    return localStorage.getItem("lumaga_revenuecat_user_id") || "";
  } catch {
    return "";
  }
}

export default function LumagaIdCard() {
  const { lang } = useLanguage();
  const en = lang === "en";
  const [id] = useState(readLumagaId);
  const [copied, setCopied] = useState(false);

  if (!id) return null;

  async function copyId() {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="bg-card border border-border rounded-2xl p-5 mt-4 space-y-3">
      <div>
        <h2 className="font-heading font-semibold text-lg">
          {en ? "Your Lumaga ID" : "Deine Lumaga-ID"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {en
            ? "Your personal ID for gifts and support."
            : "Deine persönliche Kennung für Geschenke und Support."}
        </p>
      </div>
      <div className="rounded-xl bg-secondary p-3 break-all font-mono text-xs select-all">
        {id}
      </div>
      <button
        type="button"
        onClick={copyId}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-border p-3 text-sm font-semibold"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? (en ? "Copied" : "Kopiert") : en ? "Copy ID" : "ID kopieren"}
      </button>
    </section>
  );
}
