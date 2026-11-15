import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { checkContent } from "@/lib/contentFilter";

export default function CustomQuestionsSection({ customQuestions, onUpdate: setCustomQuestions }) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [type, setType] = useState("question");
  const [error, setError] = useState("");

  const TYPE_OPTIONS = [
    { value: "question", label: t(lang, "custom_type_question") },
    { value: "action", label: t(lang, "custom_type_action") },
  ];

  const add = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!checkContent(trimmed).ok) {
      setError(t(lang, "custom_blocked"));
      return;
    }
    const newQ = {
      text: trimmed,
      isCustom: true,
      type: type === "action" ? "action" : undefined,
      category: type === "action" ? "action" : 1,
    };
    setCustomQuestions([...customQuestions, newQ]);
    setText("");
    setError("");
  };

  const remove = (i) => {
    setCustomQuestions(customQuestions.filter((_, idx) => idx !== i));
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 border-border bg-card transition-colors hover:bg-secondary"
      >
        <div className="flex items-center gap-3">
          <Pencil className="w-5 h-5 text-muted-foreground" />
          <div className="text-left">
            <p className="font-heading font-bold text-sm">{t(lang, "custom_title")}</p>
            <p className="text-xs text-muted-foreground font-body">
              {customQuestions.length > 0
                ? t(lang, "custom_added", customQuestions.length)
                : t(lang, "custom_optional")}
            </p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-3">
              {/* Type selector */}
              <div className="flex gap-2">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setType(opt.value)}
                    className={`flex-1 py-2 rounded-xl text-sm font-heading font-bold border-2 transition-all ${
                      type === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {opt.value === "action" ? "⚡ " : "❓ "}{opt.label}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && add()}
                  placeholder={
                    type === "action"
                      ? t(lang, "custom_placeholder_action")
                      : t(lang, "custom_placeholder_question")
                  }
                  className="h-11 bg-card border-border font-body text-sm rounded-xl"
                  maxLength={120}
                />
                <Button
                  onClick={add}
                  disabled={!text.trim()}
                  className="h-11 w-11 shrink-0 bg-primary hover:bg-primary/90 rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {error && (
                <p className="text-xs text-destructive font-body">{error}</p>
              )}

              {/* List */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <AnimatePresence>
                  {customQuestions.map((q, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-start justify-between bg-secondary rounded-xl px-3 py-2 gap-2"
                    >
                      <div className="flex items-start gap-2 min-w-0">
                        <span className="text-xs mt-0.5 shrink-0">
                          {q.type === "action" ? "⚡" : "❓"}
                        </span>
                        <p className="text-sm font-body text-foreground break-words">{q.text}</p>
                      </div>
                      <button
                        onClick={() => remove(i)}
                        className="text-muted-foreground hover:text-destructive shrink-0 mt-0.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {customQuestions.length === 0 && (
                  <p className="text-center text-xs text-muted-foreground font-body py-4">
                    {t(lang, "custom_empty")}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}