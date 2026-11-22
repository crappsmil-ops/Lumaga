const PRODUCT_TO_MODE = Object.freeze({
  lumaga_wild: "hot",
  lumaga_chaos: "hardcore",
  lumaga_mein_deck: "mein_deck",
  lumaga_wer_wuerde: "wer_wuerde",
  lumaga_wer_kennt_wen: "wkw",
  lumaga_bluff: "bluff",
  lumaga_pantomime: "pantomime",
  lumaga_never: "never",
});

export function getVerifiedPremiumModes(products) {
  const modes = {
    hot: false,
    hardcore: false,
    mein_deck: false,
    wer_wuerde: false,
    wkw: false,
    bluff: false,
    pantomime: false,
    never: false,
  };

  if (!Array.isArray(products)) return modes;

  // Bundle: Test-Konfiguration "lumaga_bundle_1099", Live "lumaga_bundle".
  if (
    products.includes("lumaga_bundle_1099") ||
    products.includes("lumaga_bundle")
  ) {
    return Object.fromEntries(
      Object.keys(modes).map((mode) => [mode, true])
    );
  }

  for (const productId of products) {
    const mode = PRODUCT_TO_MODE[productId];
    if (mode) modes[mode] = true;
  }

  return modes;
}
