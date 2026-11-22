import React, { useEffect, useState } from "react";
import { Download, Share, PlusSquare, MoreVertical, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { promptInstall, subscribeInstall } from "@/lib/installPrompt";
import { subscribeDisclaimer } from "@/lib/disclaimerState";

const IOS_HINT_DISMISSED_KEY = "lumaga_ios_install_hint_dismissed_v1";
const IOS_HINT_SESSION_KEY = "lumaga_ios_install_hint_shown_v1";

function readStorage(storage, key) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(storage, key, value) {
  try {
    storage.setItem(key, value);
  } catch {
    // Speicher nicht verfügbar (z. B. privater Modus) – dann eben nicht merken.
  }
}

function useInstallState() {
  const [state, setState] = useState(null);
  useEffect(() => subscribeInstall(setState), []);
  return state;
}

function Step({ icon: Icon, children }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span className="pt-1 leading-snug">{children}</span>
    </li>
  );
}

function InstructionsDialog({ open, onOpenChange, platform, inAppBrowser, lang, footer }) {
  const de = lang !== "en";
  const isIOS = platform === "ios";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-3xl">
        <DialogHeader className="text-left">
          <DialogTitle className="font-heading text-xl">
            {de ? "Lumaga als App installieren" : "Install Lumaga as an app"}
          </DialogTitle>
          <DialogDescription className="font-body">
            {de
              ? "Kostenlos, ohne App Store – mit eigenem Icon auf deinem Startbildschirm und im Vollbild."
              : "Free, no app store – with its own home screen icon and full screen."}
          </DialogDescription>
        </DialogHeader>

        {inAppBrowser && (
          <p className="rounded-2xl bg-amber-500/15 p-3 text-sm font-body text-amber-300">
            {de
              ? `Du hast Lumaga in einer anderen App geöffnet (z. B. Instagram). Öffne die Seite zuerst über das Menü in ${isIOS ? "Safari" : "deinem Browser"}.`
              : `You opened Lumaga inside another app (e.g. Instagram). First open the page in ${isIOS ? "Safari" : "your browser"} via the menu.`}
          </p>
        )}

        {isIOS ? (
          <ol className="space-y-3 text-sm font-body">
            <Step icon={Share}>
              {de ? (
                <>Tippe in Safari auf <b>Teilen</b> (Quadrat mit Pfeil nach oben). Bei neueren iPhones findest du es hinter <b>„···“</b> unten rechts.</>
              ) : (
                <>In Safari tap <b>Share</b> (square with an arrow). On newer iPhones it is behind <b>"···"</b> at the bottom right.</>
              )}
            </Step>
            <Step icon={PlusSquare}>
              {de ? (
                <>Wähle <b>„Zum Home-Bildschirm“</b> – eventuell etwas nach unten scrollen.</>
              ) : (
                <>Choose <b>"Add to Home Screen"</b> – you may need to scroll down.</>
              )}
            </Step>
            <Step icon={Smartphone}>
              {de ? (
                <>Tippe oben rechts auf <b>„Hinzufügen“</b>. Fertig – Lumaga startet jetzt über das Icon.</>
              ) : (
                <>Tap <b>"Add"</b> at the top right. Done – start Lumaga from the icon.</>
              )}
            </Step>
          </ol>
        ) : (
          <ol className="space-y-3 text-sm font-body">
            <Step icon={MoreVertical}>
              {de ? (
                <>Öffne das <b>Browser-Menü</b> (meist <b>⋮</b> oben rechts oder ☰ unten).</>
              ) : (
                <>Open the <b>browser menu</b> (usually <b>⋮</b> top right or ☰ at the bottom).</>
              )}
            </Step>
            <Step icon={Download}>
              {de ? (
                <>Wähle <b>„App installieren“</b> oder <b>„Zum Startbildschirm hinzufügen“</b>.</>
              ) : (
                <>Choose <b>"Install app"</b> or <b>"Add to Home screen"</b>.</>
              )}
            </Step>
            <Step icon={Smartphone}>
              {de ? "Bestätigen – fertig." : "Confirm – done."}
            </Step>
          </ol>
        )}

        {isIOS && (
          <p className="text-xs font-body text-muted-foreground">
            {de
              ? "Hinweis: Die installierte App hat einen eigenen Speicher. Bereits gekaufte Inhalte übernimmst du dort einmalig mit deinem Wiederherstellungscode."
              : "Note: the installed app has its own storage. Transfer purchases once with your recovery code."}
          </p>
        )}

        {footer}
      </DialogContent>
    </Dialog>
  );
}

// Knopf "App installieren" – öffnet direkt den System-Dialog (Android/Chrome)
// oder eine Anleitung (iPhone und andere Browser). In der installierten App unsichtbar.
export function InstallAppButton({ lang, className = "" }) {
  const state = useInstallState();
  const [showHelp, setShowHelp] = useState(false);

  if (!state || state.standalone) return null;

  const handleClick = async () => {
    if (state.canPrompt) {
      const result = await promptInstall();
      if (result !== "unavailable") return;
    }
    setShowHelp(true);
  };

  return (
    <>
      <Button
        size="lg"
        variant="outline"
        onClick={handleClick}
        className={`w-full h-14 text-lg font-heading font-bold border-2 border-accent/40 hover:bg-accent/10 rounded-2xl ${className}`}
      >
        <Download className="w-5 h-5 mr-2" />
        {lang === "en" ? "Install app" : "App installieren"}
      </Button>
      <InstructionsDialog
        open={showHelp}
        onOpenChange={setShowHelp}
        platform={state.platform}
        inAppBrowser={state.inAppBrowser}
        lang={lang}
      />
    </>
  );
}

// Infofenster, das auf iPhone/iPad automatisch auf die Installation hinweist –
// einmal pro Besuch, nach dem Altershinweis, bis "Nicht mehr anzeigen" gewählt wurde.
export function IosInstallHint({ lang }) {
  const state = useInstallState();
  const [disclaimerOpen, setDisclaimerOpen] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => subscribeDisclaimer(setDisclaimerOpen), []);

  const eligible =
    state &&
    state.platform === "ios" &&
    !state.standalone &&
    !disclaimerOpen &&
    readStorage(localStorage, IOS_HINT_DISMISSED_KEY) !== "1" &&
    readStorage(sessionStorage, IOS_HINT_SESSION_KEY) !== "1";

  useEffect(() => {
    if (!eligible) return undefined;
    const timer = setTimeout(() => {
      writeStorage(sessionStorage, IOS_HINT_SESSION_KEY, "1");
      setOpen(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [eligible]);

  if (!state) return null;

  const de = lang !== "en";

  return (
    <InstructionsDialog
      open={open}
      onOpenChange={setOpen}
      platform={state.platform}
      inAppBrowser={state.inAppBrowser}
      lang={lang}
      footer={
        <div className="flex flex-col gap-2 pt-1">
          <Button
            onClick={() => setOpen(false)}
            className="h-12 rounded-2xl font-heading font-bold bg-gradient-to-r from-primary to-accent"
          >
            {de ? "Alles klar" : "Got it"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              writeStorage(localStorage, IOS_HINT_DISMISSED_KEY, "1");
              setOpen(false);
            }}
            className="h-10 rounded-2xl text-sm text-muted-foreground"
          >
            {de ? "Nicht mehr anzeigen" : "Don't show again"}
          </Button>
        </div>
      }
    />
  );
}
