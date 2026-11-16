import React, { useEffect, useMemo, useState } from "react";

import { Capacitor } from "@capacitor/core";

import { useNavigate } from "react-router-dom";

import {

  Wine,

  Brain,

  Sparkles,

  Drama,

   MessageCircleQuestion,

  Hand,

  Lock,

  Check,

  Crown,

} from "lucide-react";



import { Button } from "@/components/ui/button";

import BackButton from "@/components/BackButton";

import BottomTabBar from "@/components/BottomTabBar";
import RevenueCatTest from "@/components/RevenueCatTest";



import {
  getPartyPassExpiryFromCustomerInfo,
  getPartyPassExpiryFromTransaction,
  usePremium,
} from "@/lib/PremiumContext";

import {

  getPackagePrice,

  purchaseProduct,

  restorePurchases,

} from "@/lib/iap";

import { PARTY_MODE_PURCHASES, PRODUCTS } from "@/lib/products";

import { useLocalTrial, formatLocalTrialTime, LOCAL_TRIAL_MINUTES } from "@/lib/LocalTrialContext";

import { useLanguage } from "@/lib/LanguageContext";

import { t } from "@/lib/i18n";



const GAME_MODE_OPTIONS = [

  {

    id: "classic",

    Icon: Wine,

    titleKey: "setup_mode_classic",

    descKey: "setup_mode_classic_desc",

  },

  {
  id: "wer_wuerde",
  Icon: MessageCircleQuestion,
  title: {
    de: "Wer würde…?",
    en: "Who Would…?",
  },
  desc: {
    de: "Wer aus der Gruppe würde das am ehesten tun? Stimmt gemeinsam ab!",
    en: "Who in your group would most likely do it? Vote together!",
  },
},

  {

    id: "wer_kennt_wen",

    Icon: Brain,

    titleKey: "wkw_home_title",

    descKey: "wkw_home_desc",

  },

  {

    id: "bluff_wahrheit",

    Icon: Sparkles,

    titleKey: "bluff_home_title",

    descKey: "bluff_home_desc",

  },

  {

    id: "pantomime",

    Icon: Drama,

    title: { de: "Pantomime", en: "Charades" },

    desc: {

      de: "Begriffe darstellen und gemeinsam raten.",

      en: "Act out prompts and guess together.",

    },

  },

  {

    id: "ich_habe_noch_nie",

    Icon: Hand,

    title: { de: "Ich habe noch nie", en: "Never Have I Ever" },

    desc: {

      de: "Erfahrungen teilen und einander kennenlernen.",

      en: "Share experiences and learn about each other.",

    },

  },

];



function modeText(option, lang) {

  return {

    title: option.titleKey

      ? t(lang, option.titleKey)

      : option.title[lang === "en" ? "en" : "de"],

    desc: option.descKey

      ? t(lang, option.descKey)

      : option.desc[lang === "en" ? "en" : "de"],

  };

}



function wait(ms) {

  return new Promise((resolve) => setTimeout(resolve, ms));

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



export default function Setup() {

  const navigate = useNavigate();

  const { lang } = useLanguage();

  const {

    partyEntitlements,

    premiumStatusLoading,

    partyPassRemainingMs,

    hasPartyPass,

    activatePartyPass,

    refreshPremiumStatus,

  } = usePremium();



 
const platform = Capacitor.getPlatform();

const isNativeStore =
  platform === "android" || platform === "ios";

const isWebStore = platform === "web";

  const {

    started: trialStarted,

    remainingMs: trialRemainingMs,

    trialAvailable,

  } = useLocalTrial();

  const [gameMode, setGameMode] = useState("classic");

  const [showPartyPaywall, setShowPartyPaywall] = useState(false);

  const [partyPurchaseMessage, setPartyPurchaseMessage] = useState("");

  const [partyPrice, setPartyPrice] = useState(null);

  const [partyPriceError, setPartyPriceError] = useState("");

  const [partyPriceRetry, setPartyPriceRetry] = useState(0);

  const [purchasing, setPurchasing] = useState(false);

  const [showPartyPassPaywall, setShowPartyPassPaywall] = useState(false);
  const [partyPassPrice, setPartyPassPrice] = useState(null);
  const [partyPassPriceError, setPartyPassPriceError] = useState("");
  const [partyPassPriceRetry, setPartyPassPriceRetry] = useState(0);
  const [partyPassPurchaseMessage, setPartyPassPurchaseMessage] = useState("");



  const partyPurchase = PARTY_MODE_PURCHASES[gameMode] || null;

  const partyOwned = partyPurchase

    ? Boolean(partyEntitlements[partyPurchase.entitlementId])

    : false;

 
const partyStatusPending =
  isWebStore &&
  Boolean(partyPurchase) &&
  premiumStatusLoading &&
  !hasPartyPass;

const partyLocked =
  isWebStore &&
  Boolean(partyPurchase) &&
  !premiumStatusLoading &&
  !partyOwned &&
  !hasPartyPass;



  // Wichtig: Beim Oeffnen des lokalen Bereichs wird RevenueCat NICHT mehr

  // zwangsweise frisch abgefragt. PremiumContext aktualisiert den Status bereits

  // beim App-Start. Eine erzwungene Netzwerkabfrage hier kann den lokalen

  // Ablauf unnötig blockieren, besonders bei langsamer Store/RevenueCat-Antwort.



  useEffect(() => {

    let cancelled = false;



    setPartyPrice(null);

    setPartyPriceError("");



    
if (
  !showPartyPaywall ||
  !isWebStore ||
  !partyPurchase ||
  partyOwned
) {
  return undefined;
}



    getPackagePrice(

      partyPurchase.packageId,

      partyPurchase.productId

    )

      .then((result) => {

        if (cancelled) return;

        if (result.ok && result.priceString) {

          setPartyPrice({

            productId: partyPurchase.productId,

            priceString: result.priceString,

          });

          return;

        }

        setPartyPriceError(

          result.message ||

            (lang === "en"

              ? "Price currently unavailable."

              : "Preis derzeit nicht verfügbar.")

        );

      })

      .catch(() => {

        if (!cancelled) {

          setPartyPriceError(

            lang === "en"

              ? "Price currently unavailable."

              : "Preis derzeit nicht verfügbar."

          );

        }

      });



    return () => {

      cancelled = true;

    };

  }, [

    showPartyPaywall,

    isWebStore,

    partyPurchase?.packageId,

    partyPurchase?.productId,

    partyOwned,

    partyPriceRetry,

    lang,

  ]);



  useEffect(() => {
    let cancelled = false;

    setPartyPassPrice(null);
    setPartyPassPriceError("");

    if (
      !showPartyPassPaywall ||
      !isNativeStore ||
      hasPartyPass
    ) {
      return undefined;
    }

    getPackagePrice(PRODUCTS.PARTY_PASS.id)
      .then((result) => {
        if (cancelled) return;

        if (result.ok && result.priceString) {
          setPartyPassPrice(result.priceString);
          return;
        }

        setPartyPassPriceError(
          result.message ||
            (lang === "en"
              ? "Price currently unavailable."
              : "Preis derzeit nicht verfügbar.")
        );
      })
      .catch(() => {
        if (!cancelled) {
          setPartyPassPriceError(
            lang === "en"
              ? "Price currently unavailable."
              : "Preis derzeit nicht verfügbar."
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    showPartyPassPaywall,
    isNativeStore,
    hasPartyPass,
    partyPassPriceRetry,
    lang,
  ]);


  const availablePartyPrice =

    partyPrice &&

    partyPurchase &&

    partyPrice.productId === partyPurchase.productId

      ? partyPrice.priceString

      : null;



  const selectedOption = useMemo(

    () => GAME_MODE_OPTIONS.find((option) => option.id === gameMode),

    [gameMode]

  );



  const partyLabel = partyPurchase?.label?.[

    lang === "en" ? "en" : "de"

  ] || "";



  const productWasRecorded = (info) => {

    if (!partyPurchase?.productId) return false;

    const ids = info?.allPurchasedProductIdentifiers;

    return Array.isArray(ids) && ids.includes(partyPurchase.productId);

  };



  const customerHasPartyAccess = (info) => {

    if (!partyPurchase) return false;



    if (

      info?.entitlements?.active?.[

        partyPurchase.entitlementId

      ]

    ) {

      return true;

    }



    const ids = Array.isArray(

      info?.allPurchasedProductIdentifiers

    )

      ? info.allPurchasedProductIdentifiers

      : [];



    return (

      ids.includes(

        partyPurchase.productId

      ) ||

      ids.includes(

        "trinkluma_local_bundle"

      ) ||

      ids.includes(

        "de.trinkluma.bundle"

      )

    );

  };



  const accessMessage = (info, purchaseConfirmed = false) => {

    if (productWasRecorded(info)) {

      return lang === "en"

        ? "The store has registered this purchase. The app is updating your local unlock now. Please do not buy it again."

        : "Der Store hat diesen Kauf registriert. Die lokale Freischaltung wird jetzt aktualisiert. Bitte nicht erneut kaufen.";

    }



    if (purchaseConfirmed) {

      return lang === "en"

        ? "The store confirmed the purchase. Please do not buy it again; the unlock is being refreshed."

        : "Der Store hat den Kauf bestätigt. Bitte nicht erneut kaufen; die Freischaltung wird aktualisiert.";

    }



    return lang === "en"

      ? "No unlock is visible yet. If you bought this mode before, use ‘Restore unlock’ below."

      : "Noch keine Freischaltung sichtbar. Wenn du diesen Modus bereits gekauft hast, nutze unten „Freischaltung wiederherstellen“.";

  };



  const confirmEntitlement = async (initialInfo = null) => {

    if (!partyPurchase) return false;



    let info = await refreshPremiumStatus(initialInfo);

    if (customerHasPartyAccess(info)) {

      return true;

    }



    await wait(400);

    info = await refreshPremiumStatus(null, true);

    if (customerHasPartyAccess(info)) {

      return true;

    }



    await wait(1000);

    info = await refreshPremiumStatus(null, true);

    return customerHasPartyAccess(info);

  };



  const openPartyPaywall = (modeId) => {

    const purchase = PARTY_MODE_PURCHASES[modeId];

    if (!purchase) return;

    setGameMode(modeId);

    setPartyPurchaseMessage("");

    setShowPartyPaywall(true);

  };



  const handlePartyPurchase = async () => {

    if (

      !partyPurchase ||

      !availablePartyPrice ||

      premiumStatusLoading ||

      purchasing

    ) {

      return;

    }



    setPurchasing(true);

    setPartyPurchaseMessage("");



    try {

      const result = await purchaseProduct(

        partyPurchase.packageId,

        partyPurchase.productId

      );



      if (result.ok && result.purchased) {

        const unlocked = await confirmEntitlement(result.customerInfo);

        if (unlocked) {

          setShowPartyPaywall(false);

          return;

        }



        const currentInfo = await refreshPremiumStatus(null, true);

        setPartyPurchaseMessage(accessMessage(currentInfo, true));

        return;

      }



      if (result.reason !== "cancelled") {

        setPartyPurchaseMessage(

          result.message ||

            (lang === "en" ? "Purchase failed." : "Kauf fehlgeschlagen.")

        );

      }

    } catch (error) {

      setPartyPurchaseMessage(

        error?.message ||

          (lang === "en" ? "Purchase failed." : "Kauf fehlgeschlagen.")

      );

    } finally {

      setPurchasing(false);

    }

  };



  const handlePartyRestore = async () => {

    if (!partyPurchase || purchasing) return;



    setPurchasing(true);

    setPartyPurchaseMessage("");



    try {

      const result = await restorePurchases();

      if (!result.ok) {

        setPartyPurchaseMessage(

          result.message ||

            (lang === "en"

              ? "The earlier purchase could not be reloaded."

              : "Der frühere Kauf konnte nicht neu geladen werden.")

        );

        return;

      }



      const unlocked = await confirmEntitlement(result.customerInfo);

      if (unlocked) {

        setShowPartyPaywall(false);

        return;

      }



      const info = await refreshPremiumStatus(null, true);

      setPartyPurchaseMessage(accessMessage(info));

    } catch (error) {

      setPartyPurchaseMessage(

        error?.message ||

          (lang === "en"

            ? "The earlier purchase could not be reloaded."

            : "Der frühere Kauf konnte nicht neu geladen werden.")

      );

    } finally {

      setPurchasing(false);

    }

  };



  const findActivePartyPassExpiry = (
    customerInfo,
    transaction = null
  ) => {
    const candidates = [
      getPartyPassExpiryFromCustomerInfo(customerInfo),
      getPartyPassExpiryFromTransaction(transaction),
    ].filter(
      (value) =>
        Number.isFinite(value) &&
        value > Date.now()
    );

    return candidates.length
      ? Math.max(...candidates)
      : null;
  };

  const handlePartyPassPurchase = async () => {
    if (
      purchasing ||
      premiumStatusLoading ||
      !isNativeStore ||
      !partyPassPrice
    ) {
      return;
    }

    setPurchasing(true);
    setPartyPassPurchaseMessage("");

    try {
      const result = await purchaseProduct(
        PRODUCTS.PARTY_PASS.id
      );

      if (result.ok && result.purchased) {
        let info = await refreshPremiumStatus(
          result.customerInfo
        );

        let expiry = findActivePartyPassExpiry(
          info,
          result.transaction
        );

        if (!expiry) {
          info = await refreshPremiumStatus(
            null,
            true
          );

          expiry = findActivePartyPassExpiry(
            info,
            result.transaction
          );
        }

        if (expiry && activatePartyPass(expiry)) {
          setShowPartyPassPaywall(false);
          return;
        }

        setPartyPassPurchaseMessage(
          lang === "en"
            ? "The purchase was confirmed, but the 24-hour access is still syncing. Please do not buy again."
            : "Der Kauf wurde bestätigt, aber die 24h-Freischaltung wird noch synchronisiert. Bitte nicht erneut kaufen."
        );
        return;
      }

      if (result.reason !== "cancelled") {
        setPartyPassPurchaseMessage(
          result.message ||
            (lang === "en"
              ? "Purchase failed."
              : "Kauf fehlgeschlagen.")
        );
      }
    } catch (error) {
      setPartyPassPurchaseMessage(
        error?.message ||
          (lang === "en"
            ? "Purchase failed."
            : "Kauf fehlgeschlagen.")
      );
    } finally {
      setPurchasing(false);
    }
  };

  const handlePartyPassRestore = async () => {
    if (purchasing || !isNativeStore) {
      return;
    }

    setPurchasing(true);
    setPartyPassPurchaseMessage("");

    try {
      const result = await restorePurchases();

      if (!result.ok) {
        setPartyPassPurchaseMessage(
          result.message ||
            (lang === "en"
              ? "The earlier purchase could not be reloaded."
              : "Der frühere Kauf konnte nicht neu geladen werden.")
        );
        return;
      }

      let info = await refreshPremiumStatus(
        result.customerInfo
      );

      let expiry =
        findActivePartyPassExpiry(info);

      if (!expiry) {
        info = await refreshPremiumStatus(
          null,
          true
        );

        expiry =
          findActivePartyPassExpiry(info);
      }

      if (expiry && activatePartyPass(expiry)) {
        setShowPartyPassPaywall(false);
        return;
      }

      setPartyPassPurchaseMessage(
        lang === "en"
          ? "No active 24-hour Party Pass was found."
          : "Es wurde kein aktiver 24h-Party-Pass gefunden."
      );
    } catch (error) {
      setPartyPassPurchaseMessage(
        error?.message ||
          (lang === "en"
            ? "The earlier purchase could not be reloaded."
            : "Der frühere Kauf konnte nicht neu geladen werden.")
      );
    } finally {
      setPurchasing(false);
    }
  };


  const continueToPlayers = () => {

    if (!selectedOption || partyLocked || premiumStatusLoading) return;



    try {

      localStorage.setItem("trinkluma_selected_local_mode_v1", gameMode);

    } catch {

      // localStorage nicht verfügbar

    }



    navigate("/setup/players", {

      state: { gameMode },

    });

  };



  return (

    <div className="min-h-screen bg-background flex flex-col items-center p-6 pt-safe pb-28 relative overflow-hidden">

      <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-accent/8 rounded-full blur-3xl pointer-events-none" />



      <BackButton />



      <div className="w-full max-w-md relative z-10 pb-10 pt-12">

        <h1 className="font-heading font-bold text-2xl mb-2">

          {lang === "en" ? "Choose game mode" : "Spielmodus auswählen"}

        </h1>

        <p className="font-body text-sm text-muted-foreground mb-4">

          {lang === "en"

            ? "First choose the mode. You add the players on the next page."

            : "Wähle zuerst den Modus. Die Spieler trägst du auf der nächsten Seite ein."}

        </p>



        {isNativeStore && (

          <div className={`rounded-2xl border p-4 mb-6 ${

            trialAvailable

              ? "border-primary/30 bg-primary/5"

              : "border-border bg-card"

          }`}>

            <p className="font-heading font-bold text-sm">

              {trialAvailable

                ? trialStarted

                  ? lang === "en"

                    ? `Free trial: ${formatLocalTrialTime(trialRemainingMs)} remaining`

                    : `Kostenlose Testzeit: ${formatLocalTrialTime(trialRemainingMs)} verbleibend`

                  : lang === "en"

                    ? `${LOCAL_TRIAL_MINUTES} minutes free trial`

                    : `${LOCAL_TRIAL_MINUTES} Minuten kostenlos testen`

                : lang === "en"

                  ? "Free trial finished"

                  : "Kostenlose Testzeit beendet"}

            </p>

            <p className="font-body text-xs text-muted-foreground mt-1">

              {trialAvailable

                ? lang === "en"

                  ? "The timer runs only while a local game is open. Menus and background time do not count."

                  : "Die Zeit läuft nur während einer lokalen Partie. Menüs und Zeit im Hintergrund zählen nicht."

                : lang === "en"

                  ? "Purchased modes remain available. Other local modes can be unlocked permanently."

                  : "Gekaufte Modi bleiben verfügbar. Weitere lokale Modi kannst du dauerhaft freischalten."}

            </p>

          </div>

        )}



        <div
          className={`rounded-2xl border-2 p-4 mb-6 ${
            hasPartyPass
              ? "border-primary/50 bg-primary/10"
              : "border-border bg-card"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="font-heading font-bold">
                  24h Party Pass
                </p>

               <span className="font-heading font-bold text-primary shrink-0">
  {hasPartyPass
    ? formatPartyPassTime(
        partyPassRemainingMs
      )
      : ""}
</span>
              </div>

              <p className="font-body text-xs text-muted-foreground mt-1">
                {lang === "en"
                  ? "Unlock all premium game modes for 24 hours and play locally with up to 8 players."
                  : "Schaltet alle Premium-Spielmodi für 24 Stunden frei und erlaubt lokale Runden mit bis zu 8 Spielern."}
              </p>

              {hasPartyPass ? (
                <p className="font-heading font-semibold text-xs text-primary mt-3">
                  {lang === "en"
                    ? "Party Pass active"
                    : "Party Pass aktiv"}
                </p>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => {
                    setPartyPassPurchaseMessage("");
                    setPartyPassPriceError("");
                    setShowPartyPassPaywall(true);
                  }}
                  disabled={
                    !isNativeStore ||
                    premiumStatusLoading
                  }
                >
                 
{lang === "en"
  ? "24h Party Pass – coming soon"
  : "24h Party Pass – in Vorbereitung"}
                </Button>
              )}
            </div>
          </div>
        </div>


        <div className="flex flex-col gap-3">

          {GAME_MODE_OPTIONS.map((option) => {

            const { id, Icon } = option;

            const active = gameMode === id;

            const purchase = PARTY_MODE_PURCHASES[id];

            const owned = purchase

              ? Boolean(partyEntitlements?.[purchase.entitlementId])

              : true;

            
const needsPurchase =
  isWebStore &&
  Boolean(purchase) &&
  !owned &&
  !hasPartyPass;


const checking =
  needsPurchase && premiumStatusLoading;


            const text = modeText(option, lang);



            return (

              <div

                key={id}

                className={`w-full flex items-center gap-2 rounded-2xl border-2 transition-all ${

                  active

                    ? "border-primary/60 bg-primary/5"

                    : "border-border bg-card"

                }`}

              >

                <button

                  type="button"

                  onClick={() => {

                    setGameMode(id);

                    setPartyPurchaseMessage("");

                  }}

                  className="min-w-0 flex-1 flex items-center gap-3 p-3.5 text-left"

                  aria-pressed={active}

                >

                  <div

                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${

                      active ? "bg-primary/20" : "bg-secondary"

                    }`}

                  >

                    <Icon

                      className={`w-4 h-4 ${

                        active ? "text-primary" : "text-muted-foreground"

                      }`}

                    />

                  </div>



                  <div className="min-w-0 flex-1">

                    <p className="font-heading font-bold text-sm">{text.title}</p>

                    <p className="font-body text-xs text-muted-foreground">

                      {text.desc}

                    </p>

                  </div>

                </button>



                {needsPurchase && !checking ? (

                  <button

                    type="button"

                    onClick={() => openPartyPaywall(id)}

                    className="mr-3 w-11 h-11 rounded-full flex items-center justify-center border border-primary/30 bg-primary/10 text-primary active:scale-95"

                    aria-label={

                      lang === "en"

                        ? `Unlock ${text.title}`

                        : `${text.title} freischalten`

                    }

                  >

                    <Lock className="w-4 h-4" />

                  </button>

                ) : active && (!purchase || owned || trialAvailable || hasPartyPass) && !checking ? (

                  <div className="mr-4" aria-hidden="true">

                    <Check className="w-5 h-5 text-primary" />

                  </div>

                ) : checking ? (

                  <div

                    className="mr-4 w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"

                    aria-label={lang === "en" ? "Checking purchase status" : "Kaufstatus wird geprüft"}

                  />

                ) : null}

              </div>

            );

          })}

        </div>



        <Button

          onClick={continueToPlayers}

          disabled={partyLocked || partyStatusPending}

          className="w-full h-14 mt-6 text-base font-heading font-bold rounded-2xl active:scale-95 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"

        >

          {lang === "en" ? "Continue to players" : "Weiter zu Spielern"}

        </Button>



        
{partyLocked && (
  <p className="text-center text-xs text-muted-foreground font-body mt-2">
    {lang === "en"
      ? "Tap the lock on this game mode to unlock it permanently."
      : "Tippe auf das Schloss dieses Spielmodus, um ihn dauerhaft freizuschalten."}
  </p>
)}



        {trialAvailable && partyPurchase && !partyOwned && !hasPartyPass && (

          <p className="text-center text-xs text-muted-foreground font-body mt-2">

            {lang === "en"

              ? `This mode can be tested now. ${formatLocalTrialTime(trialRemainingMs)} free play time remains.`

              : `Diesen Modus kannst du jetzt testen. ${formatLocalTrialTime(trialRemainingMs)} kostenlose Spielzeit verbleibt.`}

          </p>

        )}

      </div>



      
{showPartyPaywall && isWebStore && partyPurchase && !partyOwned && !hasPartyPass && (


        <div

          className="fixed inset-0 z-[100] bg-black/75 flex items-center justify-center p-4"

          role="presentation"

        >

          <div

            role="dialog"

            aria-modal="true"

            aria-labelledby="party-purchase-heading"

            className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 space-y-4 shadow-2xl"

          >

            <h2 id="party-purchase-heading" className="font-heading font-bold text-xl">

              {partyLabel}

            </h2>



            <p className="text-sm text-muted-foreground">

              {lang === "en"

                ? "Unlock this game mode once and use it permanently in local play."

                : "Diesen Spielmodus einmalig freischalten und im lokalen Spiel dauerhaft nutzen."}

            </p>



            {premiumStatusLoading ? (

              <p className="text-sm">

                {lang === "en" ? "Checking purchase status…" : "Kaufstatus wird geprüft…"}

              </p>

            ) : (

              <>

                {partyPriceError && (

                  <div className="space-y-1">

                    <p className="text-sm text-destructive">{partyPriceError}</p>

                    <Button

                      variant="outline"

                      onClick={() => setPartyPriceRetry((value) => value + 1)}

                    >

                      {lang === "en" ? "Retry price" : "Preis erneut laden"}

                    </Button>

                  </div>

                )}



                
{availablePartyPrice ? (
  <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
    <p className="text-sm text-muted-foreground mb-1">
      {lang === "en" ? "One-time price" : "Einmaliger Kaufpreis"}
    </p>

    <p className="text-2xl font-heading font-black text-primary">
      {availablePartyPrice}
    </p>

    <p className="text-xs text-muted-foreground mt-1">
      {lang === "en"
        ? "Permanent unlock. No subscription."
        : "Dauerhafte Freischaltung. Kein Abo."}
    </p>
  </div>
) : !partyPriceError ? (
  <p className="text-sm text-center text-muted-foreground">
    {lang === "en"
      ? "Loading price..."
      : "Preis wird geladen..."}
  </p>
) : null}

<Button
  className="w-full"
  onClick={handlePartyPurchase}
  disabled={purchasing || !availablePartyPrice}
>
  {purchasing
    ? lang === "en"
      ? "Please wait…"
      : "Bitte warten…"
    : lang === "en"
      ? "Buy permanently"
      : "Dauerhaft kaufen"}
</Button>




                <button

                  type="button"

                  className="w-full text-xs text-muted-foreground underline underline-offset-2"

                  onClick={handlePartyRestore}

                  disabled={purchasing}

                >

                  {lang === "en"

                    ? "Already bought? Restore unlock"

                    : "Schon gekauft? Freischaltung wiederherstellen"}

                </button>

              </>

            )}



            <Button

              className="w-full"

              variant="ghost"

              onClick={() => setShowPartyPaywall(false)}

              disabled={purchasing}

            >

              {lang === "en" ? "Close" : "Schließen"}

            </Button>



            {partyPurchaseMessage && (

              <p role="status" className="text-sm text-center">

                {partyPurchaseMessage}

              </p>

            )}

          </div>

        </div>

      )}



      {showPartyPassPaywall && !hasPartyPass && (
        <div
          className="fixed inset-0 z-[110] bg-black/75 flex items-center justify-center p-4"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="party-pass-heading"
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                <Crown className="w-5 h-5 text-primary" />
              </div>

              <div>
                <h2
                  id="party-pass-heading"
                  className="font-heading font-bold text-xl"
                >
                  24h Party Pass
                </h2>
                <p className="text-xs text-muted-foreground">
                  {lang === "en"
                    ? "One purchase · 24 hours"
                    : "Ein Kauf · 24 Stunden"}
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {lang === "en"
                ? "For 24 hours, all premium game modes are unlocked and you can play locally with up to 8 players. Permanent purchases remain unchanged."
                : "Für 24 Stunden sind alle Premium-Spielmodi freigeschaltet und du kannst lokal mit bis zu 8 Spielern spielen. Dauerhafte Käufe bleiben unverändert."}
            </p>

            {partyPassPriceError && (
              <div className="space-y-2">
                <p className="text-sm text-destructive">
                  {partyPassPriceError}
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    setPartyPassPriceRetry(
                      (value) => value + 1
                    )
                  }
                >
                  {lang === "en"
                    ? "Retry price"
                    : "Preis erneut laden"}
                </Button>
              </div>
            )}

            <Button
              className="w-full"
              onClick={handlePartyPassPurchase}
              disabled={
                purchasing ||
                premiumStatusLoading ||
                !isNativeStore ||
                !partyPassPrice
              }
            >
              {purchasing
                ? lang === "en"
                  ? "Please wait…"
                  : "Bitte warten…"
                : lang === "en"
                  ? "Buy 24h Party Pass"
                  : "24h Party Pass kaufen"}
            </Button>

            <button
              type="button"
              className="w-full text-xs text-muted-foreground underline underline-offset-2"
              onClick={handlePartyPassRestore}
              disabled={purchasing || !isNativeStore}
            >
              {lang === "en"
                ? "Already bought an active pass? Restore"
                : "Aktiven Pass bereits gekauft? Wiederherstellen"}
            </button>

            <Button
              className="w-full"
              variant="ghost"
              onClick={() =>
                setShowPartyPassPaywall(false)
              }
              disabled={purchasing}
            >
              {lang === "en" ? "Close" : "Schließen"}
            </Button>

            {partyPassPurchaseMessage && (
              <p
                role="status"
                className="text-sm text-center"
              >
                {partyPassPurchaseMessage}
              </p>
            )}
          </div>
        </div>
      )}


        {isWebStore &&
          true && (
            <RevenueCatTest />
          )}
      <BottomTabBar />

    </div>

  );

}
