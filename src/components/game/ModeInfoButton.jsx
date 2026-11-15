
import React, { useState } from "react";
import { Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

export default function ModeInfoButton({ title, features }) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(true);
        }}
        className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
      >
        <Info className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-3xl p-6 max-w-sm w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-lg">
                  {title}
                </h2>

                <button
                  onClick={() => setOpen(false)}
                  aria-label="Schließen"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ul className="space-y-2.5 mb-6">
                {features.filter(Boolean).map((f, i) => {
                  const isExcludedPass =
                    typeof f === "string" &&
                    (
                      f.includes("24-Stunden-Pass ist nicht enthalten") ||
                      f.includes("24-hour pass is not included")
                    );

                  return (
                    <li
                      key={i}
                      className="flex items-start gap-2 font-body text-sm text-muted-foreground"
                    >
                      <span className="text-primary mt-0.5 shrink-0 w-4">
                        {isExcludedPass ? "" : "✓"}
                      </span>
                      <span>{f}</span>
                    </li>
                  );
                })}
              </ul>

              <Button
                onClick={() => setOpen(false)}
                className="w-full"
              >
                {t(lang, "info_close")}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
