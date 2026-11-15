import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, LifeBuoy, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import PullToRefresh from "@/components/PullToRefresh";
import BackButton from "@/components/BackButton";

const SUPPORT_API_URL =
  "https://trinkluma-support.trinkluma.workers.dev/support";

export default function Support() {
  const { lang } = useLanguage();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleRefresh = async () => {};

  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSend = async () => {
    const text = message.trim();
    const mail = email.trim();

    if (
      !text ||
      !mail ||
      !emailValid ||
      sending
    ) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await fetch(
        SUPPORT_API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: text,
            contact_email: mail,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Support-Nachricht konnte nicht gesendet werden."
        );
      }

      setSent(true);
      setMessage("");
      setEmail("");
    } catch (e) {
      console.error(
        "Support send failed:",
        e
      );

      setError(
        `Fehler: ${
          e?.message ||
          "Support-Nachricht konnte nicht gesendet werden."
        }`
      );
    } finally {
      setSending(false);
    }
  };

  const handleReset = () => {
    setSent(false);
    setMessage("");
    setEmail("");
    setError("");
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/8 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <BackButton iconOnly />

        <div className="flex items-center gap-3 p-6 pb-4 pt-safe pl-14 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <LifeBuoy className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="font-heading font-bold text-lg leading-tight">
                {t(
                  lang,
                  "support_title"
                )}
              </h1>

              <p className="font-body text-xs text-muted-foreground leading-tight">
                {t(
                  lang,
                  "support_subtitle"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 pb-safe relative z-10">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                }}
                className="flex flex-col items-center justify-center text-center py-16"
              >
                <motion.div
                  initial={{
                    scale: 0,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  transition={{
                    type: "spring",
                    delay: 0.1,
                  }}
                  className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </motion.div>

                <h2 className="font-heading font-bold text-xl mb-3">
                  {t(
                    lang,
                    "contact_sent_title"
                  )}
                </h2>

                <p className="font-body text-sm text-muted-foreground max-w-xs mb-8">
                  {t(
                    lang,
                    "support_received_body"
                  )}
                </p>

                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="rounded-2xl h-12 px-6"
                >
                  {t(
                    lang,
                    "support_new_message"
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                }}
                className="flex flex-col h-full"
              >
                <p className="font-body text-sm text-muted-foreground mb-6 mt-2">
                  {t(
                    lang,
                    "support_form_desc"
                  )}
                </p>

                <div className="relative mb-3">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />

                  <Input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder={t(
                      lang,
                      "support_email_placeholder"
                    )}
                    disabled={sending}
                    maxLength={120}
                    className="h-12 pl-12 bg-card border-border font-body text-base rounded-2xl"
                  />
                </div>

                <Textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  placeholder={t(
                    lang,
                    "settings_feedback_placeholder"
                  )}
                  disabled={sending}
                  maxLength={1000}
                  className="flex-1 min-h-[180px] bg-card border-border font-body text-base rounded-2xl resize-none"
                />

                {error && (
                  <p className="text-destructive text-sm font-body mt-3 text-center">
                    {error}
                  </p>
                )}

                <div className="mt-6 pb-4">
                  <Button
                    onClick={handleSend}
                    disabled={
                      !message.trim() ||
                      !emailValid ||
                      sending
                    }
                    className="w-full h-14 text-base font-heading font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90 rounded-2xl"
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />

                        {t(
                          lang,
                          "contact_send"
                        )}
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PullToRefresh>
  );
}