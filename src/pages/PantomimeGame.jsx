import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";
import { useLanguage } from "@/lib/LanguageContext";
import { useGameResults } from "@/lib/GameResultsContext";
import { EyeOff, Timer, Drama, Check, X } from "lucide-react";
import {
  PARTY_ROSTER_KEY,
  PANTOMIME_ROUNDS,
  PANTOMIME_SECONDS,
  PANTOMIME_SESSION_KEY,
  advancePantomime,
  createPantomimeGame,
  currentActor,
  currentPrompt,
  pantomimeResults,
  restorePantomimeGame,
  secondsLeft,
  validPlayers,
} from "@/lib/pantomimeEngine";
import { rememberRestoredPantomimePrompts } from "@/lib/pantomimePromptRotation";

const copy = {
  de: {
    title: "Pantomime", round: "Runde", of: "von", how: "So funktioniert's",
    rules: "Stelle den Begriff ohne Worte und ohne Geräusche dar. Die anderen raten. Für eine richtige Antwort erhalten Darsteller und ratende Person je 1 Punkt.",
    handoff: (name) => `Gib das Handy an ${name}.`, hidden: "Nur die darstellende Person darf den Begriff sehen.",
    ready: "Ich bin bereit – Begriff zeigen", act: "Stelle diesen Begriff dar:",
    clock: "Verbleibende Zeit", solved: "Erraten!", missed: "Nicht erraten", expired: "Zeit abgelaufen",
    pick: "Wer hat richtig geraten?", pickHint: "Wähle genau eine Person aus. Ihr beide erhaltet jeweils 1 Punkt.",
    revealSolved: "Geschafft! +1 Punkt für beide", revealMissed: "Diesmal nicht erraten – keine Punkte",
    word: "Der Begriff war:", next: "Nächste Runde", results: "Ergebnis anzeigen",
    missing: "Die Spielerdaten konnten nicht übernommen werden. Bitte verwende für jede Person einen eigenen Namen und wähle die Spieler erneut aus.", setup: "Zur Spielauswahl",
    point: "Punkte", noSpeech: "Ohne Sprechen oder Geräusche", progress: "Fortschritt",
  },
  en: {
    title: "Charades", round: "Round", of: "of", how: "How to play",
    rules: "Act out the prompt without speaking or making sounds. Everyone else guesses. The actor and the correct guesser each receive 1 point.",
    handoff: (name) => `Pass the phone to ${name}.`, hidden: "Only the actor should see the prompt.",
    ready: "I'm ready – show the prompt", act: "Act out this prompt:",
    clock: "Time remaining", solved: "Guessed!", missed: "Not guessed", expired: "Time's up",
    pick: "Who guessed correctly?", pickHint: "Choose one person. Both of you receive 1 point.",
    revealSolved: "You got it! +1 point each", revealMissed: "Not guessed this time – no points",
    word: "The prompt was:", next: "Next round", results: "Show results",
    missing: "The player data could not be loaded. Please use a unique name for each player and select the players again.", setup: "Back to setup",
    point: "Points", noSpeech: "No talking or sounds", progress: "Progress",
  },
};

function readStorage(key) {
  try { return JSON.parse(localStorage.getItem(key) || "null"); }
  catch { return null; }
}

function createOrRestore(routePlayers) {
  const fromRoute = validPlayers(routePlayers);
  const saved = readStorage(PANTOMIME_SESSION_KEY);
  const restored = restorePantomimeGame(saved, fromRoute.length ? fromRoute : null);
  try {
    if (restored) {
      // An existing game keeps its original cards and is not reserved twice.
      rememberRestoredPantomimePrompts(restored.promptIds);
      return restored;
    }
    const fromRoster = validPlayers(readStorage(PARTY_ROSTER_KEY));
    const created = createPantomimeGame(fromRoute.length ? fromRoute : fromRoster);
    // Persist immediately: React development StrictMode may call an initializer twice.
    if (created) localStorage.setItem(PANTOMIME_SESSION_KEY, JSON.stringify(created));
    return created;
  } catch (error) {
    console.error("Pantomime-Kartenauswahl oder Speichern fehlgeschlagen:", error);
    return null;
  }
}

export default function PantomimeGame() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { saveResults } = useGameResults();
  const text = copy[lang === "en" ? "en" : "de"];
  const [game, setGame] = useState(() => createOrRestore(location.state?.players));
  const [now, setNow] = useState(Date.now);
  const actionLocked = useRef(false);

  // Eine neue Karte / Phase erlaubt wieder genau eine Aktion.
  useEffect(() => { actionLocked.current = false; }, [game?.round, game?.stage]);

  // Fester Ablaufzeitpunkt: Bei Hintergrundwechsel oder Neuladen startet die Uhr nicht neu.
  useEffect(() => {
    if (game?.stage !== "acting") return undefined;
    setNow(Date.now());
    const interval = window.setInterval(() => setNow(Date.now()), 400);
    return () => window.clearInterval(interval);
  }, [game?.stage, game?.deadline]);

  useEffect(() => {
    if (!game || game.stage === "finished") return;
    try { localStorage.setItem(PANTOMIME_SESSION_KEY, JSON.stringify(game)); }
    catch (error) { console.warn("Pantomime-Spielstand konnte nicht gespeichert werden:", error); }
  }, [game]);

  function act(action) {
    if (!game || actionLocked.current) return;
    const next = advancePantomime(game, action, Date.now());
    if (next === game) return;
    actionLocked.current = true;
    if (next.stage === "finished") {
      const results = pantomimeResults(next);
      if (results) {
        saveResults(results);
        try { localStorage.removeItem(PANTOMIME_SESSION_KEY); }
        catch (error) { console.warn("Pantomime-Spielstand konnte nicht gelöscht werden:", error); }
        navigate("/results", { replace: true });
      }
      return;
    }
    setGame(next);
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 text-center space-y-5">
          <p className="font-body">{text.missing}</p>
          <Button className="w-full" onClick={() => navigate("/setup", { replace: true })}>{text.setup}</Button>
        </div>
      </div>
    );
  }

  const actor = currentActor(game);
  const prompt = currentPrompt(game);
  const time = secondsLeft(game, now);
  const guessers = game.players.filter((p) => p.name !== actor.name);
  const promptText = prompt?.[lang === "en" ? "en" : "de"] || "";
  const isActing = game.stage === "acting";
  const isFinishedRound = game.stage === "reveal";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-6 pt-safe pb-safe relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <BackButton />
      <main className="w-full max-w-md relative z-10 pt-12 pb-8 space-y-5">
        <div className="text-center space-y-2">
          <Drama className="w-9 h-9 mx-auto text-primary" aria-hidden="true" />
          <h1 className="font-heading font-bold text-3xl">{text.title}</h1>
          <p className="font-body text-sm text-muted-foreground">{text.round} {game.round + 1} {text.of} {PANTOMIME_ROUNDS}</p>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden" role="progressbar"
            aria-label={text.progress} aria-valuenow={game.round + 1} aria-valuemin={0} aria-valuemax={PANTOMIME_ROUNDS}>
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
              style={{ width: `${((game.round + 1) / PANTOMIME_ROUNDS) * 100}%` }} />
          </div>
        </div>

        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
          {game.stage === "handoff" && (
            <div className="text-center space-y-5">
              <EyeOff className="w-8 h-8 text-primary mx-auto" aria-hidden="true" />
              <p className="font-heading font-bold text-xl">{actor.avatar} {text.handoff(actor.name)}</p>
              <p className="text-sm text-muted-foreground">{text.hidden}</p>
              {game.round === 0 && (
                <div className="bg-secondary/60 rounded-xl p-4 text-left text-sm space-y-1">
                  <p className="font-heading font-semibold">{text.how}</p>
                  <p className="font-body">{text.rules}</p>
                  <p className="font-body text-muted-foreground">{text.noSpeech} · {PANTOMIME_SECONDS}s</p>
                </div>
              )}
              <Button className="w-full min-h-12 rounded-2xl" onClick={() => act({ type: "START" })}>{text.ready}</Button>
            </div>
          )}

          {isActing && (
            <div className="text-center space-y-6">
              <p className="font-body text-sm text-muted-foreground">{actor.avatar} {actor.name} · {text.act}</p>
              <h2
  className="w-full min-w-0 max-w-full font-heading font-bold text-2xl text-center"
  style={{
    whiteSpace: "normal",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  }}
>
  {promptText}
</h2>
              <p className="font-body text-xs text-muted-foreground">{text.noSpeech}</p>
              <div className={`flex items-center justify-center gap-2 font-heading font-bold text-3xl ${time === 0 ? "text-destructive" : "text-primary"}`} aria-live="off">
                <Timer className="w-7 h-7" aria-hidden="true" />
                <span aria-label={`${text.clock}: ${time} ${lang === "en" ? "seconds" : "Sekunden"}`}>{time}s</span>
              </div>
              <div className="flex flex-col gap-3">
                <Button disabled={time === 0} onClick={() => act({ type: "SOLVED" })}
                  className="w-full min-h-12 rounded-2xl bg-gradient-to-r from-primary to-accent">
                  <Check className="w-4 h-4 mr-2" aria-hidden="true" />{text.solved}
                </Button>
                <Button variant="outline" onClick={() => act({ type: "MISS" })} className="w-full min-h-12 rounded-2xl">
                  <X className="w-4 h-4 mr-2" aria-hidden="true" />{time === 0 ? text.expired : text.missed}
                </Button>
              </div>
            </div>
          )}

          {game.stage === "chooseGuesser" && (
            <div className="space-y-5 text-center">
              <h2 className="font-heading font-bold text-xl">{text.pick}</h2>
              <p className="font-body text-sm text-muted-foreground">{text.pickHint}</p>
              <div className="flex flex-col gap-3">
                {guessers.map((p) => (
                  <Button key={p.name} variant="outline" className="w-full min-h-12 rounded-2xl"
                    onClick={() => act({ type: "AWARD", guesserName: p.name })}>{p.avatar} {p.name}</Button>
                ))}
              </div>
            </div>
          )}

          {isFinishedRound && (
            <div className="text-center space-y-5">
              <p className="font-heading font-bold text-xl">
                {game.outcome === "solved" ? text.revealSolved : text.revealMissed}
              </p>
              <p className="font-body text-sm text-muted-foreground">{text.word}</p>
              <p
  className="w-full min-w-0 max-w-full font-heading font-bold text-2xl text-center"
  style={{
    whiteSpace: "normal",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  }}
>
  {promptText}
</p>
              {game.outcome === "solved" && <p className="font-body text-sm">{actor.avatar} {actor.name} + {game.players.find((p) => p.name === game.guessedBy)?.avatar} {game.guessedBy}</p>}
              <Button className="w-full min-h-12 rounded-2xl bg-gradient-to-r from-primary to-accent"
                onClick={() => act({ type: "NEXT" })}>
                {game.round + 1 === PANTOMIME_ROUNDS ? text.results : text.next}
              </Button>
            </div>
          )}
        </section>

        <section className="bg-card border border-border rounded-2xl p-4 space-y-3" aria-label={text.point}>
          <h2 className="font-heading font-semibold text-sm text-muted-foreground">{text.point}</h2>
          <div className="flex flex-wrap gap-2">
            {game.players.map((p) => (
              <div key={p.name} className="bg-secondary rounded-xl px-3 py-2 font-body text-sm">
                {p.avatar} {p.name}: <strong>{game.scores[p.name]}</strong>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
