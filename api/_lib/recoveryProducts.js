export const RECOVERABLE_PRODUCTS = Object.freeze({
  lumaga_wild: "hot",
  lumaga_chaos: "hardcore",
  lumaga_mein_deck: "mein_deck",
  lumaga_wer_wuerde: "wer_wuerde",
  lumaga_wer_kennt_wen: "wkw",
  lumaga_bluff: "bluff",
  lumaga_pantomime: "pantomime",
  lumaga_never: "never",
  lumaga_bundle_1099: "bundle",
  // Live-Konfiguration verwendet "lumaga_bundle" für dasselbe Produkt.
  lumaga_bundle: "bundle",
});

export function isRecoverableProduct(productId) {
  return Object.hasOwn(RECOVERABLE_PRODUCTS, productId);
}
