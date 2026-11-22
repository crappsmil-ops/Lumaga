import { Capacitor } from "@capacitor/core";

import {
  Purchases,
  PRODUCT_CATEGORY,
} from "@revenuecat/purchases-capacitor";
import { getRevenueCatWeb } from "@/lib/revenueCatWeb";
import { getLumagaCustomerId } from "@/lib/revenueCatIdentity";
import { requestPurchaseConsent, recordPurchaseConsent } from "@/lib/purchaseConsent";


const WEB_PARTY_PASS_ID = "lumaga_party_pass_24h";

// Gleichwertige Produkt-IDs: Das Bundle heißt in der Test-Konfiguration
// "lumaga_bundle_1099", in der Live-Konfiguration "lumaga_bundle".
const EQUIVALENT_PRODUCT_IDS = [
  ["lumaga_bundle_1099", "lumaga_bundle"],
];

function isSameProduct(expectedId, actualId) {
  if (expectedId === actualId) return true;

  return EQUIVALENT_PRODUCT_IDS.some(
    (group) => group.includes(expectedId) && group.includes(actualId)
  );
}

async function getWebPackage(packageId, expectedProductId = null) {
  const offerings = await getRevenueCatWeb().getOfferings({
    currency: "EUR",
  });

  const offering =
    offerings.current || offerings.all?.default;

  if (!offering) {
    throw new Error(
      "Das RevenueCat-Offering 'default' fehlt."
    );
  }

  const selected = offering.availablePackages.find(
    (pkg) => pkg.identifier === packageId
  );

  if (!selected) {
    throw new Error(
      `RevenueCat-Paket '${packageId}' nicht gefunden.`
    );
  }

  const actualProductId =
    selected.product?.identifier ||
    selected.webBillingProduct?.identifier ||
    "";

  if (
    expectedProductId &&
    !isSameProduct(expectedProductId, actualProductId)
  ) {
    throw new Error(
      `Produkt stimmt nicht überein: erwartet ` +
      `'${expectedProductId}', gefunden '${actualProductId}'.`
    );
  }

  return selected;
}

async function getWebCustomerInfo() {
  return getRevenueCatWeb().getCustomerInfo();
}

const platform = Capacitor.getPlatform();

function unwrapCustomerInfo(result) {
  if (!result) {
    return null;
  }

  return (
    result?.customerInfo ||
    (result?.entitlements ? result : null)
  );
}

const ONE_TIME_PRODUCT_IDS = new Set([
  platform === "ios"
    ? "de.trinkluma.multiplayer24h"
    : "trinkluma_host_24h",

  "trinkluma_getraenk_spendieren",
  "trinkluma_hardcore_ueberspringen",
]);


export function isIAPAvailable() {
  if (Capacitor.getPlatform() === "web") {
    return Boolean(
      import.meta.env.VITE_REVENUECAT_WEB_API_KEY
    );
  }

  return false;
}


export async function getPurchasesAppUserID() {
  if (!isIAPAvailable()) {
    return {
      ok: false,
      reason: "unavailable",
      appUserID: null,
    };
  }

  try {
    const appUserID = getLumagaCustomerId();

    return {
      ok: true,
      reason: null,
      appUserID,
    };
  } catch (error) {
    console.error(
      "RevenueCat Web Customer ID Fehler:",
      error
    );

    return {
      ok: false,
      reason: "failed",
      appUserID: null,
      message: error?.message || String(error),
    };
  }
}

function isOneTimeProduct(productId) {
  const normalized = String(
    productId || ""
  ).trim();

  return ONE_TIME_PRODUCT_IDS.has(
    normalized
  );
}

async function getPackageById(
  packageId,
  expectedStoreProductId = null
) {
  const offerings =
    await Purchases.getOfferings();

  const offering =
    offerings.current ||
    offerings.all?.default;

  if (!offering) {
    throw new Error(
      "RevenueCat Offering 'default' wurde nicht gefunden."
    );
  }

  const targetId = String(
    packageId || ""
  ).trim();

  const packageToBuy =
    offering.availablePackages.find(
      (pkg) => {
        const revenueCatPackageId =
          String(
            pkg?.identifier || ""
          ).trim();

        const storeProductId =
          String(
            pkg?.product?.identifier ||
              pkg?.product?.productIdentifier ||
              pkg?.product?.productId ||
              ""
          ).trim();

        return (
          revenueCatPackageId === targetId ||
          storeProductId === targetId
        );
      }
    );

  if (!packageToBuy) {
    throw new Error(
      `RevenueCat Package oder Store-Produkt '${packageId}' wurde nicht gefunden.`
    );
  }

  if (expectedStoreProductId) {
    const actualStoreProductId = String(
      packageToBuy?.product?.identifier ||
        packageToBuy?.product?.productIdentifier ||
        packageToBuy?.product?.productId ||
        ""
    ).trim();

    if (
      actualStoreProductId !==
      expectedStoreProductId
    ) {
      console.error(
        "RevenueCat package/product mismatch",
        {
          packageId,
          expectedStoreProductId,
          actualStoreProductId,
        }
      );

      throw new Error(
        "Dieser Spielmodus ist im Shop noch nicht korrekt eingerichtet. " +
          "Bitte den Support kontaktieren; es wurde kein Kauf gestartet."
      );
    }
  }

  return packageToBuy;
}

async function getOneTimeStoreProduct(
  productId
) {
  const targetId = String(
    productId || ""
  ).trim();

  if (!targetId) {
    throw new Error(
      "Produkt-ID fehlt."
    );
  }

  const result =
    await Purchases.getProducts({
      productIdentifiers: [
        targetId,
      ],
      type:
        PRODUCT_CATEGORY.NON_SUBSCRIPTION,
    });

  const products =
    Array.isArray(
      result?.products
    )
      ? result.products
      : [];

  const product =
    products.find(
      (item) => {
        const identifier =
          String(
            item?.identifier ||
              item?.productIdentifier ||
              item?.productId ||
              ""
          ).trim();

        return (
          identifier === targetId
        );
      }
    ) ||
    products[0] ||
    null;

  if (!product) {
    throw new Error(
      `Store-Produkt '${productId}' wurde nicht gefunden.`
    );
  }

  return product;
}

export async function getPackagePrice(
  productOrPackageId,
  expectedStoreProductId = null
) {
  if (Capacitor.getPlatform() === "web") {
    try {
      const pkg = await getWebPackage(
        productOrPackageId,
        expectedStoreProductId
      );

      const product =
        pkg.webBillingProduct || pkg.product;

      const currentPrice = product?.currentPrice;

      const priceString =
        currentPrice?.formattedPrice ||
        product?.priceString ||
        null;

      return {
        ok: Boolean(priceString),
        reason: priceString ? null : "price_unavailable",
        priceString,
        price: currentPrice?.amount ?? product?.price ?? null,
        currencyCode:
          currentPrice?.currency ||
          currentPrice?.currencyCode ||
          product?.currencyCode ||
          null,
      };
    } catch (error) {
      return {
        ok: false,
        reason: "failed",
        priceString: null,
        price: null,
        currencyCode: null,
        message: error.message,
      };
    }
  }

  if (!isIAPAvailable()) {
    return {
      ok: false,
      reason: "unavailable",
      priceString: null,
      price: null,
      currencyCode: null,
    };
  }

  try {
    let product = null;

    if (
      isOneTimeProduct(
        productOrPackageId
      )
    ) {
      product =
        await getOneTimeStoreProduct(
          productOrPackageId
        );
    } else {
      const storePackage =
        await getPackageById(
          productOrPackageId,
          expectedStoreProductId
        );

      product =
        storePackage?.product ||
        null;
    }

    const priceString =
      product?.priceString ??
      null;

    const price =
      product?.price ??
      null;

    const currencyCode =
      product?.currencyCode ??
      null;

    if (!priceString) {
      return {
        ok: false,
        reason: "price_unavailable",
        priceString: null,
        price,
        currencyCode,
      };
    }

    return {
      ok: true,
      reason: null,
      priceString,
      price,
      currencyCode,
    };
  } catch (err) {
    console.error(
      "RevenueCat price loading error:",
      err
    );

    return {
      ok: false,
      reason: "failed",
      priceString: null,
      price: null,
      currencyCode: null,
      message:
        err?.message ||
        String(err),
    };
  }
}

async function purchaseOneTimeProduct(
  productId,
  identity
) {
  const product =
    await getOneTimeStoreProduct(
      productId
    );

  const result =
    await Purchases.purchaseStoreProduct({
      product,
    });

  const identityAfterPurchase =
    await getPurchasesAppUserID();

  const appUserID =
    identityAfterPurchase?.appUserID ||
    identity?.appUserID ||
    null;

  const productIdentifier =
    result?.productIdentifier ||
    product?.identifier ||
    product?.productIdentifier ||
    product?.productId ||
    productId;

  return {
    ok: true,
    purchased: true,
    reason: null,
    appUserID,
    customerInfo:
      result?.customerInfo ??
      null,
    transaction:
      result?.transaction ??
      null,
    productIdentifier,
  };
}

export async function purchaseProduct(
  productOrPackageId,
  expectedStoreProductId = null,
  { consented = false } = {}
) {
  // Widerrufs-Zustimmung (§ 356 Abs. 5 BGB) vor jedem Kauf, außer der freiwilligen Eis-Spende.
  const isTipPurchase =
    productOrPackageId === "eis_spendieren" ||
    productOrPackageId === "lumaga_eis_spendieren";

  if (!isTipPurchase) {
    if (consented) {
      recordPurchaseConsent(productOrPackageId);
    } else if (!(await requestPurchaseConsent(productOrPackageId))) {
      return {
        ok: false,
        purchased: false,
        reason: "cancelled",
        message: null,
      };
    }
  }

  if (Capacitor.getPlatform() === "web") {
    try {
      if (
        productOrPackageId === "party_pass_24h" ||
        productOrPackageId === WEB_PARTY_PASS_ID ||
        expectedStoreProductId === WEB_PARTY_PASS_ID
      ) {
        return {
          ok: false,
          purchased: false,
          reason: "not_ready",
          message:
            "Der 24h-Party-Pass wird noch eingerichtet.",
        };
      }

      const pkg = await getWebPackage(
        productOrPackageId,
        expectedStoreProductId
      );

      const result = await getRevenueCatWeb().purchase({
        rcPackage: pkg,
      });

      const customerInfo = result?.customerInfo;

      const active =
        customerInfo?.entitlements?.active || {};

      const packageEntitlements = {
        hot: ["hot"],
        hardcore: ["hardcore"],
        wer_wuerde: ["wer_wuerde"],
        wkw: ["wkw"],
        bluff: ["bluff"],
        pantomime: ["pantomime"],
        never: ["never"],
        mein_deck: ["mein_deck"],
        bundle: [
          "hot",
          "hardcore",
          "wer_wuerde",
          "wkw",
          "bluff",
          "pantomime",
          "never",
          "mein_deck",
        ],
      };

      const required =
        packageEntitlements[productOrPackageId] || [];

      // Freiwillige Unterstützung schaltet nichts frei: abgeschlossener Kauf genügt.
      const isTip = productOrPackageId === "eis_spendieren";

      const verified =
        isTip ||
        (required.length > 0 &&
          required.every((id) => Boolean(active[id])));

      return {
        ok: verified,
        purchased: verified,
        reason: verified ? null : "not_verified",
        message: verified
          ? null
          : "Die Freischaltung wurde noch nicht bestätigt. Bitte nicht erneut kaufen.",
        customerInfo,
        appUserID: getLumagaCustomerId(),
        productIdentifier:
          pkg.product?.identifier || null,
      };
    } catch (error) {
      return {
        ok: false,
        purchased: false,
        reason:
          error?.userCancelled === true
            ? "cancelled"
            : "failed",
        message: error?.message || String(error),
      };
    }
  }

  if (!isIAPAvailable()) {
    return {
      ok: false,
      purchased: false,
      reason: "unavailable",
      appUserID: null,
      message:
        "In-App-Käufe sind auf dieser Plattform nicht verfügbar.",
    };
  }

  try {
    const identity =
      await getPurchasesAppUserID();

    if (
      !identity?.ok ||
      !identity?.appUserID
    ) {
      return {
        ok: false,
        purchased: false,
        reason: "identity_failed",
        appUserID: null,
        message:
          "Die Kauf-ID konnte nicht geladen werden.",
      };
    }

    if (
      isOneTimeProduct(
        productOrPackageId
      )
    ) {
      return await purchaseOneTimeProduct(
        productOrPackageId,
        identity
      );
    }

    const packageToBuy =
      await getPackageById(
        productOrPackageId,
        expectedStoreProductId
      );

    const result =
      await Purchases.purchasePackage({
        aPackage: packageToBuy,
      });

    const identityAfterPurchase =
      await getPurchasesAppUserID();

    const appUserID =
      identityAfterPurchase?.appUserID ||
      identity.appUserID;

    return {
      ok: true,
      purchased: true,
      reason: null,
      appUserID,
      customerInfo:
        result?.customerInfo ??
        null,
      productIdentifier:
        result?.productIdentifier ??
        packageToBuy?.product
          ?.identifier ??
        null,
    };
  } catch (err) {
    if (
      err?.userCancelled === true
    ) {
      return {
        ok: false,
        purchased: false,
        reason: "cancelled",
        appUserID: null,
        message:
          err?.message ||
          null,
      };
    }

    console.error(
      "RevenueCat purchase error:",
      err
    );

    return {
      ok: false,
      purchased: false,
      reason: "failed",
      appUserID: null,
      message:
        err?.message ||
        String(err),
    };
  }
}


export async function restorePurchases() {
  if (Capacitor.getPlatform() === "web") {

    try {
      const customerInfo =
        await getRevenueCatWeb().getCustomerInfo();

      const active =
        customerInfo?.entitlements?.active || {};

      const entitlementIds = [
        "hot",
        "hardcore",
        "mein_deck",
        "wer_wuerde",
        "wkw",
        "bluff",
        "pantomime",
        "never",
      ];

      const purchased = entitlementIds.some(
        (id) => Boolean(active[id])
      );

      return {
        ok: true,
        purchased,
        reason: purchased ? null : "none",
        appUserID: getLumagaCustomerId(),
        customerInfo,
      };
    } catch (error) {
      return {
        ok: false,
        purchased: false,
        reason: "failed",
        appUserID: null,
        message: error?.message || String(error),
      };
    }
  }

  if (!isIAPAvailable()) {

    return {
      ok: false,
      purchased: false,
      reason: "unavailable",
      appUserID: null,
      message:
        "In-App-Käufe sind auf dieser Plattform nicht verfügbar.",
    };
  }

  try {
    const result =
      await Purchases.restorePurchases();

    const customerInfo =
      unwrapCustomerInfo(result);

    const active =
      customerInfo
        ?.entitlements
        ?.active ||
      {};

const purchasedProductIds = new Set(
  Array.isArray(
    customerInfo?.allPurchasedProductIdentifiers
  )
    ? customerInfo.allPurchasedProductIdentifiers
    : []
);


const purchased =
  Boolean(active.hot) ||
  Boolean(active.hardcore) ||
  Boolean(active.mein_deck) ||
  Boolean(active.wer_wuerde) ||
  Boolean(active.wkw) ||
  Boolean(active.bluff) ||
  Boolean(active.pantomime) ||
  Boolean(active.never) ||
  purchasedProductIds.has("trinkluma_wer_wuerde") ||
  purchasedProductIds.has("trinkluma_local_bundle") ||
  purchasedProductIds.has("de.trinkluma.bundle");

    const identity =
      await getPurchasesAppUserID();

    return {
      ok: true,
      purchased,
      reason:
        purchased
          ? null
          : "none",
      appUserID:
        identity?.appUserID ||
        null,
      customerInfo,
    };
  } catch (err) {
    console.error(
      "RevenueCat restore error:",
      err
    );

    return {
      ok: false,
      purchased: false,
      reason: "failed",
      appUserID: null,
      message:
        err?.message ||
        String(err),
    };
  }
}