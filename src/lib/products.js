
/*
 * Lumaga Web – RevenueCat Billing
 *
 * Alle Produktkennungen müssen mit RevenueCat
 * im Projekt "Lumaga Web" übereinstimmen.
 *
 * Interne Spielmodus-Namen wie "hot" und
 * "hardcore" bleiben unverändert.
 */

export const PARTY_MODE_PURCHASES = {
  wer_wuerde: {
    packageId: "wer_wuerde",
    entitlementId: "wer_wuerde",
    productId: "lumaga_wer_wuerde",
    label: {
      de: "Wer würde…?",
      en: "Who Would…?",
    },
  },

  wer_kennt_wen: {
    packageId: "wkw",
    entitlementId: "wkw",
    productId: "lumaga_wer_kennt_wen",
    label: {
      de: "Wer kennt wen?",
      en: "Who Knows Whom?",
    },
  },

  bluff_wahrheit: {
    packageId: "bluff",
    entitlementId: "bluff",
    productId: "lumaga_bluff",
    label: {
      de: "Bluff & Wahrheit",
      en: "Bluff & Truth",
    },
  },

  pantomime: {
    packageId: "pantomime",
    entitlementId: "pantomime",
    productId: "lumaga_pantomime",
    label: {
      de: "Pantomime",
      en: "Charades",
    },
  },

  ich_habe_noch_nie: {
    packageId: "never",
    entitlementId: "never",
    productId: "lumaga_never",
    label: {
      de: "Ich habe noch nie",
      en: "Never Have I Ever",
    },
  },
};

export const PRODUCTS = {
  HOT_MODE: {
    id: "lumaga_wild",
    packageId: "hot",
    entitlementId: "hot",
    price: "1,99 €",
    priceEn: "1.99 €",
  },

  HARDCORE_MODE: {
    id: "lumaga_chaos",
    packageId: "hardcore",
    entitlementId: "hardcore",
    price: "2,99 €",
    priceEn: "2.99 €",
  },

  CUSTOM_QUESTIONS: {
    id: "lumaga_mein_deck",
    packageId: "mein_deck",
    entitlementId: "mein_deck",
    price: "0,99 €",
    priceEn: "0.99 €",
  },

  WER_WUERDE_MODE: {
    id: PARTY_MODE_PURCHASES.wer_wuerde.productId,
    packageId: "wer_wuerde",
    entitlementId: "wer_wuerde",
  },

  WKW_MODE: {
    id: PARTY_MODE_PURCHASES.wer_kennt_wen.productId,
    packageId: "wkw",
    entitlementId: "wkw",
  },

  BLUFF_MODE: {
    id: PARTY_MODE_PURCHASES.bluff_wahrheit.productId,
    packageId: "bluff",
    entitlementId: "bluff",
  },

  PANTOMIME_MODE: {
    id: PARTY_MODE_PURCHASES.pantomime.productId,
    packageId: "pantomime",
    entitlementId: "pantomime",
  },

  NEVER_MODE: {
    id: PARTY_MODE_PURCHASES.ich_habe_noch_nie.productId,
    packageId: "never",
    entitlementId: "never",
  },

  BUNDLE: {
    id: "lumaga_bundle_1099",
    packageId: "bundle",
    price: "11,99 €",
    priceEn: "11.99 €",
  },

  // Startangebot: Paket "bundle_start" (Produkt lumaga_bundle_start, 8,99 €).
  // Wird bis zum Enddatum verkauft, sofern es im Offering vorhanden ist;
  // danach automatisch wieder das normale Paket "bundle".
  BUNDLE_START: {
    id: "lumaga_bundle_start",
    packageId: "bundle_start",
    endsAt: "2026-12-14T00:00:00+01:00",
  },

  PARTY_PASS: {
    id: "lumaga_party_pass_24h",
    packageId: "party_pass_24h",
    price: "3,99 €",
    priceEn: "3.99 €",
  },

  // Vorhandene Zusatzprodukte bleiben erhalten.
  // Für Lumaga Web sind sie noch nicht eingerichtet.
  // Freiwillige Unterstützung („Eine Kugel Eis spendieren“), Verbrauchsartikel
  // ohne Entitlement. In RevenueCat: Produkt lumaga_eis_spendieren,
  // Paket eis_spendieren im Offering default.
  BEER_TIP: {
    id: "lumaga_eis_spendieren",
    packageId: "eis_spendieren",
    price: "1,49 €",
    priceEn: "1.49 €",
  },

  JOKER_SKIP: {
    id: "trinkluma_hardcore_ueberspringen",
    price: "0,49 €",
    priceEn: "0.49 €",
  },
};
