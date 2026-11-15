
import React from "react";
import { Skull, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { Capacitor } from "@capacitor/core";
import ModeInfoButton from "@/components/game/ModeInfoButton";

export default function HardcoreModeGate({
  isPremium,
  hardcoreMode,
  onToggle,
  onBuyClick,
}) {
  const { lang } = useLanguage();
  
  const canUseHardcoreMode = isPremium;

  const hardcoreFeatures = [
    t(lang, "info_hardcore_1"),
    t(lang, "info_hardcore_2"),
    t(lang, "info_hardcore_3"),
    t(lang, "info_hardcore_4"),
    t(lang, "info_hardcore_5"),
  ];

  return (
    <div className="flex items-center justify-between gap-3 min-h-[44px]">
      <div className="min-w-0 flex-1">
        <p className="font-body text-sm font-medium flex items-center flex-wrap gap-1">
          <Skull className="w-4 h-4 text-red-500 shrink-0" />

          <span>{t(lang, "setup_hardcore_mode")}</span>

          <ModeInfoButton
            title={t(lang, "info_hardcore_title")}
            features={hardcoreFeatures}
          />
        </p>

        <p className="font-body text-xs text-muted-foreground">
          {isPremium
            ? t(lang, "setup_hardcore_mode_desc")
            : t(lang, "setup_hardcore_locked_desc")}
        </p>
      </div>

      <div className="shrink-0">
        {canUseHardcoreMode ? (
          <button
            onClick={onToggle}
            role="switch"
            aria-checked={hardcoreMode}
            className={`w-12 h-6 rounded-full transition-colors relative overflow-hidden ${
              hardcoreMode ? "bg-red-600" : "bg-secondary"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                hardcoreMode ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        ) : (
          <Button
            onClick={onBuyClick}
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white font-heading font-bold rounded-xl"
          >
            <Lock className="w-3.5 h-3.5 mr-1.5" />
            {t(lang, "setup_hardcore_buy_button")}
          </Button>
        )}
      </div>
    </div>
  );
}
