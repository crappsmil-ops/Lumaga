import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Settings, Layers, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import DisclaimerModal from "@/components/DisclaimerModal";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import PullToRefresh from "@/components/PullToRefresh";
import { useToast } from "@/components/ui/use-toast";
import { detectStoreUrl, detectReviewUrl } from "@/lib/storeUrls";

export default function Home() {
  const { lang, setLang } = useLanguage();
  const { toast } = useToast();

  const handleRefresh = async () => {};

  const handleReview = () => {
    const reviewUrl = detectReviewUrl();
    const storeUrl = detectStoreUrl();
    const targetUrl = reviewUrl || storeUrl;

    if (targetUrl) {
      window.open(
        targetUrl,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    toast({
      description:
        lang === "de"
          ? "Die App-Bewertung ist in der installierten Android- oder iOS-App verfügbar."
          : "App rating is available in the installed Android or iOS app.",
    });
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 overflow-hidden relative">
        <DisclaimerModal />

        {/* Settings + Language toggle */}
        <div className="absolute top-[calc(1.5rem+env(safe-area-inset-top))] right-6 flex items-center gap-2 z-10">
          <button
            onClick={() =>
              setLang(
                lang === "de"
                  ? "en"
                  : "de"
              )
            }
            aria-label="Sprache wechseln"
            className="px-2.5 py-1 rounded-lg bg-secondary hover:bg-secondary/80 text-xs font-heading font-bold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {lang === "de"
              ? "🇺🇸 EN"
              : "🇩🇪 DE"}
          </button>

          <Link
            to="/settings"
            aria-label="Einstellungen"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Settings className="w-5 h-5" />
          </Link>

          <button
            onClick={async () => {
              const shareUrl =
                detectStoreUrl();

              const shareData = {
                title: "Lumaga",
                text: t(
                  lang,
                  "settings_share_text"
                ),
                url: shareUrl,
              };

              try {
                if (navigator.share) {
                  await navigator.share(
                    shareData
                  );
                } else {
                  await navigator.clipboard.writeText(
                    shareUrl
                  );

                  toast({
                    description: t(
                      lang,
                      "settings_share_copied"
                    ),
                    duration: 2500,
                  });
                }
              } catch (e) {}
            }}
            aria-label="App teilen"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="text-center relative z-10 max-w-md w-full"
        >
          
{/* Lumaga Logo */}
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{
    delay: 0.2,
    type: "spring",
    stiffness: 200,
  }}
  className="mx-auto w-64 h-64 sm:w-72 sm:h-72 mb-8 flex items-center justify-center"
>
  <img
    src="/lumaga-logo.png"
    alt="Lumaga Logo"
    className="w-full h-full object-contain"
  />
</motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.5,
            }}
            className="text-muted-foreground font-body text-lg mb-10"
          >
            {t(
              lang,
              "home_subtitle"
            )}
          </motion.p>


          {/* CTA */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.8,
            }}
          >
            <Link to="/setup">
              <Button
                size="lg"
                className="w-full h-14 text-lg font-heading font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity rounded-2xl shadow-xl shadow-primary/20"
              >
                <Users className="w-5 h-5 mr-2" />
                {t(
                  lang,
                  "home_local"
                )}
              </Button>
            </Link>

            <Link to="/mydeck">
              <Button
                size="lg"
                variant="outline"
                className="w-full h-14 text-lg font-heading font-bold border-2 border-primary/30 hover:bg-primary/10 rounded-2xl mt-3"
              >
                <Layers className="w-5 h-5 mr-2" />
                {t(
                  lang,
                  "mydeck_title"
                )}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </PullToRefresh>
  );
}