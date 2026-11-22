// Installation der Web-App auf dem Startbildschirm.
// Chrome/Edge/Samsung (Android, Desktop) liefern ein "beforeinstallprompt"-
// Ereignis, mit dem wir den System-Installationsdialog per Knopf öffnen.
// iPhone/iPad bieten das nicht an – dort zeigen wir eine Anleitung.

let deferredPrompt = null;
let installed = false;
const listeners = new Set();

function notify() {
  listeners.forEach((fn) => fn(getInstallState()));
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    notify();
  });

  window.addEventListener("appinstalled", () => {
    installed = true;
    deferredPrompt = null;
    notify();
  });
}

export function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.matchMedia?.("(display-mode: fullscreen)").matches ||
    window.navigator.standalone === true
  );
}

export function getPlatform() {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (isIOS) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

// Eingebettete Browser (Instagram, Facebook, TikTok …) können nicht installieren.
export function isInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  return /FBAN|FBAV|Instagram|Line\/|TikTok|musical_ly|Snapchat/i.test(
    navigator.userAgent || ""
  );
}

export function getInstallState() {
  return {
    standalone: isStandalone() || installed,
    canPrompt: Boolean(deferredPrompt),
    platform: getPlatform(),
    inAppBrowser: isInAppBrowser(),
  };
}

export function subscribeInstall(fn) {
  listeners.add(fn);
  fn(getInstallState());
  return () => listeners.delete(fn);
}

// Öffnet den System-Dialog. Ergebnis: "accepted", "dismissed" oder "unavailable".
export async function promptInstall() {
  if (!deferredPrompt) return "unavailable";
  const promptEvent = deferredPrompt;
  deferredPrompt = null;
  notify();
  try {
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    return choice?.outcome === "accepted" ? "accepted" : "dismissed";
  } catch {
    return "unavailable";
  }
}
