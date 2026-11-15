import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { Wine, RotateCcw, Home, Beer, Info, Medal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { useGameResults } from "@/lib/GameResultsContext";
import { purchaseProduct } from "@/lib/iap";
import { PRODUCTS } from "@/lib/products";
import { t } from "@/lib/i18n";

const BEER_PRODUCT_ID = PRODUCTS.BEER_TIP.id;

export default function Results() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { results } = useGameResults();

  const {
    scores = {},
    players = [],
    playerKeys = [],
    alcoholFree = false,
  } = results || {};

  const [buyingBeer, setBuyingBeer] = useState(false);
  const [showBeerInfo, setShowBeerInfo] = useState(false);

  const isGerman = lang !== "en";
  const beerButtonLabel = isGerman ? "Eine Kugel Eis spendieren" : "Buy me an ice cream";
  const beerInfo = isGerman ? "Freiwillig dem Entwickler ein Eis spendieren." : "Buy the developer an ice cream (optional).";

  const handleBeerTip = async () => {
    setBuyingBeer(true);
    try {
      const res = await purchaseProduct(BEER_PRODUCT_ID);
      if (res.ok && res.purchased) {
        alert(t(lang, "beer_success"));
      }
    } finally {
      setBuyingBeer(false);
    }
  };

  const handlePrimaryAction = () => {
    navigate("/setup");
  };

  const handleHomeAction = () => {
    navigate("/");
  };

  if (!players.length) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="font-body">
          {lang === "en"
            ? "No results are available for this session."
            : "Für diese Sitzung sind keine Ergebnisse verfügbar."}
        </p>
        <Button onClick={() => navigate("/setup", { replace: true })}>
          {lang === "en" ? "Back to setup" : "Zur Spielauswahl"}
        </Button>
      </div>
    );
  }

  const sorted = [...new Set(playerKeys)].sort(
    (a, b) => (scores[b]?.points || 0) - (scores[a]?.points || 0)
  );

  const getAvatar = (name) => {
    const player = players.find((p) => (typeof p === "object" ? p.name : p) === name);
    return typeof player === "object" ? player.avatar : null;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-6 pt-safe pb-safe relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 pt-8 pb-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="font-heading font-bold text-3xl">{t(lang, "results_title")}</h1>
        </motion.div>

        <div className="space-y-3 mb-8">
          {sorted.map((name, idx) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-2xl border ${
                idx === 0 ? "bg-primary/10 border-primary/30" : "bg-card border-border"
              }`}
            >
              <span className="w-8 flex justify-center">
                {idx < 3 ? <Medal className="w-5 h-5" /> : <span>{idx + 1}.</span>}
              </span>

              <div className="flex items-center gap-2 flex-1 min-w-0">
                {getAvatar(name) && <span className="text-xl">{getAvatar(name)}</span>}
                <span className="font-heading font-semibold truncate">{name}</span>
              </div>

              <div className="font-heading font-bold text-primary">
  {scores[name]?.points || 0} {lang === "de" ? "Punkte" : "Points"}

              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handlePrimaryAction}
            className="w-full h-12 font-heading font-bold rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t(lang, "results_new_game")}
          </Button>

          <Button
            onClick={handleHomeAction}
            variant="outline"
            className="w-full h-12 font-heading font-semibold rounded-2xl"
          >
            <Home className="w-4 h-4 mr-2" />
            {t(lang, "results_home")}
          </Button>
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleBeerTip}
              disabled={buyingBeer}
              className="flex-1 border-amber-500/40 text-amber-500 hover:bg-amber-500/10 hover:text-amber-500"
            >
              {buyingBeer ? (
                <div className="w-4 h-4 border-2 border-amber-500/40 border-t-amber-500 rounded-full animate-spin" />
              ) : (
                <>
                  <Beer className="w-4 h-4 mr-2" />
                  {beerButtonLabel}
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={() => setShowBeerInfo((current) => !current)}
              className="w-10 h-10 shrink-0 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20"
              aria-label={isGerman ? "Info zum Trinkgeld" : "Tip information"}
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {showBeerInfo && (
            <p className="font-body text-xs text-muted-foreground mt-2 px-1">{beerInfo}</p>
          )}
        </div>
      </div>
    </div>
  );
}