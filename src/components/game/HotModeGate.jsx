
import React from "react";
import { Capacitor } from "@capacitor/core";
import { Flame, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import ModeInfoButton from "@/components/game/ModeInfoButton";

export default function HotModeGate({
  isPremium,
  hotMode,
  onToggle,
  onBuyClick,
}) {
  const { lang } = useLanguage();

  // Wild im lokalen Browser zum Testen freischalten.
  // In Android und iOS gelten weiterhin die Kaufberechtigungen.
  const isWeb = Capacitor.getPlatform() === "web";
  const canUseHotMode = isPremium;

  const hotFeatures = [
    t(lang, "info_hot_1"),
    t(lang, "info_hot_2"),
    t(lang, "info_hot_3"),
    t(lang, "info_hot_4"),
  ].filter(Boolean);

  return (
    <div className="flex items-center justify-between gap-3 min-h-[44px]">
      <div className="min-w-0 flex-1">
        <p className="font-body text-sm font-medium flex items-center flex-wrap gap-1">
          <Flame className="w-4 h-4 text-rose-400 shrink-0" />

          <span>{t(lang, "setup_wild_mode")}</span>

          <ModeInfoButton
            title={t(lang, "info_hot_title")}
            features={hotFeatures}
          />
        </p>
      </div>

      <div className="shrink-0">
        {canUseHotMode ? (
          <button
            type="button"
            onClick={onToggle}
            role="switch"
            aria-checked={hotMode}
            className={`w-12 h-6 rounded-full transition-colors relative overflow-hidden ${
              hotMode ? "bg-rose-500" : "bg-secondary"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                hotMode ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        ) : (
          <Button
            onClick={onBuyClick}
            size="sm"
            className="bg-rose-500 hover:bg-rose-600 text-white font-heading font-bold rounded-xl"
          >
            <Lock className="w-3.5 h-3.5 mr-1.5" />
            {t(lang, "setup_wild_buy_button")}
          </Button>
        )}
      </div>
    </div>
  );
}
