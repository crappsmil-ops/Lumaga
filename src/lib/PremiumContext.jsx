import React, {

  createContext,

  useContext,

  useState,

  useEffect,

  useCallback,

} from "react";




import { Purchases } from "@/lib/revenueCatAdapter";
import { getWebPurchaseAuthorization } from "@/lib/purchaseAuthorization";
import { getVerifiedPremiumModes } from "@/lib/verifiedPremiumModes";
import { PRODUCTS } from "@/lib/products";
import { Capacitor } from "@capacitor/core";

const IS_WEB = Capacitor.getPlatform() === "web";



const PARTY_PASS_DURATION_MS = 24 * 60 * 60 * 1000;

function parsePurchaseDate(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const timestamp =
    typeof value === "number"
      ? value
      : new Date(value).getTime();

  return Number.isFinite(timestamp) && timestamp > 0
    ? timestamp
    : null;
}

export function getPartyPassExpiryFromTransaction(transaction) {
  if (!transaction || !PRODUCTS.PARTY_PASS.id) {
    return null;
  }

  const productId = String(
    transaction?.productIdentifier ||
      transaction?.productId ||
      ""
  ).trim();

  if (productId !== PRODUCTS.PARTY_PASS.id) {
    return null;
  }

  const purchaseTimestamp = parsePurchaseDate(
    transaction?.purchaseDate
  );

  return purchaseTimestamp
    ? purchaseTimestamp + PARTY_PASS_DURATION_MS
    : null;
}

export function getPartyPassExpiryFromCustomerInfo(customerInfo) {
  if (!customerInfo || !PRODUCTS.PARTY_PASS.id) {
    return null;
  }

  const purchaseTimes = [];

  const directTimestamp = parsePurchaseDate(
    customerInfo?.allPurchaseDates?.[
      PRODUCTS.PARTY_PASS.id
    ]
  );

  if (directTimestamp) {
    purchaseTimes.push(directTimestamp);
  }

  const transactions = Array.isArray(
    customerInfo?.nonSubscriptionTransactions
  )
    ? customerInfo.nonSubscriptionTransactions
    : [];

  transactions.forEach((transaction) => {
    const productId = String(
      transaction?.productIdentifier ||
        transaction?.productId ||
        ""
    ).trim();

    if (productId !== PRODUCTS.PARTY_PASS.id) {
      return;
    }

    const purchaseTimestamp = parsePurchaseDate(
      transaction?.purchaseDate
    );

    if (purchaseTimestamp) {
      purchaseTimes.push(purchaseTimestamp);
    }
  });

  if (!purchaseTimes.length) {
    return null;
  }

  return Math.max(...purchaseTimes) + PARTY_PASS_DURATION_MS;
}


const EMPTY_PARTY_ENTITLEMENTS = Object.freeze({
  wer_wuerde: false,
  wkw: false,
  bluff: false,
  pantomime: false,
  never: false,
});




const PremiumContext = createContext({

  partyEntitlements: EMPTY_PARTY_ENTITLEMENTS,

  premiumStatusLoading: true,

  isHotPremium: false,

  setIsHotPremium: () => {},



  isCustomPremium: false,

  setIsCustomPremium: () => {},



  isHardcorePremium: false,

  setIsHardcorePremium: () => {},



  partyPassExpiry: null,

  partyPassRemainingMs: 0,

  hasPartyPass: false,



  activatePartyPass: () => {},

  clearPartyPass: () => {},



  refreshPremiumStatus: async () => {},
  webPartyPassVerificationError: false,
  // On web, triggers a fresh server-side authorization check instead of
  // trusting RevenueCat client-side data directly.  Used by pages that
  // call purchaseProduct / restorePurchases so that a revoked browser
  // cannot re-enable premium flags by calling those APIs.
  revalidateWebPurchase: () => {},

});



function unwrapCustomerInfo(result) {

  if (!result) {

    return null;

  }



  return (

    result?.customerInfo ||

    (result?.entitlements ? result : null)

  );

}



function readStored(key) {

  try {

    return localStorage.getItem(key) === "true";

  } catch {

    return false;

  }

}



function readStoredNumber(key) {

  try {

    const value = localStorage.getItem(key);



    if (!value) {

      return null;

    }



    const number = Number(value);



    return Number.isFinite(number)

      ? number

      : null;

  } catch {

    return null;

  }

}



function makeSetter(key, setter) {

  return (value) => {

    const nextValue = Boolean(value);



    setter(nextValue);



    try {

      localStorage.setItem(

        key,

        String(nextValue)

      );

    } catch {

      // localStorage nicht verfügbar

    }

  };

}



export function PremiumProvider({

  children,

}) {

  // New party purchases use RevenueCat CustomerInfo, never a writable

  // localStorage premium flag. Old HOT/Hardcore/Deck logic remains unchanged.

  const [partyEntitlements, setPartyEntitlements] = useState(

    EMPTY_PARTY_ENTITLEMENTS

  );

  const [premiumStatusLoading, setPremiumStatusLoading] = useState(!IS_WEB);
  // Web: erst einen signierten und serverseitig geprüften Kauf akzeptieren.
  const [webPartyPassChecking, setWebPartyPassChecking] = useState(IS_WEB);
  const [webPartyPassVerificationError, setWebPartyPassVerificationError] =
    useState(false);



  // On web, permanent premium flags MUST NOT be initialised from localStorage.
  // localStorage persists stale state after a recovery redemption revokes this
  // browser. The authoritative source on web is /api/purchase-authorization.
  const [

    isHotPremium,

    setHot,

  ] = useState(() =>

    IS_WEB ? false : readStored("premium_hot")

  );



  const [

    isCustomPremium,

    setCustom,

  ] = useState(() =>

    IS_WEB ? false : readStored("premium_custom")

  );



  const [

    isHardcorePremium,

    setHard,

  ] = useState(() =>

    IS_WEB ? false : readStored("premium_hardcore")

  );

  // Web: tracks whether the server-side authorisation check is still in flight.
  const [webPermanentChecking, setWebPermanentChecking] = useState(IS_WEB);



  /*
   * Der Party-Pass-Ablauf wird aus einem von RevenueCat
   * bestätigten Kaufdatum abgeleitet oder kann weiterhin
   * mit einem bereits verifizierten Ablaufzeitpunkt gesetzt werden.
   *
   * localStorage dient nur als lokaler Cache.
   */

  const [

    partyPassExpiry,

    setPartyPassExpiry,

  ] = useState(() =>
    IS_WEB ? null : readStoredNumber("party_pass_expiry")
  );



  /*

   * Wird verwendet, damit hasPartyPass

   * automatisch auf false springt,

   * sobald die Zeit abgelaufen ist.

   */

  const [now, setNow] =

    useState(() => Date.now());



  // On web, never write permanent premium flags to localStorage.
  // localStorage writes would re-activate a revoked browser on the next load.
  const setIsHotPremium = IS_WEB
    ? (val) => setHot(Boolean(val))
    : makeSetter("premium_hot", setHot);

  const setIsCustomPremium = IS_WEB
    ? (val) => setCustom(Boolean(val))
    : makeSetter("premium_custom", setCustom);

  const setIsHardcorePremium = IS_WEB
    ? (val) => setHard(Boolean(val))
    : makeSetter("premium_hardcore", setHard);



  /*

   * Übernimmt RevenueCat CustomerInfo

   * als Quelle für die permanenten Käufe.

   */

  const applyCustomerInfo =

    useCallback(

      (customerInfo) => {

        const active =

          customerInfo

            ?.entitlements

            ?.active || {};



        const purchasedProductIds = new Set(

          Array.isArray(

            customerInfo?.allPurchasedProductIdentifiers

          )

            ? customerInfo.allPurchasedProductIdentifiers

            : []

        );



        // RevenueCat entitlements remain the primary source of truth.

        // For the four permanent Android local-mode purchases we also accept

        // the non-consumable product receipt as a safety net. This prevents a

        // completed Google Play purchase from staying locked if RevenueCat has

        // already registered the product but its entitlement mapping is delayed

        // or was configured incorrectly.

        const localBundlePurchased =

          purchasedProductIds.has(

            "trinkluma_local_bundle"

          ) ||

          purchasedProductIds.has(

            "de.trinkluma.bundle"

          );



        const ownsPartyProduct =

          (productId) =>

            localBundlePurchased ||

            purchasedProductIds.has(

              productId

            );



        setPartyEntitlements({
  wer_wuerde:
    Boolean(active.wer_wuerde) ||
    ownsPartyProduct("trinkluma_wer_wuerde"),

  wkw:
    Boolean(active.wkw) ||
    ownsPartyProduct("trinkluma_wkw"),

  bluff:
    Boolean(active.bluff) ||
    ownsPartyProduct("trinkluma_bluff"),

  pantomime:
    Boolean(active.pantomime) ||
    ownsPartyProduct("trinkluma_pantomime"),

  never:
    Boolean(active.never) ||
    ownsPartyProduct("trinkluma_never"),
});




        const revenueCatPartyPassExpiry =
          getPartyPassExpiryFromCustomerInfo(
            customerInfo
          );

        if (
          !IS_WEB &&
          revenueCatPartyPassExpiry &&
          revenueCatPartyPassExpiry >
            Date.now()
        ) {
          setPartyPassExpiry(
            revenueCatPartyPassExpiry
          );

          setNow(Date.now());

          try {
            localStorage.setItem(
              "party_pass_expiry",
              String(
                revenueCatPartyPassExpiry
              )
            );
          } catch {
            // localStorage nicht verfügbar
          }
        }

const hot =
  Boolean(active.hot) ||
  localBundlePurchased;

const hardcore =
  Boolean(active.hardcore) ||
  localBundlePurchased;

const custom =
  Boolean(active.mein_deck) ||
  localBundlePurchased;
  
        setHot(hot);

        setHard(hardcore);

        setCustom(custom);



        try {

          localStorage.setItem(

            "premium_hot",

            String(hot)

          );



          localStorage.setItem(

            "premium_hardcore",

            String(hardcore)

          );



          localStorage.setItem(

            "premium_custom",

            String(custom)

          );

        } catch {

          // localStorage nicht verfügbar

        }

      },

      []

    );



  /*

   * Holt den aktuellen Kaufstatus

   * direkt von RevenueCat.

   */

  const refreshPremiumStatus =

    useCallback(

      async (

        providedCustomerInfo = null,

        forceFresh = false

      ) => {

        // On web, permanent premium status is managed by the server-side
        // purchase-authorization endpoint (via the web permanent check effect below).
        // Calling RevenueCat ClientInfo here would re-activate a revoked browser.
        if (IS_WEB) {
          return null;
        }

        setPremiumStatusLoading(true);



        try {

          let customerInfo =

            unwrapCustomerInfo(

              providedCustomerInfo

            );



          // A successful purchase normally already contains current CustomerInfo.

          // Apply it immediately so the UI can unlock without waiting for another request.

          if (

            customerInfo

          ) {

            applyCustomerInfo(

              customerInfo

            );

          }



          if (

            forceFresh ||

            !customerInfo

          ) {

            if (

              forceFresh &&

              typeof Purchases.invalidateCustomerInfoCache ===

                "function"

            ) {

              await Purchases

                .invalidateCustomerInfoCache();

            }



            const result =

              await Purchases

                .getCustomerInfo();



            customerInfo =

              unwrapCustomerInfo(

                result

              );

          }



          if (

            !customerInfo

          ) {

            throw new Error(

              "RevenueCat CustomerInfo fehlt"

            );

          }



          applyCustomerInfo(

            customerInfo

          );



          return customerInfo;

        } catch (error) {

          console.error(

            "RevenueCat customer info error:",

            error

          );



          return null;

        } finally {

          setPremiumStatusLoading(false);

        }

      },

      [applyCustomerInfo]

    );



  /*

   * RevenueCat beim App-Start abfragen.

   */

  useEffect(() => {

    refreshPremiumStatus();

  }, [refreshPremiumStatus]);



  /*

   * Käufe können ihren Status nach dem Schließen des Store-Dialogs

   * noch aktualisieren. Der RevenueCat-Listener übernimmt solche

   * CustomerInfo-Updates sofort in den React-State.

   */

  useEffect(() => {

    let listenerId = null;

    let cancelled = false;



    const registerListener =

      async () => {

        try {

          listenerId =

            await Purchases

              .addCustomerInfoUpdateListener(

                (customerInfo) => {

                  if (cancelled) {

                    return;

                  }



                  const normalized =

                    unwrapCustomerInfo(

                      customerInfo

                    );



                  if (

                    normalized

                  ) {

                    applyCustomerInfo(

                      normalized

                    );

                  }

                }

              );

        } catch (error) {

          console.error(

            "RevenueCat listener error:",

            error

          );

        }

      };



    registerListener();



    return () => {

      cancelled = true;



      if (

        listenerId &&

        typeof Purchases.removeCustomerInfoUpdateListener ===

          "function"

      ) {

        Purchases

          .removeCustomerInfoUpdateListener({

            listenerToRemove:

              listenerId,

          })

          .catch(() => {});

      }

    };

  }, [applyCustomerInfo]);



  /*

   * Timer für den 24h-Pass.

   * Ein Check pro Minute reicht aus.

   */

  useEffect(() => {

    const interval =

      setInterval(() => {

        setNow(Date.now());

      }, 60 * 1000);



    return () =>

      clearInterval(interval);

  }, []);



  /*

   * Abgelaufenen lokalen Cache entfernen.

   */

  useEffect(() => {

    if (

      partyPassExpiry &&

      partyPassExpiry <= now

    ) {

      setPartyPassExpiry(null);



      try {

        localStorage.removeItem(

          "party_pass_expiry"

        );

      } catch {

        // localStorage nicht verfügbar

      }

    }

  }, [partyPassExpiry, now]);



  /*
   * Setzt nur einen bereits bestätigten Ablaufzeitpunkt.
   * Die Funktion erzeugt niemals selbst "jetzt + 24 Stunden".
   * So kann derselbe Cache sowohl mit RevenueCat-Kaufdaten
   * als auch mit einem späteren Backend-Ablaufzeitpunkt arbeiten.
   */

  const activatePartyPass =

    useCallback((expiry) => {
      // Auf der Web-Version darf nur die Serverprüfung den Pass aktivieren.
      if (IS_WEB) return false;

      if (!expiry) {

        console.error(

          "Party Pass expiry fehlt."

        );



        return false;

      }



      let expiryTimestamp;



      if (

        typeof expiry ===

        "number"

      ) {

        expiryTimestamp = expiry;

      } else {

        expiryTimestamp =

          new Date(expiry).getTime();

      }



      if (

        !Number.isFinite(

          expiryTimestamp

        )

      ) {

        console.error(

          "Ungültiger Party Pass expiry:",

          expiry

        );



        return false;

      }



      if (

        expiryTimestamp <=

        Date.now()

      ) {

        console.error(

          "Party Pass expiry liegt bereits in der Vergangenheit."

        );



        return false;

      }



      setPartyPassExpiry(

        expiryTimestamp

      );



      setNow(Date.now());



      try {

        localStorage.setItem(

          "party_pass_expiry",

          String(expiryTimestamp)

        );

      } catch {

        // localStorage nicht verfügbar

      }



      return true;

    }, []);



  const clearPartyPass =

    useCallback(() => {

      setPartyPassExpiry(null);

      setNow(Date.now());



      try {

        localStorage.removeItem(

          "party_pass_expiry"

        );

      } catch {

        // localStorage nicht verfügbar

      }

    }, []);



  // Der RevenueCat-Web-Kauf hat eine andere Kundenkennung als die
  // vorhandenen Einzelkäufe. Deshalb nur den signierten Vercel-Endpunkt
  // für die 24h-Freischaltung auf der Web-Version verwenden.
  useEffect(() => {
    if (!IS_WEB) return undefined;

    let cancelled = false;
    let checkInFlight = null;

    async function verifyWebPass() {
      // Mehrere Focus-/Pageshow-Events sollen keine parallelen Checks starten.
      if (checkInFlight) return checkInFlight;

      setWebPartyPassChecking(true);
      const task = (async () => {
        try {
          const { checkLumagaPartyPass } = await import("@/lib/revenueCatWeb");
          const result = await checkLumagaPartyPass();
          if (cancelled) return;

          const expiry = result.active && result.expiresAt
            ? Date.parse(result.expiresAt)
            : NaN;
          const verifiedExpiry = Number.isFinite(expiry) && expiry > Date.now()
            ? expiry
            : null;

          setPartyPassExpiry(verifiedExpiry);
          setNow(Date.now());
          setWebPartyPassVerificationError(false);

          // Alte Web-Caches dürfen keinen Kauf nachweisen.
          try {
            localStorage.removeItem("party_pass_expiry");
          } catch {
            // Browser kann lokale Speicherung verweigern.
          }
        } catch (error) {
          if (cancelled) return;
          console.error("Web-Party-Pass-Prüfung fehlgeschlagen:", error);
          // Bei Prüfungsfehler nicht aus einem alten Cache freischalten.
          setPartyPassExpiry(null);
          setWebPartyPassVerificationError(true);
          setNow(Date.now());
        } finally {
          if (!cancelled) setWebPartyPassChecking(false);
        }
      })();

      checkInFlight = task;
      try {
        await task;
      } finally {
        if (checkInFlight === task) checkInFlight = null;
      }
    }

    function checkWhenVisible() {
      if (document.visibilityState !== "visible") return;
      setNow(Date.now());
      void verifyWebPass();
    }

    void verifyWebPass();
    // Nach Rückkehr vom externen Checkout oder einem anderen Tab.
    window.addEventListener("pageshow", checkWhenVisible);
    window.addEventListener("focus", checkWhenVisible);
    document.addEventListener("visibilitychange", checkWhenVisible);

    return () => {
      cancelled = true;
      window.removeEventListener("pageshow", checkWhenVisible);
      window.removeEventListener("focus", checkWhenVisible);
      document.removeEventListener("visibilitychange", checkWhenVisible);
    };
  }, []);

  // Ref so the function can be called from outside the effect (e.g. after a purchase).
  const verifyWebPermanentRef = useRef(null);

  // Web: server-side check for permanent premium modes.
  // Uses the signed session cookie to ask /api/purchase-authorization which
  // products this browser is authorised for. Re-checks on visibility change so
  // a revoked browser is locked out as soon as it regains focus.
  useEffect(() => {
    if (!IS_WEB) return undefined;

    let cancelled = false;
    let checkInFlight = null;

    async function verifyWebPermanent() {
      if (checkInFlight) return checkInFlight;

      setWebPermanentChecking(true);

      const task = (async () => {
        try {
          const auth = await getWebPurchaseAuthorization();
          if (cancelled) return;

          if (!auth.authorized) {
            // Revoked browser — clear everything and block access.
            setHot(false);
            setHard(false);
            setCustom(false);
            setPartyEntitlements({ ...EMPTY_PARTY_ENTITLEMENTS });
            return;
          }

          if (auth.recoveryManaged) {
            // Server is authoritative for recovery-managed browsers.
            const modes = getVerifiedPremiumModes(auth.products);
            setHot(modes.hot);
            setHard(modes.hardcore);
            setCustom(modes.mein_deck);
            setPartyEntitlements({
              wer_wuerde: modes.wer_wuerde,
              wkw: modes.wkw,
              bluff: modes.bluff,
              pantomime: modes.pantomime,
              never: modes.never,
            });
          } else {
            // Legacy path: browser not managed by recovery system.
            // Uses RevenueCat client-side so purchases made under the old
            // localStorage UUID (≠ session cookie) are still found.
            try {
              const result = await Purchases.getCustomerInfo();
              if (cancelled) return;
              const ci = unwrapCustomerInfo(result);
              if (ci) applyCustomerInfo(ci);
            } catch {
              // RC unavailable — fail safe, keep all flags false.
            }
          }
        } catch (error) {
          if (cancelled) return;
          console.error("Web-Kaufberechtigung fehlgeschlagen:", error);
          // Fail safe: keep all flags false. Never grant access on error.
        } finally {
          if (!cancelled) setWebPermanentChecking(false);
        }
      })();

      checkInFlight = task;
      try {
        await task;
      } finally {
        if (checkInFlight === task) checkInFlight = null;
      }
    }

    verifyWebPermanentRef.current = verifyWebPermanent;

    void verifyWebPermanent();

    function checkWhenVisible() {
      if (document.visibilityState !== "visible") return;
      void verifyWebPermanent();
    }

    // Pages that call purchaseProduct / restorePurchases dispatch this event
    // so the server-side check re-runs immediately after a purchase instead of
    // waiting for a focus/visibility change.  This prevents revoked browsers
    // from re-enabling premium flags by calling those APIs client-side.
    function handleRevalidate() {
      void verifyWebPermanent();
    }

    window.addEventListener("pageshow", checkWhenVisible);
    document.addEventListener("visibilitychange", checkWhenVisible);
    window.addEventListener("lumaga:revalidate-purchases", handleRevalidate);

    return () => {
      cancelled = true;
      verifyWebPermanentRef.current = null;
      window.removeEventListener("pageshow", checkWhenVisible);
      document.removeEventListener("visibilitychange", checkWhenVisible);
      window.removeEventListener("lumaga:revalidate-purchases", handleRevalidate);
    };
  }, []);

  // Minutentimer für die Anzeige; zusätzlicher Timeout für den exakten
  // Ablaufzeitpunkt (ohne bis zum nächsten Minutentick zu warten).
  useEffect(() => {
    if (!partyPassExpiry) return undefined;
    const timeUntilExpiry = Math.max(0, partyPassExpiry - Date.now());
    const timeout = setTimeout(() => setNow(Date.now()), timeUntilExpiry);
    return () => clearTimeout(timeout);
  }, [partyPassExpiry]);

  const hasPartyPass =

    partyPassExpiry !== null &&

    partyPassExpiry > now;

  const partyPassRemainingMs =
    hasPartyPass
      ? Math.max(
          0,
          partyPassExpiry - now
        )
      : 0;

  return (

    <PremiumContext.Provider

      value={{

        partyEntitlements,

        premiumStatusLoading: premiumStatusLoading || webPartyPassChecking || webPermanentChecking,
        webPartyPassVerificationError,

        isHotPremium,

        setIsHotPremium,



        isCustomPremium,

        setIsCustomPremium,



        isHardcorePremium,

        setIsHardcorePremium,



        partyPassExpiry,

        partyPassRemainingMs,

        hasPartyPass,



        activatePartyPass,

        clearPartyPass,



        refreshPremiumStatus,

        revalidateWebPurchase: IS_WEB
          ? () => verifyWebPermanentRef.current?.() ?? Promise.resolve()
          : () => Promise.resolve(),

      }}

    >

      {children}

    </PremiumContext.Provider>

  );

}



export function usePremium() {

  return useContext(

    PremiumContext

  );

}