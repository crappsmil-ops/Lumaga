import React, {

  createContext,

  useContext,

  useState,

  useEffect,

  useCallback,

} from "react";




import { Purchases } from "@/lib/revenueCatAdapter";
import { PRODUCTS } from "@/lib/products";



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

  const [premiumStatusLoading, setPremiumStatusLoading] = useState(true);



  const [

    isHotPremium,

    setHot,

  ] = useState(() =>

    readStored("premium_hot")

  );



  const [

    isCustomPremium,

    setCustom,

  ] = useState(() =>

    readStored("premium_custom")

  );



  const [

    isHardcorePremium,

    setHard,

  ] = useState(() =>

    readStored("premium_hardcore")

  );



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

    readStoredNumber(

      "party_pass_expiry"

    )

  );



  /*

   * Wird verwendet, damit hasPartyPass

   * automatisch auf false springt,

   * sobald die Zeit abgelaufen ist.

   */

  const [now, setNow] =

    useState(() => Date.now());



  const setIsHotPremium =

    makeSetter(

      "premium_hot",

      setHot

    );



  const setIsCustomPremium =

    makeSetter(

      "premium_custom",

      setCustom

    );



  const setIsHardcorePremium =

    makeSetter(

      "premium_hardcore",

      setHard

    );



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

const TEST_PREMIUM = import.meta.env.DEV && true;

  return (

    <PremiumContext.Provider

      value={{

        partyEntitlements,

        premiumStatusLoading,

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