import React, { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  Crown,
  Sparkles,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { WithdrawalConsentCheckbox } from "@/components/WithdrawalConsent";

export default function Paywall({
  open,
  onClose,
  onPurchase,
  onRestore,
  purchasing,
  price,
  mode = "wild",
}) {
  const { lang } = useLanguage();
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    if (!open) setConsent(false);
  }, [open]);

  const content =
    mode === "hardcore"
      ? {
          title: t(
            lang,
            "setup_hardcore_mode"
          ),
          subtitle:
            lang === "de"
              ? "Hardcore Modus freischalten 💀"
              : "Unlock Hardcore Mode 💀",
          features: [
            (lang === "de" ? "Verrückte Aufgaben und extreme Challenges" : "Crazy tasks and extreme challenges"),
            (lang === "de" ? "Für alle, die keine Herausforderung scheuen" : "For those who love a challenge"),
            (lang === "de" ? "Einmal zahlen, dauerhaft spielen" : "Pay once, play forever"),
          ],
        }
      : mode === "custom"
        ? {
            title: t(
              lang,
              "mydeck_locked_title"
            ),
            subtitle: t(
              lang,
              "mydeck_subtitle"
            ),
            features: [
              t(lang, "info_custom_1"),
              t(lang, "info_custom_2"),
              t(lang, "info_custom_4"),
            ],
          }
        : {
            title: t(
              lang,
              "setup_wild_mode"
            ),
            subtitle: t(
              lang,
              "paywall_subtitle"
            ),
            features: [
              (lang === "de" ? "Pikante Fragen und mutige Herausforderungen" : "Spicy questions and daring challenges"),
              (lang === "de" ? "Für mehr Nervenkitzel" : "For extra excitement"),
              (lang === "de" ? "Einmal zahlen, dauerhaft spielen" : "Pay once, play forever"),
            ],
          };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
        >
          <motion.div
            initial={{
              scale: 0.9,
              opacity: 0,
              y: 20,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            exit={{
              scale: 0.9,
              opacity: 0,
              y: 20,
            }}
            className="bg-card border border-primary/30 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative"
          >
            <button
              onClick={onClose}
              aria-label={
                lang === "de"
                  ? "Schließen"
                  : "Close"
              }
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/30">
              <Crown className="w-8 h-8 text-white" />
            </div>

            <h2 className="font-heading font-bold text-2xl mb-2">
              {content.title}
            </h2>

            <p className="font-body text-sm text-muted-foreground mb-6">
              {content.subtitle}
            </p>

            <div className="bg-secondary/60 rounded-2xl p-4 mb-6 space-y-3 text-left">
              {content.features.map(
                (feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-2 font-body text-sm"
                  >
                    <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                )
              )}
            </div>

            <WithdrawalConsentCheckbox
              checked={consent}
              onChange={setConsent}
              disabled={purchasing}
              className="mb-4"
            />

            <Button
              onClick={onPurchase}
              disabled={purchasing || !consent}
              className="w-full h-14 text-base font-heading font-bold rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 mb-3"
            >
              {purchasing ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Crown className="w-5 h-5 mr-2" />
                  {t(lang, "paywall_buy")}
                   </>
              )}
            </Button>

            <button
              onClick={onRestore}
              disabled={purchasing}
              className="w-full flex items-center justify-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors py-2 mb-1 disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t(lang, "paywall_restore")}
            </button>

            <button
              onClick={onClose}
              disabled={purchasing}
              className="w-full text-sm font-body text-muted-foreground hover:text-foreground transition-colors py-2 disabled:opacity-50"
            >
              {t(lang, "paywall_later")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
