import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

export default function GroupDecisionPicker({ players, onPick, title, subtitle, excludeName }) {
  const { lang } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">👥</div>
        <h2 className="font-heading font-bold text-xl mb-1">{title || t(lang, "hc_group_decision")}</h2>
        <p className="font-body text-sm text-muted-foreground">{subtitle || t(lang, "hc_group_decision_desc")}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {players.map((p) => {
          const name = typeof p === "object" ? p.name : p;
          const avatar = typeof p === "object" ? p.avatar : null;
          const isExcluded = excludeName && name === excludeName;
          return (
            <button
              key={name}
              disabled={isExcluded}
              onClick={() => onPick(name)}
              className={`flex items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                isExcluded
                  ? "border-border opacity-30 cursor-not-allowed"
                  : "border-border hover:border-primary hover:bg-primary/10"
              }`}
            >
              {avatar && <span className="text-2xl">{avatar}</span>}
              <span className="font-heading font-bold">{name}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}