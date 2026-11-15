// Store-Links zum Teilen der App.
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.base6a09a62c9928acb19f05a61b.app";

export const APP_STORE_URL =
  "https://apps.apple.com/app/id6807955249";

// Passenden Store-Link für das Teilen der App ermitteln.
export function detectStoreUrl() {
  if (
    typeof window === "undefined" ||
    !window.navigator
  ) {
    return PLAY_STORE_URL;
  }

  const ua = window.navigator.userAgent || "";

  if (/iPad|iPhone|iPod/.test(ua)) {
    return APP_STORE_URL;
  }

  if (/Android/i.test(ua)) {
    return PLAY_STORE_URL;
  }

  return window.location.origin;
}

// Separate Links für den Bewertungsbutton.
export const PLAY_STORE_REVIEW_URL =
  PLAY_STORE_URL;

export const APP_STORE_REVIEW_URL =
  `${APP_STORE_URL}?action=write-review`;

export function detectReviewUrl() {
  const storeUrl = detectStoreUrl();

  if (storeUrl === APP_STORE_URL) {
    return APP_STORE_REVIEW_URL;
  }

  if (storeUrl === PLAY_STORE_URL) {
    return PLAY_STORE_REVIEW_URL;
  }

  return null;
}