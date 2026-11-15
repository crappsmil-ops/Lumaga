
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, SkipForward } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { playSFX } from "@/lib/audio";

export default function ActionButtons({
  question,
  onAnswer,
  onSkip,
  hardcoreMode,
  onBlackoutYes,
  onBlackoutAvoid,
}) {
  const { lang } = useLanguage();

  const baseButton =
    "min-h-14 h-auto w-full min-w-0 px-3 py-3 text-sm font-heading font-bold rounded-2xl whitespace-normal text-center leading-tight break-words";

  const handleAnswer = () => {
    playSFX("success");
    onAnswer?.();
  };

  const handleSkip = () => {
    onSkip?.();
  };

  const skipButton = (
    <Button
      onClick={handleSkip}
      variant="ghost"
      className="min-h-10 w-full rounded-2xl text-muted-foreground"
    >
      <SkipForward className="w-4 h-4 mr-2" />
      {t(lang, "action_skip")}
    </Button>
  );

  if (question.type === "blackout") {
    return (
      <div className="flex flex-col gap-3 mt-8">
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => onBlackoutYes?.()}
            className={`${baseButton} bg-gradient-to-r from-slate-700 to-slate-900`}
          >
            {t(lang, "hc_blackout_said_yes")}
          </Button>

          <Button
            onClick={() =>
              typeof onBlackoutAvoid === "function"
                ? onBlackoutAvoid()
                : handleSkip()
            }
            variant="outline"
            className={`${baseButton} border-emerald-500/40`}
          >
            <Check className="w-4 h-4 mr-2" />
            {t(lang, "hc_blackout_avoided")}
          </Button>
        </div>

        {skipButton}
      </div>
    );
  }

  const isAction = question.type === "action";

  const buttonLabel = isAction
    ? hardcoreMode
      ? t(lang, "hc_done")
      : t(lang, "action_done")
    : t(lang, "action_answered");

  return (
    <div className="flex flex-col gap-3 mt-8">
      <Button
        onClick={handleAnswer}
        className={`${baseButton} bg-gradient-to-r from-primary to-primary/80`}
      >
        <Check className="w-4 h-4 mr-2" />
        {buttonLabel}
      </Button>

      {skipButton}
    </div>
  );
}
