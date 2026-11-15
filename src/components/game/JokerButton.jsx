import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

export default function JokerButton({ hasJoker, onUse, playerName }) {
  const { lang } = useLanguage();

  if (!hasJoker) {
    return (
      <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 border border-border text-muted-foreground/50">
        <Sparkles className="w-4 h-4" />
        <span className="text-xs font-body line-through">
          {t(lang, "joker_used")} ({playerName})
        </span>
      </div>
    );
  }

  return (
    <motion.button
      onClick={onUse}
      whileTap={{ scale: 0.95 }}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-400/50 hover:border-amber-400/80 hover:bg-amber-500/30 transition-all group"
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
      >
        <Sparkles className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
      </motion.div>
      <span className="text-sm font-heading font-bold text-amber-400">
        {t(lang, "joker_use")} ({playerName})
      </span>
    </motion.button>
  );
}