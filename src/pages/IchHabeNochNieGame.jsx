import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";
import { useLanguage } from "@/lib/LanguageContext";
import { useGameResults } from "@/lib/GameResultsContext";
import { EyeOff, Hand, Check, ArrowRight } from "lucide-react";
import {
  NEVER_ROUNDS,
  NEVER_SESSION_KEY,
  PARTY_ROSTER_KEY,
  validNeverPlayers,
  createNeverGame,
  restoreNeverGame,
  currentNeverPrompt,
  currentNeverPlayer,
  advanceNeverGame,
  neverResults,
} from "@/lib/neverEngine";
import { rememberRestoredNeverPrompts } from "@/lib/neverPromptRotation";

const copy = {
  de: {
    title: "Ich habe noch nie", round: "Runde", of: "von",
    rules: "Lies die Aussage. Jede Person antwortet verdeckt und ehrlich mit „Schon gemacht“ oder „Noch nie“. Danach seht ihr, wer die Erfahrung teilt. Keine Trinkaufgaben!",
    points: "Erlebnispunkte", hidden: "Alle anderen schauen bitte kurz weg.",
    handoff: (name) => `Gib das Handy an ${name}.`,
    ready: "Ich bin bereit", statement: "Ich habe noch nie …",
    did: "Schon gemacht", never: "Noch nie", answerHint: "Deine Antwort bleibt bis zur Auflösung verborgen.",
    reveal: "Auflösung", number: (n, total) => `${n} von ${total} haben das schon gemacht.`,
    next: "Nächste Aussage", finish: "Ergebnis anzeigen", back: "Zur Spielauswahl",
    missing: "Die Spielerdaten konnten nicht übernommen werden. Bitte verwende für jede Person einen eigenen Namen und wähle die Spieler erneut aus.",
    storage: "Der Kartenverlauf konnte nicht gespeichert werden oder es gibt nicht genügend neue Karten. Bitte prüfe den Gerätespeicher.",
    yes: "Schon erlebt", no: "Noch nie", note: "Erlebnispunkte zählen nur Erfahrungen, keine Leistung.",
  },
  en: {
    title: "Never Have I Ever", round: "Round", of: "of",
    rules: "Read each statement. Everyone answers privately with “I've done it” or “Never”. Then discover who shares the experience. No drinking tasks!",
    points: "Experience points", hidden: "Everyone else, please look away for a moment.",
    handoff: (name) => `Pass the phone to ${name}.`,
    ready: "I'm ready", statement: "Never have I ever …",
    did: "I've done it", never: "Never", answerHint: "Your answer stays hidden until the reveal.",
    reveal: "Reveal", number: (n, total) => `${n} of ${total} have done it.`,
    next: "Next statement", finish: "Show results", back: "Back to setup",
    missing: "The player data could not be loaded. Please use a unique name for each player and select the players again.",
    storage: "Card history could not be saved or there aren't enough unused cards. Check device storage.",
    yes: "Done it", no: "Never", note: "Experience points reflect experiences, not achievement.",
  },
};

function readJson(key) {
  try { return JSON.parse(localStorage.getItem(key) || "null"); }
  catch { return null; }
}

function createOrRestore(routePlayers) {
  try {
    const saved = readJson(NEVER_SESSION_KEY);
    const fromRoute = validNeverPlayers(routePlayers);
    if (saved) {
      const restored = restoreNeverGame(saved, fromRoute.length ? fromRoute : null);
      if (!restored) return { game: null, error: "missing" };
      rememberRestoredNeverPrompts(restored.promptIds);
      return { game: restored, error: null };
    }
    const fromRoster = validNeverPlayers(readJson(PARTY_ROSTER_KEY));
    const players = fromRoute.length ? fromRoute : fromRoster;
    if (!players.length) return { game: null, error: "missing" };
    const game = createNeverGame(players);
    if (!game) return { game: null, error: "missing" };
    // Persist immediately to protect against a second StrictMode initialization.
    localStorage.setItem(NEVER_SESSION_KEY, JSON.stringify(game));
    return { game, error: null };
  } catch (error) {
    console.error("Ich-habe-noch-nie-Spiel konnte nicht gestartet werden:", error);
    return { game: null, error: "storage" };
  }
}

export default function IchHabeNochNieGame() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { saveResults } = useGameResults();
  const text = copy[lang === "en" ? "en" : "de"];
  const [initial] = useState(() => createOrRestore(location.state?.players));
  const [game, setGame] = useState(initial.game);
  const locked = useRef(false);
  const [storageFailed, setStorageFailed] = useState(false);

  useEffect(() => { locked.current = false; }, [game?.round, game?.stage, game?.answerIndex]);
  useEffect(() => {
    if (!game || game.stage === "finished") return;
    try { localStorage.setItem(NEVER_SESSION_KEY, JSON.stringify(game)); }
    catch (error) { console.warn("Spielstand konnte nicht gespeichert werden:", error); }
  }, [game]);

  function perform(action) {
    if (!game || locked.current) return;
    const next = advanceNeverGame(game, action);
    if (next === game) return;
    locked.current = true;
    if (next.stage !== "finished") {
      try { localStorage.setItem(NEVER_SESSION_KEY, JSON.stringify(next)); }
      catch (error) {
        console.error("Ich-habe-noch-nie-Spielstand konnte nicht gespeichert werden:", error);
        setStorageFailed(true);
        locked.current = false;
        return;
      }
    }
    if (next.stage === "finished") {
      const results = neverResults(next);
      if (results) {
        saveResults(results);
        try { localStorage.removeItem(NEVER_SESSION_KEY); }
        catch (error) { console.warn("Spielstand konnte nicht gelöscht werden:", error); }
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
          <p className="font-body">{initial.error === "storage" ? text.storage : text.missing}</p>
          <Button className="w-full" onClick={() => navigate("/setup", { replace: true })}>{text.back}</Button>
        </div>
      </div>
    );
  }

  const player = currentNeverPlayer(game);
  const prompt = currentNeverPrompt(game);
  const statement = prompt?.[lang === "en" ? "en" : "de"] || "";
  const yesCount = Object.values(game.answers).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-6 pt-safe pb-safe relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <BackButton />
      <main className="w-full max-w-md relative z-10 pt-12 pb-8 space-y-5">
        <header className="text-center space-y-2">
          <Hand className="w-9 h-9 mx-auto text-primary" aria-hidden="true" />
          <h1 className="font-heading font-bold text-3xl">{text.title}</h1>
          <p className="font-body text-sm text-muted-foreground">{text.round} {game.round + 1} {text.of} {NEVER_ROUNDS}</p>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden" role="progressbar"
            aria-valuenow={game.round + 1} aria-valuemin={0} aria-valuemax={NEVER_ROUNDS}>
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
              style={{ width: `${((game.round + 1) / NEVER_ROUNDS) * 100}%` }} />
          </div>
        </header>

        {storageFailed && <p role="alert" className="text-sm text-destructive text-center">{text.storage}</p>}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
          {game.stage === "handoff" && (
            <div className="text-center space-y-5">
              <EyeOff className="w-8 h-8 mx-auto text-primary" aria-hidden="true" />
              <h2 className="font-heading font-bold text-xl">{player?.avatar} {text.handoff(player?.name)}</h2>
              <p className="text-sm text-muted-foreground">{text.hidden}</p>
              {game.round === 0 && game.answerIndex === 0 && (
                <p className="bg-secondary/60 rounded-xl p-4 font-body text-left text-sm">{text.rules}</p>
              )}
              <Button className="w-full min-h-12 rounded-2xl" onClick={() => perform({ type: "READY" })}>{text.ready}</Button>
            </div>
          )}

          {game.stage === "answer" && (
            <div className="text-center space-y-5">
              <p className="font-heading font-semibold">{player?.avatar} {player?.name}</p>
              <h2
  className="w-full min-w-0 max-w-full font-heading font-bold text-xl text-center"
  style={{
    whiteSpace: "normal",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  }}
>
  {statement}
</h2>
              <p className="font-body text-xs text-muted-foreground">{text.answerHint}</p>
              <div className="flex flex-col gap-3">
                <Button className="w-full min-h-12 rounded-2xl bg-gradient-to-r from-primary to-accent"
                  onClick={() => perform({ type: "ANSWER", didIt: true })}><Check className="w-4 h-4 mr-2" />{text.did}</Button>
                <Button variant="outline" className="w-full min-h-12 rounded-2xl"
                  onClick={() => perform({ type: "ANSWER", didIt: false })}>{text.never}</Button>
              </div>
            </div>
          )}

          {game.stage === "reveal" && (
            <div className="space-y-5">
              <h2 className="font-heading font-bold text-center text-xl">{text.reveal}</h2>
              <p
  className="w-full min-w-0 max-w-full font-body text-center font-medium"
  style={{
    whiteSpace: "normal",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  }}
>
  {statement}
</p>
              <p className="font-heading font-bold text-center text-primary">{text.number(yesCount, game.players.length)}</p>
              <div className="space-y-2">
                {game.players.map((p) => (
                  <div key={p.name} className="flex items-center justify-between gap-3 bg-secondary/60 rounded-xl p-3">
                    <span className="font-body break-words">{p.avatar} {p.name}</span>
                    <span className="font-heading text-sm font-semibold shrink-0">{game.answers[p.name] ? text.yes : text.no}</span>
                  </div>
                ))}
              </div>
              <p className="font-body text-xs text-muted-foreground text-center">{text.note}</p>
              <Button className="w-full min-h-12 rounded-2xl" onClick={() => perform({ type: "NEXT" })}>
                {game.round + 1 === NEVER_ROUNDS ? text.finish : text.next}
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </Button>
            </div>
          )}
        </section>
        {game.stage === "reveal" && (
          <p className="text-center text-xs font-body text-muted-foreground">{text.points}: {game.players.map((p) => `${p.name} ${game.scores[p.name]}`).join(" · ")}</p>
        )}
      </main>
    </div>
  );
}
