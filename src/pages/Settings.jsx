import RecoverySettings from "@/components/RecoverySettings";
import React, { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ChevronLeft,
  Bot,
  Crown,
  Lock,
  RotateCcw,
  Volume2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  usePremium,
} from "@/lib/PremiumContext";

import {
  purchaseProduct,
  restorePurchases,
  isIAPAvailable,
} from "@/lib/iap";

import {
  useLanguage,
} from "@/lib/LanguageContext";

import { t } from "@/lib/i18n";

import {
  isSoundEnabled,
  setSoundEnabled,
  playSFX,
} from "@/lib/audio";

import PullToRefresh from "@/components/PullToRefresh";
import BackButton from "@/components/BackButton";
import ModeInfoButton from "@/components/game/ModeInfoButton";

const BUNDLE_PRODUCT_ID = "local_bundle";
const BUNDLE_ENTITLEMENT_IDS = [
  "hot",
  "hardcore",
  "mein_deck",
  "wkw",
  "bluff",
  "pantomime",
  "never",
];

function bundleIsActive(customerInfo) {
  const active =
    customerInfo
      ?.entitlements
      ?.active || {};

  const purchasedProductIds = new Set(
    Array.isArray(
      customerInfo?.allPurchasedProductIdentifiers
    )
      ? customerInfo.allPurchasedProductIdentifiers
      : []
  );

  return (
    BUNDLE_ENTITLEMENT_IDS.every(
      (id) => Boolean(active[id])
    ) ||
    purchasedProductIds.has(
      "de.trinkluma.bundle"
    )
  );
}

const waitForRevenueCat = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export default function Settings() {
  const { lang } = useLanguage();

  const {
    isHotPremium,
    isCustomPremium,
    setIsHotPremium,
    setIsCustomPremium,
    isHardcorePremium,
    setIsHardcorePremium,
    partyEntitlements,
    refreshPremiumStatus,
    revalidateWebPurchase,
  } = usePremium();

  const isWebStore = Capacitor.getPlatform() === "web";

  const hasBundle =
    isHotPremium &&
    isCustomPremium &&
    isHardcorePremium &&
    (Capacitor.getPlatform() !== "android" || (
      partyEntitlements.wkw &&
      partyEntitlements.bluff &&
      partyEntitlements.pantomime &&
      partyEntitlements.never
    ));

  // Refresh once when Settings opens. This is especially important for
  // existing bundle purchases after new entitlements were attached in RevenueCat.
useEffect(() => {
  const platform =
    Capacitor.getPlatform();

  if (
    platform !== "android" &&
    platform !== "ios"
  ) {
    return;
  }

  refreshPremiumStatus(
    null,
    true
  );
}, [refreshPremiumStatus]);

  const bundleInfoFeatures =
    lang === "en"
      ? [
          "Wild mode",
          "Chaos mode",
          "My Deck – create your own cards",
          "Who Would...?",
          "Who Knows Whom?",
          "Bluff & Truth",
          "Charades",
          "Never Have I Ever",
          "One-time purchase – permanent unlock, no subscription",

          "The 24-hour pass is not included.",
        ]
      : [
          "Wild-Modus",
          "Chaos-Modus",
          "Mein Deck – eigene Karten erstellen",
          "Wer würde...?",
          "Wer kennt wen?",
          "Bluff & Wahrheit",
          "Pantomime",
          "Ich habe noch nie",
          "Einmaliger Kauf – dauerhaft freigeschaltet, kein Abo",

          "Der 24-Stunden-Pass ist nicht enthalten.",
        ];

  const [
    buyingBundle,
    setBuyingBundle,
  ] = useState(false);

  const [
    restoring,
    setRestoring,
  ] = useState(false);

  const [
    bundleMsg,
    setBundleMsg,
  ] = useState("");

  const [
    soundEnabled,
    setSoundEnabledState,
  ] = useState(
    isSoundEnabled()
  );

  const handleRefresh =
    async () => {
      setSoundEnabledState(
        isSoundEnabled()
      );
    };

  const applyCustomerInfo = (
    customerInfo
  ) => {
    const active =
      customerInfo
        ?.entitlements
        ?.active || {};

    setIsHotPremium(
      Boolean(
        active.hot
      )
    );

    setIsCustomPremium(
      Boolean(
        active.mein_deck
      )
    );

    setIsHardcorePremium(
      Boolean(
        active.hardcore
      )
    );
  };

  const handleBuyBundle =
    async () => {
      setBuyingBundle(true);
      setBundleMsg("");

      try {
        const res =
          await purchaseProduct(
            BUNDLE_PRODUCT_ID
          );

        if (
          res.ok &&
          res.purchased
        ) {
          if (isWebStore) {
            await revalidateWebPurchase();
            setBundleMsg(t(lang, "local_bundle_success"));
          } else {
            let info =
              await refreshPremiumStatus(
                res.customerInfo
              );

            if (!bundleIsActive(info)) {
              await waitForRevenueCat(350);
              info =
                await refreshPremiumStatus(
                  null,
                  true
                );
            }

            if (!bundleIsActive(info)) {
              await waitForRevenueCat(900);
              info =
                await refreshPremiumStatus(
                  null,
                  true
                );
            }

            if (bundleIsActive(info)) {
              setBundleMsg(
                t(
                  lang,
                  "local_bundle_success"
                )
              );
            } else {
              setBundleMsg(
                lang === "en"
                  ? "Purchase completed. The unlock is still syncing. Please use Restore purchases once."
                  : "Kauf abgeschlossen. Die Freischaltung wird noch synchronisiert. Bitte einmal „Käufe wiederherstellen“ verwenden."
              );
            }
          }
        } else if (
          res.reason ===
          "cancelled"
        ) {
          // Nutzer hat den Kaufdialog geschlossen.
        } else if (
          res.reason ===
          "unavailable"
        ) {
          setBundleMsg(
            t(
              lang,
              "setup_hot_paywall_soon"
            )
          );
        } else {
          setBundleMsg(
            res.message ||
              "Kauf fehlgeschlagen."
          );
        }
      } finally {
        setBuyingBundle(
          false
        );
      }
    };

  const handleRestore =
    async () => {
      setRestoring(true);
      setBundleMsg("");

      try {
        const res =
          await restorePurchases();

        if (
          res.ok &&
          res.purchased
        ) {
          if (isWebStore) {
            await revalidateWebPurchase();
            setBundleMsg(t(lang, "settings_restore_success"));
            return;
          }

          let info =
            await refreshPremiumStatus(
              res.customerInfo
            );

          if (!bundleIsActive(info)) {
            info =
              await refreshPremiumStatus(
                null,
                true
              );
          }

          if (bundleIsActive(info)) {
            setBundleMsg(
              t(
                lang,
                "settings_restore_success"
              )
            );

            return;
          }
        }

        if (
          res.reason ===
          "unavailable"
        ) {
          setBundleMsg(
            t(
              lang,
              "settings_restore_unavailable"
            )
          );

          return;
        }

        if (
          res.reason ===
          "failed"
        ) {
          setBundleMsg(
            t(
              lang,
              "settings_restore_failed"
            )
          );

          return;
        }

        setBundleMsg(
          lang === "en"
            ? "No complete bundle purchase was found for this store account."
            : "Für dieses Store-Konto wurde kein vollständiger Bundle-Kauf gefunden."
        );
      } finally {
        setRestoring(
          false
        );
      }
    };

  return (
    <PullToRefresh
      onRefresh={
        handleRefresh
      }
    >
      <div className="min-h-screen bg-background flex flex-col p-6 pt-safe relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

        <BackButton to="/" />

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="max-w-md w-full mx-auto relative z-10 pt-12"
        >
          <h1 className="text-3xl font-heading font-black mb-2">
            Einstellungen
          </h1>

          <p className="text-muted-foreground font-body mb-10">
            App-Verwaltung
          </p>

          <Link to="/support">
            <div className="bg-card border border-border rounded-2xl p-5 mb-4 flex items-center justify-between hover:border-primary/40 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>

                <p className="font-heading font-semibold text-base">
                  Support
                </p>
              </div>

              <ChevronLeft className="w-5 h-5 text-muted-foreground -rotate-90" />
            </div>
          </Link>

          <Link to="/ueber-die-app">
            <div className="bg-card border border-border rounded-2xl p-5 mb-4 flex items-center justify-between hover:border-primary/40 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="font-heading font-semibold text-base">Über die App</p>
              </div>
              <ChevronLeft className="w-5 h-5 text-muted-foreground -rotate-90" />
            </div>
          </Link>

          <div className="bg-card border border-border rounded-2xl p-5 mt-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-accent flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>

              <div>
                   <div className="font-heading font-semibold text-base flex items-center gap-1">
                  {t(
                    lang,
                    "local_bundle_title"
                  )}
                 <ModeInfoButton
  title={
    lang === "en"
      ? "Included in the bundle"
      : "Im Bundle enthalten"
  }
  features={bundleInfoFeatures}
  />
  </div>
            </div>
              </div>

            {hasBundle ? (
              <div className="flex items-center justify-between">
                <span className="text-sm font-heading font-bold text-amber-400">
                  {t(
                    lang,
                    "local_bundle_owned"
                  )}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={
                    handleRestore
                  }
                  disabled={
                    restoring ||
                    !isIAPAvailable()
                  }
                  className="gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />

                  {restoring
                    ? t(
                        lang,
                        "settings_restoring"
                      )
                    : t(
                        lang,
                        "settings_restore"
                      )}
                </Button>
              </div>
            ) : (
              <>
                <Button
                  onClick={
                    handleBuyBundle
                  }
                  disabled={
                    buyingBundle
                  }
                  className="w-full bg-gradient-to-r from-amber-500 to-accent hover:opacity-90 text-white gap-2"
                >
                  {buyingBundle ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />

                      {lang === "en"
                        ? "Unlock bundle"
                        : "Bundle freischalten"}
                    </>
                  )}
                </Button>

                <button
                  onClick={
                    handleRestore
                  }
                  disabled={
                    restoring ||
                    !isIAPAvailable()
                  }
                  className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors mt-2"
                >
                  {restoring
                    ? t(
                        lang,
                        "settings_restoring"
                      )
                    : t(
                        lang,
                        "settings_restore"
                      )}
                </button>
              </>
            )}

            {bundleMsg && (
              <p className="text-sm text-center font-body mt-3 text-foreground">
                {bundleMsg}
              </p>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 mt-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Volume2 className="w-5 h-5 text-primary" />
                </div>

                <div>
                  <p className="font-heading font-semibold text-base">
                    {t(
                      lang,
                      "settings_sound"
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const next =
                    !soundEnabled;

                  setSoundEnabled(
                    next
                  );

                  setSoundEnabledState(
                    next
                  );

                  if (next) {
                    playSFX(
                      "success"
                    );
                  }
                }}
                aria-label="Sound umschalten"
                role="switch"
                aria-checked={
                  soundEnabled
                }
                className={`w-11 h-6 rounded-full transition-all relative shrink-0 ${
                  soundEnabled
                    ? "bg-primary"
                    : "bg-secondary"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                    soundEnabled
                      ? "left-5.5 translate-x-0.5"
                      : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          <RecoverySettings />
        </motion.div>
      </div>
    </PullToRefresh>
  );
}