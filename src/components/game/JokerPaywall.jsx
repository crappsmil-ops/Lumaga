import React from "react";

import {
  X,
  Ban,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { PRODUCTS } from "@/lib/products";

export default function JokerPaywall({
  open,
  onClose,
  onDecline,
  onPay,
  paying = false,
}) {
  const { lang } =
    useLanguage();

  if (!open) {
    return null;
  }

  const isGerman =
    lang !== "en";

  const title =
    isGerman
      ? "Was möchtest du tun?"
      : "What would you like to do?";

  const declineText =
    isGerman
      ? "Dankend ablehnen"
      : "Decline";

  const payText =
    isGerman
      ? "Überspringen"
      : "Skip";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
      <button
        type="button"
        aria-label={
          isGerman
            ? "Schließen"
            : "Close"
        }
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={
          paying
            ? undefined
            : onClose
        }
      />

      <div className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          disabled={paying}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted disabled:opacity-50"
          aria-label={
            isGerman
              ? "Schließen"
              : "Close"
          }
        >
          <X className="h-5 w-5" />
        </button>

        <div className="pr-10">
          <h2 className="font-heading text-xl font-bold">
            {title}
          </h2>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={paying}
            onClick={onDecline}
            className="h-14 rounded-2xl border-2 text-base font-heading font-bold"
          >
            <Ban className="mr-2 h-5 w-5" />

            {declineText}
          </Button>

          <Button
            type="button"
            disabled={paying}
            onClick={onPay}
            className="h-14 rounded-2xl text-base font-heading font-bold"
          >
            <CreditCard className="mr-2 h-5 w-5" />

            {paying
              ? isGerman
                ? "Kauf wird geöffnet..."
                : "Opening purchase..."
              : payText}
          </Button>
        </div>
      </div>
    </div>
  );
}