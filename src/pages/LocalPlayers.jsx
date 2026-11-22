import React, { useEffect, useMemo, useState } from "react";

import { Capacitor } from "@capacitor/core";

import { Link, useLocation, useNavigate } from "react-router-dom";

import {

  ChevronLeft,

  Plus,

  X,

  Pencil,

  Lock,

} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";



import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import AvatarPicker, { AVATARS } from "@/components/game/AvatarPicker";

import HotModeGate from "@/components/game/HotModeGate";

import HardcoreModeGate from "@/components/game/HardcoreModeGate";

import ModeInfoButton from "@/components/game/ModeInfoButton";

import Paywall from "@/components/game/Paywall";

import BackButton from "@/components/BackButton";

import BottomTabBar from "@/components/BottomTabBar";



import { getCustomDeck } from "@/lib/customDeck";

import { usePremium } from "@/lib/PremiumContext";

import { purchaseProduct, restorePurchases } from "@/lib/iap";

import { PARTY_MODE_PURCHASES } from "@/lib/products";

import { useLocalTrial, formatLocalTrialTime, LOCAL_TRIAL_MINUTES } from "@/lib/LocalTrialContext";

import { useLocalPlayerSession } from "@/lib/LocalPlayerSessionContext";

import { useLanguage } from "@/lib/LanguageContext";

import { t } from "@/lib/i18n";
import { jsx } from "react/jsx-runtime";



const MAX_LOCAL_PLAYERS = 4;
const MAX_PARTY_PASS_PLAYERS = 8;

const VALID_MODES = new Set([

  "classic",

  "wer_wuerde",

  "wer_kennt_wen",

  "bluff_wahrheit",

  "pantomime",

  "ich_habe_noch_nie",

]);



const HOT_PACKAGE_ID = "hot";

const HARDCORE_PACKAGE_ID = "hardcore";

const CUSTOM_PACKAGE_ID = "mein_deck";



function getStoredMode() {

  try {

    const value = localStorage.getItem("trinkluma_selected_local_mode_v1");

    return VALID_MODES.has(value) ? value : null;

  } catch {

    return null;

  }

}



function getModeLabel(gameMode, lang) {

  if (gameMode === "classic") {

    return t(lang, "setup_mode_classic");

  }

  if (gameMode === "wer_wuerde") {
  return lang === "en" ? "Who Would…?" : "Wer würde…?";
}

  if (gameMode === "wer_kennt_wen") {

    return t(lang, "wkw_home_title");

  }

  if (gameMode === "bluff_wahrheit") {

    return t(lang, "bluff_home_title");

  }

  if (gameMode === "pantomime") {

    return lang === "en" ? "Charades" : "Pantomime";

  }

  if (gameMode === "ich_habe_noch_nie") {

    return lang === "en" ? "Never Have I Ever" : "Ich habe noch nie";

  }

  return lang === "en" ? "Local game" : "Lokales Spiel";

}



function normalizePlayerName(value) {

  return String(value || "")

    .trim()

    .replace(/\s+/g, " ")

    .toLocaleLowerCase();

}

function formatPartyPassTime(ms) {
  const totalMinutes = Math.max(
    0,
    Math.ceil((Number(ms) || 0) / 60000)
  );

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) {
    return `${minutes} min`;
  }

  return `${hours} h ${String(minutes).padStart(2, "0")} min`;
}



export default function LocalPlayers() {

  const navigate = useNavigate();

  const location = useLocation();

  const { lang } = useLanguage();

  const {

    isHotPremium,

    isCustomPremium,

    isHardcorePremium,

    partyEntitlements,

    premiumStatusLoading,

    partyPassRemainingMs,

    hasPartyPass,

    refreshPremiumStatus,

  } = usePremium();



  const platform = Capacitor.getPlatform();
  const isNativeStore =
    platform === "android" || platform === "ios";

  const {

    started: trialStarted,

    remainingMs: trialRemainingMs,

    trialAvailable,

  } = useLocalTrial();



  const [gameMode] = useState(() => {

    const fromState = location.state?.gameMode;

    if (VALID_MODES.has(fromState)) return fromState;

    return getStoredMode() || "classic";

  });



  const isClassicMode = gameMode === "classic";

  const partyPurchase = PARTY_MODE_PURCHASES[gameMode] || null;

  const partyOwned = partyPurchase

    ? Boolean(partyEntitlements[partyPurchase.entitlementId])

    : true;

  const partyStatusPending =

    isNativeStore &&

    Boolean(partyPurchase) &&

    premiumStatusLoading &&

    !trialAvailable &&

    !hasPartyPass;

  const partyLocked =

    isNativeStore &&

    Boolean(partyPurchase) &&

    !premiumStatusLoading &&

    !partyOwned &&

    !trialAvailable &&

    !hasPartyPass;



  useEffect(() => {

    try {

      localStorage.setItem("trinkluma_selected_local_mode_v1", gameMode);

    } catch {

      // localStorage nicht verfügbar

    }



    // Keine erzwungene RevenueCat-Netzabfrage beim Oeffnen dieser Seite.

    // Der globale PremiumProvider hält den Kaufstatus aktuell.

  }, [gameMode]);



  const [playerName, setPlayerName] = useState("");

  const [playerAvatar, setPlayerAvatar] = useState("🎉");

  const { players, setPlayers } = useLocalPlayerSession();

  const [hotMode, setHotMode] = useState(false);

  const [hardcoreMode, setHardcoreMode] = useState(false);

  const [showHotConfirm, setShowHotConfirm] = useState(false);

  const [showHardcoreConfirm, setShowHardcoreConfirm] = useState(false);

  const [showPaywall, setShowPaywall] = useState(false);

  const [purchaseTarget, setPurchaseTarget] = useState("hot");

  const [purchasing, setPurchasing] = useState(false);

  const [deckCount] = useState(() => getCustomDeck().length);

  const maxLocalPlayers = hasPartyPass
    ? MAX_PARTY_PASS_PLAYERS
    : MAX_LOCAL_PLAYERS;

  const tooManyPlayersForAccess =
    players.length > maxLocalPlayers;



  const pendingPlayerNameKey = normalizePlayerName(playerName);

  const duplicatePlayerName =

    Boolean(pendingPlayerNameKey) &&

    players.some(

      (player) => normalizePlayerName(player?.name) === pendingPlayerNameKey

    );



  const hasDuplicatePlayerNames = useMemo(() => {

    const keys = players

      .map((player) => normalizePlayerName(player?.name))

      .filter(Boolean);



    return new Set(keys).size !== keys.length;

  }, [players]);



  const modeLabel = useMemo(

    () => getModeLabel(gameMode, lang),

    [gameMode, lang]

  );



  const addPlayer = () => {

    const name = playerName.trim();

    if (

      !name ||

      duplicatePlayerName ||

      players.length >= maxLocalPlayers

    ) {

      return;

    }



    const usedAvatars = [

      ...players.map((player) => player.avatar),

      playerAvatar,

    ];

    const nextAvatar =

      AVATARS.find((avatar) => !usedAvatars.includes(avatar)) || AVATARS[0];



    setPlayers((previous) => [

      ...previous,

      { name, avatar: playerAvatar },

    ]);

    setPlayerName("");

    setPlayerAvatar(nextAvatar);

  };



  const removePlayer = (index) => {

    setPlayers((previous) =>

      previous.filter((_, currentIndex) => currentIndex !== index)

    );

  };



  const handleBuyClick = (target) => {

    setPurchaseTarget(target);

    setShowPaywall(true);

  };



  const targetPackageId = () => {

    if (purchaseTarget === "custom") return CUSTOM_PACKAGE_ID;

    if (purchaseTarget === "hardcore") return HARDCORE_PACKAGE_ID;

    return HOT_PACKAGE_ID;

  };



  const handlePurchase = async () => {

    setPurchasing(true);



    try {

      const packageId = targetPackageId();

      const result = await purchaseProduct(packageId, null, { consented: true });



      if (result.ok && result.purchased) {

        let info = await refreshPremiumStatus(result.customerInfo);

        let active = info?.entitlements?.active || {};



        if (!active[packageId]) {

          info = await refreshPremiumStatus(null, true);

          active = info?.entitlements?.active || {};

        }



        if (active[packageId]) {

          setShowPaywall(false);

          alert(t(lang, "paywall_success"));

          return;

        }



        alert(

          lang === "en"

            ? "The purchase was confirmed, but the unlock is still syncing. Please do not buy again."

            : "Der Kauf wurde bestätigt, aber die Freischaltung wird noch synchronisiert. Bitte nicht erneut kaufen."

        );

        return;

      }



      if (result.reason !== "cancelled") {

        alert(result.message || (lang === "en" ? "Purchase failed." : "Kauf fehlgeschlagen."));

      }

    } finally {

      setPurchasing(false);

    }

  };



  const handleRestore = async () => {

    setPurchasing(true);



    try {

      const result = await restorePurchases();

      if (!result.ok) {

        if (result.reason === "unavailable") {

          alert(t(lang, "paywall_restore_unavailable"));

        } else {

          alert(t(lang, "paywall_restore_failed"));

        }

        return;

      }



      const packageId = targetPackageId();

      let info = await refreshPremiumStatus(result.customerInfo);

      let active = info?.entitlements?.active || {};



      if (!active[packageId]) {

        info = await refreshPremiumStatus(null, true);

        active = info?.entitlements?.active || {};

      }



      if (active[packageId]) {

        setShowPaywall(false);

        alert(t(lang, "paywall_restore_success"));

        return;

      }



      alert(t(lang, "paywall_restore_none"));

    } finally {

      setPurchasing(false);

    }

  };



  
const handleHotToggle = () => {
  if (hotMode) {
    setHotMode(false);
    return;
  }

  if (!isHotPremium && !trialAvailable && !hasPartyPass) {
  return;
}

  setHotMode(true);
  setHardcoreMode(false);
  setShowHotConfirm(false);
};



  const confirmHotMode = () => {

    setHotMode(true);

    setHardcoreMode(false);

    setShowHotConfirm(false);

  };



  

const handleHardcoreToggle = () => {
  if (hardcoreMode) {
    setHardcoreMode(false);
    return;
  }

  if (
    !isHardcorePremium &&
    !trialAvailable &&
    !hasPartyPass
  ) {
    return;
  }

  setHardcoreMode(true);
  setHotMode(false);
  setShowHardcoreConfirm(false);
};


  const confirmHardcoreMode = () => {

    setHardcoreMode(true);

    setHotMode(false);

    setShowHardcoreConfirm(false);

  };



  const hasPaidClassicAccess =

    isHotPremium && isHardcorePremium;



  const selectedClassicAccessPaid =

    hasPartyPass ||
    (hardcoreMode

      ? isHardcorePremium

      : hotMode

        ? isHotPremium

        : hasPaidClassicAccess ||

          (

            isCustomPremium &&

            deckCount > 0

          ));



  const classicAccessBlocked =

    isNativeStore &&

    isClassicMode &&

    !selectedClassicAccessPaid &&

    !trialAvailable;



  const startGame = () => {

    if (

      players.length < 2 ||

      hasDuplicatePlayerNames ||

      tooManyPlayersForAccess ||

      partyLocked ||

      partyStatusPending ||

      classicAccessBlocked

    ) {

      return;

    }



    if (!isClassicMode) {

      try {

        localStorage.setItem(

          "trinkluma_party_mode_players_v1",

          JSON.stringify(players)

        );

        localStorage.removeItem(

          gameMode === "wer_kennt_wen"

            ? "trinkluma_wkw_session_v1"

            : gameMode === "bluff_wahrheit"

              ? "trinkluma_bluff_session_v1"

              : gameMode === "pantomime"

                ? "trinkluma_pantomime_session_v1"

                : "trinkluma_never_session_v1"

        );

      } catch (error) {

        console.warn("Partyspiel-Sitzung konnte nicht gespeichert werden:", error);

      }

    }


    if (gameMode === "wer_wuerde") {
  navigate("/wer-wuerde/spiel", { state: { players } });
  return;
}

    if (gameMode === "wer_kennt_wen") {

      navigate("/wer-kennt-wen/spiel", { state: { players } });

      return;

    }

    if (gameMode === "bluff_wahrheit") {

      navigate("/bluff-wahrheit/spiel", { state: { players } });

      return;

    }

    if (gameMode === "pantomime") {

      navigate("/pantomime/spiel", { state: { players } });

      return;

    }

    if (gameMode === "ich_habe_noch_nie") {

      navigate("/ich-habe-noch-nie/spiel", { state: { players } });

      return;

    }



    navigate("/game", {

      state: {

        players,

        hotMode,

        hardcoreMode,

      },

    });

  };



  if (partyLocked) {

    return (

      <div className="min-h-screen bg-background flex items-center justify-center p-6">

        <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 text-center space-y-4">

          <Lock className="w-8 h-8 text-primary mx-auto" />

          <h1 className="font-heading font-bold text-xl">{modeLabel}</h1>

          <p className="text-sm text-muted-foreground">

            {lang === "en"

              ? "This mode is not unlocked yet. Unlock it from the local mode selection."

              : "Dieser Modus ist noch nicht freigeschaltet. Schalte ihn in der lokalen Modusauswahl über das Schloss frei."}

          </p>

          <Button className="w-full" onClick={() => navigate("/setup", { replace: true })}>

            {lang === "en" ? "Back to mode selection" : "Zur Modusauswahl"}

          </Button>

        </div>

      </div>

    );

  }



  return (

    <div className="min-h-screen bg-background flex flex-col items-center p-6 pt-safe pb-28 relative overflow-hidden">

      <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-accent/8 rounded-full blur-3xl pointer-events-none" />



      <BackButton />



      <div className="w-full max-w-md relative z-10 pb-10 pt-12">

        <div className="mb-6">

          <p className="text-xs text-muted-foreground font-body mb-1">

            {lang === "en" ? "Selected mode" : "Gewählter Modus"}

          </p>

          <div className="flex items-center justify-between gap-3">

            <h1 className="font-heading font-bold text-2xl">{modeLabel}</h1>

            <Button

              variant="outline"

              size="sm"

              onClick={() => navigate("/setup")}

            >

              {lang === "en" ? "Change" : "Ändern"}

            </Button>

          </div>

        </div>



        {hasPartyPass && (
          <div className="rounded-2xl border border-primary/40 bg-primary/10 p-4 mb-4">
            <p className="font-heading font-bold text-sm">
              {lang === "en"
                ? `24-hour Party Pass active · ${formatPartyPassTime(partyPassRemainingMs)} remaining`
                : `24h Party Pass aktiv · ${formatPartyPassTime(partyPassRemainingMs)} verbleibend`}
            </p>
            <p className="font-body text-xs text-muted-foreground mt-1">
              {lang === "en"
                ? `All premium game modes are unlocked. Up to ${MAX_PARTY_PASS_PLAYERS} local players are allowed while the pass is active.`
                : `Alle Premium-Spielmodi sind freigeschaltet. Solange der Pass aktiv ist, sind bis zu ${MAX_PARTY_PASS_PLAYERS} lokale Spieler möglich.`}
            </p>
          </div>
        )}


        {isNativeStore && trialAvailable && (

          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 mb-4">

            <p className="font-heading font-bold text-sm">

              {trialStarted

                ? lang === "en"

                  ? `Free trial: ${formatLocalTrialTime(trialRemainingMs)} remaining`

                  : `Kostenlose Testzeit: ${formatLocalTrialTime(trialRemainingMs)} verbleibend`

                : lang === "en"

                  ? `${LOCAL_TRIAL_MINUTES} minutes free trial`

                  : `${LOCAL_TRIAL_MINUTES} Minuten kostenlos testen`}

            </p>

            <p className="font-body text-xs text-muted-foreground mt-1">

              {lang === "en"

                ? "The timer starts only after you start the local game."

                : "Die Zeit läuft erst, wenn du das lokale Spiel startest."}

            </p>

          </div>

        )}



        <div className="bg-card border border-border rounded-2xl p-5 mb-4">

          <h2 className="font-heading font-semibold text-base mb-3">

            {t(lang, "setup_add_player")}

          </h2>



          <AvatarPicker

            selected={playerAvatar}

            onSelect={setPlayerAvatar}

            disabledAvatars={players.map((player) => player.avatar)}

          />



          <div className="flex gap-2 mt-3">

            <Input

              placeholder={t(lang, "setup_name_placeholder")}

              value={playerName}

              onChange={(event) => setPlayerName(event.target.value)}

              onKeyDown={(event) => event.key === "Enter" && addPlayer()}

              className="font-body"

            />

            <Button

              onClick={addPlayer}

              disabled={

                !playerName.trim() ||

                duplicatePlayerName ||

                players.length >= maxLocalPlayers

              }

              className="shrink-0"

              aria-label={lang === "en" ? "Add player" : "Spieler hinzufügen"}

            >

              <Plus className="w-4 h-4" />

            </Button>

          </div>



          {duplicatePlayerName && (

            <p className="mt-2 text-xs font-body text-destructive" role="alert">

              {lang === "en"

                ? "This name is already being used. Please choose a different name."

                : "Dieser Name wird bereits verwendet. Bitte wähle einen anderen Namen."}

            </p>

          )}

        </div>



        <AnimatePresence>

          {players.length > 0 && (

            <motion.div

              initial={{ opacity: 0, y: -10 }}

              animate={{ opacity: 1, y: 0 }}

              className="bg-card border border-border rounded-2xl p-4 mb-4"

            >

              <h2 className="font-heading font-semibold text-sm text-muted-foreground mb-3">

                {t(lang, "setup_players")} ({players.length})

              </h2>



              <div className="flex flex-wrap gap-2">

                <AnimatePresence>

                  {players.map((player, index) => (

                    <motion.div

                      key={`${player.name}-${index}`}

                      initial={{ opacity: 0, scale: 0.8 }}

                      animate={{ opacity: 1, scale: 1 }}

                      exit={{ opacity: 0, scale: 0.8 }}

                      className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-xl text-sm font-body"

                    >

                      <span>{player.avatar}</span>

                      <span>{player.name}</span>

                      <button

                        type="button"

                        onClick={() => removePlayer(index)}

                        aria-label={lang === "en" ? "Remove player" : "Spieler entfernen"}

                        className="text-muted-foreground hover:text-foreground ml-1 min-h-[44px] min-w-[44px] flex items-center justify-center"

                      >

                        <X className="w-3.5 h-3.5" />

                      </button>

                    </motion.div>

                  ))}

                </AnimatePresence>

              </div>

            </motion.div>

          )}

        </AnimatePresence>



        {isClassicMode && (

          <>

            <div className="bg-card border border-border rounded-2xl p-5 mb-4 space-y-4">

              <h2 className="font-heading font-semibold text-base">

                {t(lang, "setup_options")}

              </h2>



              <HotModeGate

                isPremium={isHotPremium || trialAvailable || hasPartyPass}

                hotMode={hotMode}

                onToggle={handleHotToggle}

                onBuyClick={() => handleBuyClick("hot")}

              />



              <HardcoreModeGate

                isPremium={isHardcorePremium || trialAvailable || hasPartyPass}

                hardcoreMode={hardcoreMode}

                onToggle={handleHardcoreToggle}

                onBuyClick={() => handleBuyClick("hardcore")}

              />

            </div>



            <Link to="/mydeck" className="block mb-6">

              <div className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 border-border bg-card transition-colors hover:border-primary/40 hover:bg-primary/5">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">

                    <Pencil className="w-4 h-4 text-white" />

                  </div>



                  <div className="text-left">

                    <p className="font-heading font-bold text-sm flex items-center gap-1">

                      {t(lang, "mydeck_title")}

                      <ModeInfoButton

                        title={t(lang, "info_custom_title")}

                        features={[

                          t(lang, "info_custom_1"),

                          t(lang, "info_custom_2"),

                          t(lang, "info_custom_3"),

                          t(lang, "info_custom_4"),

                        ]}

                      />

                    </p>

                    <p className="text-xs text-muted-foreground font-body">

                      {isCustomPremium

                        ? t(lang, "mydeck_count", deckCount)

                        : t(lang, "custom_locked_desc")}

                    </p>

                  </div>

                </div>



                {isCustomPremium ? (

                  <ChevronLeft className="w-5 h-5 text-muted-foreground -rotate-90" />

                ) : (

                  <Lock className="w-4 h-4 text-primary" />

                )}

              </div>

            </Link>

          </>

        )}



        <Button

          onClick={startGame}

          disabled={

            players.length < 2 ||

            hasDuplicatePlayerNames ||

            tooManyPlayersForAccess ||

            partyLocked ||

            partyStatusPending ||

            classicAccessBlocked

          }

          className="w-full h-14 text-base font-heading font-bold rounded-2xl active:scale-95 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"

        >

          {t(lang, "setup_start")}

        </Button>



        {partyStatusPending && (

          <p className="text-center text-xs text-muted-foreground font-body mt-2">

            {lang === "en"

              ? "Purchase status is being checked in the background."

              : "Kaufstatus wird im Hintergrund geprüft."}

          </p>

        )}



        {classicAccessBlocked && (

          <p className="text-center text-xs text-muted-foreground font-body mt-2">

            {lang === "en"

              ? "Your free trial has ended. Select a purchased HOT/Hardcore mode, use your purchased custom deck, or unlock local content permanently."

              : "Deine kostenlose Testzeit ist beendet. Wähle einen gekauften HOT-/Hardcore-Modus, nutze dein gekauftes eigenes Deck oder schalte lokale Inhalte dauerhaft frei."}

          </p>

        )}



        {players.length < 2 && (

          <p className="text-center text-xs text-muted-foreground font-body mt-2">

            {t(lang, "setup_min_players")}

          </p>

        )}



        {hasDuplicatePlayerNames && (

          <p className="text-center text-xs text-destructive font-body mt-2" role="alert">

            {lang === "en"

              ? "Each player needs a unique name."

              : "Jede Person braucht einen eigenen Spielernamen."}

          </p>

        )}



        {players.length >= maxLocalPlayers && !tooManyPlayersForAccess && (

          <p className="text-center text-xs text-muted-foreground font-body mt-2">

            {hasPartyPass
              ? lang === "en"
                ? `The 24-hour Party Pass allows up to ${MAX_PARTY_PASS_PLAYERS} local players.`
                : `Mit dem 24h-Party-Pass sind bis zu ${MAX_PARTY_PASS_PLAYERS} lokale Spieler möglich.`
              : lang === "en"
                ? `Without an active 24-hour Party Pass, up to ${MAX_LOCAL_PLAYERS} local players are possible.`
                : `Ohne aktiven 24h-Party-Pass sind maximal ${MAX_LOCAL_PLAYERS} lokale Spieler möglich.`}

          </p>

        )}

        {tooManyPlayersForAccess && (

          <p className="text-center text-xs text-destructive font-body mt-2" role="alert">

            {lang === "en"
              ? `Your Party Pass is no longer active. Reduce the group to ${MAX_LOCAL_PLAYERS} players or buy another 24-hour Party Pass.`
              : `Dein Party Pass ist nicht mehr aktiv. Reduziere die Gruppe auf ${MAX_LOCAL_PLAYERS} Spieler oder kaufe einen neuen 24h-Party-Pass.`}

          </p>

        )}

      </div>



      {isClassicMode && (

        <Paywall

          open={showPaywall}

          onClose={() => setShowPaywall(false)}

          onPurchase={handlePurchase}

          onRestore={handleRestore}

          purchasing={purchasing}

          mode={purchaseTarget}

          price={null}

        />

      )}



      <AnimatePresence>

        {isClassicMode && showHotConfirm && (

          <motion.div

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6"

          >

            <motion.div

              initial={{ scale: 0.9, opacity: 0 }}

              animate={{ scale: 1, opacity: 1 }}

              exit={{ scale: 0.9, opacity: 0 }}

              className="bg-card border border-rose-500/30 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"

            >

              <div className="text-5xl mb-4">🔞</div>

              <h2 className="font-heading font-bold text-xl mb-2">

                {t(lang, "setup_hot_confirm_title")}

              </h2>

              <p className="font-body text-sm text-muted-foreground mb-6">

                {t(lang, "setup_hot_confirm_body")}

              </p>

              <div className="flex gap-3">

                <Button

                  variant="outline"

                  onClick={() => setShowHotConfirm(false)}

                  className="flex-1"

                >

                  {t(lang, "setup_cancel")}

                </Button>

                <Button

                  onClick={confirmHotMode}

                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"

                >

                  {t(lang, "setup_activate")}

                </Button>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>



      <AnimatePresence>

        {isClassicMode && showHardcoreConfirm && (

          <motion.div

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6"

          >

            <motion.div

              initial={{ scale: 0.9, opacity: 0 }}

              animate={{ scale: 1, opacity: 1 }}

              exit={{ scale: 0.9, opacity: 0 }}

              className="bg-card border border-red-500/30 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"

            >

              <div className="text-5xl mb-4">💀</div>

              <h2 className="font-heading font-bold text-xl mb-2">

                {t(lang, "hardcore_confirm_title")}

              </h2>

              <p className="font-body text-sm text-muted-foreground mb-6">

                {t(lang, "hardcore_confirm_body")}

              </p>

              <div className="flex gap-3">

                <Button

                  variant="outline"

                  onClick={() => setShowHardcoreConfirm(false)}

                  className="flex-1"

                >

                  {t(lang, "setup_cancel")}

                </Button>

                <Button

                  onClick={confirmHardcoreMode}

                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"

                >

                  {t(lang, "hardcore_activate")}

                </Button>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>



      <BottomTabBar />

    </div>

  );

}
