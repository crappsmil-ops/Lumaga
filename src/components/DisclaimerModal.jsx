
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { setDisclaimerVisible } from "@/lib/disclaimerState";

// Neue Kennung, damit alte Bestätigungen nicht automatisch übernommen werden.
const STORAGE_KEY = "lumaga_16_confirmed_v1";

const translations = {
  de: {
    age: "16+",
    title: "Spielhinweise & Altersbestätigung",
    intro:
      "Lumaga ist ein Partyspiel für Personen ab 16 Jahren. Bitte lies vor dem Spielen die folgenden Hinweise.",
    sections: [
      {
        title: "Freiwillige Teilnahme",
        text:
          "Alle Fragen und Aktionen sind freiwillig. Du kannst jede Aufgabe jederzeit ohne Strafe oder Punktabzug überspringen oder abbrechen. Niemand muss persönliche Informationen preisgeben oder etwas tun, womit er sich unwohl fühlt.",
      },
      {
        title: "Respekt und Zustimmung",
        text:
          "Achte auf deine eigenen Grenzen und die Grenzen anderer. Körperkontakt ist nur erlaubt, wenn alle beteiligten Personen ausdrücklich einverstanden sind. Ein Nein ist jederzeit zu respektieren.",
      },
      {
        title: "Gesundheit und Sicherheit",
        text:
          "Führe keine gefährlichen oder gesundheitlich riskanten Aktionen aus. Spiele nur in einer sicheren Umgebung und beende eine Aufgabe, wenn du dich unwohl fühlst.",
      },
      {
        title: "Eigenverantwortung und Haftung",
        text:
          "Die Teilnahme am Spiel und die Durchführung der Aufgaben erfolgen eigenverantwortlich.  Achte auf deine eigene Sicherheit und respektiere die Grenzen anderer.",
      },
    ],
    checkbox:
      "Ich habe die Spielhinweise gelesen und verstanden.",
    button: "Ich bin mindestens 16 Jahre alt – Weiter",
    note:
      "Mit dem Fortfahren bestätigst du, dass du mindestens 16 Jahre alt bist.",
  },

  en: {
    age: "16+",
    title: "Game Guidelines & Age Confirmation",
    intro:
      "Lumaga is a party game intended for people aged 16 and over. Please read the following information before playing.",
    sections: [
      {
        title: "Voluntary Participation",
        text:
          "All questions and activities are optional. You may skip or stop any task at any time without penalties or losing points. Nobody has to disclose personal information or do anything that makes them uncomfortable.",
      },
      {
        title: "Respect and Consent",
        text:
          "Respect your own boundaries and those of others. Physical contact is only allowed when everyone involved has explicitly agreed. A refusal must always be respected.",
      },
      {
        title: "Health and Safety",
        text:
          "Do not perform dangerous or potentially harmful activities. Only play in a safe environment and stop any activity if you feel uncomfortable.",
      },
      {
        title: "Personal Responsibility and Liability",
        text:
          "Participation in the game and completion of the tasks are at your own responsibility. Take care of your own safety and respect the boundaries of others.",
      },
    ],
    checkbox:
      "I have read and understood the game guidelines.",
    button: "I am at least 16 years old – Continue",
    note:
      "By continuing, you confirm that you are at least 16 years old.",
  },
};

function detectLanguage() {
  if (typeof document === "undefined") return "de";

  return document.documentElement.lang
    .toLowerCase()
    .startsWith("en")
    ? "en"
    : "de";
}

export default function DisclaimerModal({ language }) {
  const [step, setStep] = useState(() =>
    sessionStorage.getItem(STORAGE_KEY) === "1"
      ? "done"
      : "disclaimer"
  );

  const [confirmed, setConfirmed] = useState(false);
  const [detectedLanguage, setDetectedLanguage] =
    useState(detectLanguage);

  // Reagiert auf spätere Änderungen von <html lang="...">.
  useEffect(() => {
    const updateLanguage = () => {
      setDetectedLanguage(detectLanguage());
    };

    updateLanguage();

    const observer = new MutationObserver(updateLanguage);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  // Die Sprachwahl kann später auch direkt als Prop übergeben werden.
  const currentLanguage = language ?? detectedLanguage;

  const locale = String(currentLanguage)
    .toLowerCase()
    .startsWith("en")
    ? "en"
    : "de";

  const t = translations[locale];

  useEffect(() => {
    setDisclaimerVisible(step !== "done");

    return () => {
      setDisclaimerVisible(false);
    };
  }, [step]);

  const accept = () => {
    if (!confirmed) return;

    sessionStorage.setItem(STORAGE_KEY, "1");
    setStep("done");
  };

  return (
    <AnimatePresence>
      {step !== "done" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lumaga-disclaimer-title"
            lang={locale}
            className="w-full max-w-md max-h-[85vh] overflow-y-auto bg-card border border-border rounded-3xl p-6 pb-safe text-center space-y-4"
          >
            <div className="flex justify-center">
              <div className="rounded-2xl border-2 border-purple-500 px-5 py-3 text-3xl font-black text-purple-400">
                {t.age}
              </div>
            </div>

            <h2
              id="lumaga-disclaimer-title"
              className="text-xl font-heading font-black"
            >
              {t.title}
            </h2>

            <p className="text-sm text-muted-foreground font-body">
              {t.intro}
            </p>

            <div className="relative">
              <div className="text-left text-sm text-muted-foreground font-body leading-relaxed space-y-4 max-h-72 overflow-y-auto bg-muted/40 rounded-2xl p-4">
                {t.sections.map((section) => (
                  <p key={section.title}>
                    <strong className="text-foreground">
                      {section.title}:
                    </strong>{" "}
                    {section.text}
                  </p>
                ))}
              </div>

              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-muted/60 to-transparent rounded-b-2xl" />
            </div>

            <label className="flex items-start gap-3 text-left cursor-pointer py-2">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) =>
                  setConfirmed(e.target.checked)
                }
                className="mt-1 w-5 h-5 accent-purple-500 flex-shrink-0"
              />

              <span className="text-xs text-foreground font-body leading-relaxed py-1">
                {t.checkbox}
              </span>
            </label>

            <Button
              onClick={accept}
              disabled={!confirmed}
              className="w-full"
            >
              {t.button}
            </Button>

            <p className="text-xs text-muted-foreground">
              {t.note}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
