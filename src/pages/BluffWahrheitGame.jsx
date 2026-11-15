import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";
import { useLanguage } from "@/lib/LanguageContext";
import { useGameResults } from "@/lib/GameResultsContext";
import { bluffPrompts } from "@/lib/bluffPrompts";
import { reserveBluffPrompts, rememberRestoredBluffPrompts } from "@/lib/bluffPromptRotation";
import { t } from "@/lib/i18n";
import { EyeOff, Check, X as XIcon, Sparkles } from "lucide-react";

const ROUND_COUNT_CAP = 10;
const SESSION_KEY = "trinkluma_bluff_session_v1";
const ROSTER_KEY = "trinkluma_party_mode_players_v1";

function readSavedSession() {
  try {
    const data = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return data && typeof data === "object" && !Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

function readSavedPlayers() {
  try {
    const data = JSON.parse(localStorage.getItem(ROSTER_KEY) || "null");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default function BluffWahrheitGame() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { saveResults } = useGameResults();

  // Route-State kann bei einem WebView-Neustart verloren gehen.
  // Die lokale Sitzung bewahrt Spielerliste, Kartenreihenfolge und Spielstand.
  const savedSessionRef = useRef(undefined);
  if (savedSessionRef.current === undefined) {
    savedSessionRef.current = readSavedSession();
  }
  const routePlayers = location.state?.players;
  const players =
    Array.isArray(routePlayers) && routePlayers.length >= 2
      ? routePlayers
      : Array.isArray(savedSessionRef.current?.players) &&
          savedSessionRef.current.players.length >= 2
        ? savedSessionRef.current.players
        : readSavedPlayers();
  const playerKeys = players.map((p) => p.name);
  const savedSession =
    savedSessionRef.current &&
    JSON.stringify(savedSessionRef.current.players?.map((p) => p.name)) ===
      JSON.stringify(playerKeys)
      ? savedSessionRef.current
      : null;

  const [scores, setScores] = useState(() =>
    Object.fromEntries(
      playerKeys.map((name) => {
        const savedPoints = Number(savedSession?.scores?.[name]?.points);
        return [name, {
          points: Number.isFinite(savedPoints) && savedPoints >= 0
            ? Math.trunc(savedPoints)
            : 0,
        }];
      })
    )
  );

  const roundPromptsRef = useRef(null);
  const deckErrorRef = useRef(null);
  if (roundPromptsRef.current === null) {
    const roundCount = Math.min(ROUND_COUNT_CAP, bluffPrompts.length);
    const savedIds = savedSession?.questionIds;
    const restored = Array.isArray(savedIds)
      ? savedIds.map((id) => bluffPrompts.find((item) => item.id === id))
      : [];
    const canRestore =
      restored.length === roundCount &&
      restored.every(Boolean) &&
      new Set(savedIds).size === roundCount;
    try {
      if (canRestore) {
        rememberRestoredBluffPrompts(savedIds);
        roundPromptsRef.current = restored;
      } else if (players.length >= 2) {
        roundPromptsRef.current = reserveBluffPrompts(bluffPrompts, roundCount);
      } else {
        roundPromptsRef.current = [];
      }
    } catch (error) {
      console.error("Bluff-Aufgabenauswahl fehlgeschlagen:", error);
      deckErrorRef.current = error;
      roundPromptsRef.current = [];
    }
  }
  const roundPrompts = roundPromptsRef.current;

  const [roundIndex, setRoundIndex] = useState(() => {
    const value = Number(savedSession?.roundIndex);
    return Number.isInteger(value) && value >= 0
      ? Math.min(value, Math.max(0, roundPrompts.length - 1))
      : 0;
  });
  const [step, setStep] = useState(() => {
    const value = Number(savedSession?.step);
    return Number.isInteger(value) && value >= 0
      ? Math.min(value, players.length)
      : 0;
  });
  const [handoffConfirmed, setHandoffConfirmed] = useState(
    () => savedSession?.handoffConfirmed === true
  );
  const [tellerMark, setTellerMark] = useState(
    () => savedSession?.tellerMark ?? null
  );
  const [votes, setVotes] = useState(
    () => savedSession?.votes && typeof savedSession.votes === "object"
      ? savedSession.votes
      : {}
  );

  useEffect(() => {
    if (players.length < 2 || !roundPrompts.length) return;
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        players,
        questionIds: roundPrompts.map((item) => item.id),
        scores,
        roundIndex,
        step,
        handoffConfirmed,
        tellerMark,
        votes,
      }));
    } catch (error) {
      console.warn("Partyspiel-Stand konnte nicht gespeichert werden:", error);
    }
  }, [players, roundPrompts, scores, roundIndex, step, handoffConfirmed, tellerMark, votes]);

  const stepActionRef = useRef(false);
  useEffect(() => {
    stepActionRef.current = false;
  }, [step, roundIndex]);

  const claimStepAction = () => {
    if (stepActionRef.current) return false;
    stepActionRef.current = true;
    return true;
  };

  const currentPrompt = roundPrompts[roundIndex] || roundPrompts[0];
  const tellerIndex = players.length ? roundIndex % players.length : 0;
  const teller = players[tellerIndex] || { name: "", avatar: "" };
  const voters = players.filter((_, i) => i !== tellerIndex);
  const totalSteps = 1 + voters.length;
  const isRevealStep = step >= totalSteps;
  const currentActor = isRevealStep ? null : step === 0 ? teller : voters[step - 1];
  const promptText = currentPrompt ? (lang === "en" ? currentPrompt.en : currentPrompt.de) : "";

  if (players.length < 2) {
    return (
      <div className="min-h-screen bg-background flex flex-col gap-4 items-center justify-center p-6 text-center">
        <p className="font-body">
          {lang === "en"
            ? "Your game session could not be restored. Please select the players again."
            : "Dein Spielstand konnte nicht wiederhergestellt werden. Bitte wähle die Spieler erneut aus."}
        </p>
        <Button onClick={() => navigate("/setup", { replace: true })}>
          {lang === "en" ? "Back to setup" : "Zur Spielauswahl"}
        </Button>
      </div>
    );
  }

  if (deckErrorRef.current || !roundPrompts.length) {
    return (
      <div className="min-h-screen bg-background flex flex-col gap-4 items-center justify-center p-6 text-center">
        <p className="font-body">
          {lang === "en"
            ? "The prompt history could not be saved or there are not enough unused prompts. Check device storage before starting again."
            : "Der Aufgabenverlauf konnte nicht gespeichert werden oder es gibt nicht genügend neue Aufgaben. Bitte prüfe den Gerätespeicher."}
        </p>
        <Button onClick={() => navigate("/setup", { replace: true })}>
          {lang === "en" ? "Back to setup" : "Zur Spielauswahl"}
        </Button>
      </div>
    );
  }

  const handleHandoffReady = () => setHandoffConfirmed(true);

  const handleTellerMark = (mark) => {
    if (!claimStepAction()) return;
    setTellerMark(mark);
    setStep(1);
    setHandoffConfirmed(false);
  };

  const handleVote = (vote) => {
    if (!claimStepAction()) return;

    const voterName = currentActor.name;
    setVotes((prev) => ({ ...prev, [voterName]: vote }));

    if (vote === tellerMark) {
      setScores((prev) => ({
        ...prev,
        [voterName]: { ...prev[voterName], points: prev[voterName].points + 1 },
      }));
    }

    // Bonus genau beim letzten Tipp vergeben, nicht in einem Effekt:
    // Beim Wiederherstellen des Reveal-Bildschirms gäbe es sonst
    // möglicherweise einen zweiten Bonuspunkt.
    if (
      step + 1 === totalSteps &&
      tellerMark === "bluff" &&
      vote !== "bluff" &&
      !voters.some((voter) => votes[voter.name] === "bluff")
    ) {
      setScores((prev) => ({
        ...prev,
        [teller.name]: { ...prev[teller.name], points: prev[teller.name].points + 1 },
      }));
    }

    setStep(step + 1);
    setHandoffConfirmed(false);
  };

  const goToNextRound = () => {
    if (!claimStepAction()) return;

    const nextRoundIndex = roundIndex + 1;

    if (nextRoundIndex >= roundPrompts.length) {
      const resultScores = {};
      playerKeys.forEach((name) => {
        resultScores[name] = { points: scores[name]?.points || 0, sips: 0, strips: 0 };
      });

      saveResults({
        scores: resultScores,
        players: players.map((p) => ({ name: p.name, avatar: p.avatar })),
        playerKeys,
        gameMode: "bluff_wahrheit",
        alcoholFree: true,
      });

      try {
        localStorage.removeItem(SESSION_KEY);
      } catch {}

      navigate("/results");
      return;
    }

    setRoundIndex(nextRoundIndex);
    setStep(0);
    setTellerMark(null);
    setVotes({});
    setHandoffConfirmed(false);
  };

  const fooledEveryone =
    tellerMark === "bluff" && voters.length > 0 && !voters.some((voter) => votes[voter.name] === "bluff");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-accent/8 rounded-full blur-3xl pointer-events-none" />

      <BackButton />

      <div className="w-full max-w-md relative z-10">
        <div className="w-full h-1.5 bg-secondary rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
            style={{ width: `${((roundIndex + 1) / roundPrompts.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          {isRevealStep ? (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-card border border-border rounded-2xl p-6 text-center"
            >
              <div className="text-4xl mb-3">{tellerMark === "bluff" ? "🎭" : "✅"}</div>
              <p className="font-heading font-bold text-lg mb-6">
                {tellerMark === "bluff" ? t(lang, "bluff_reveal_was_bluff") : t(lang, "bluff_reveal_was_truth")}
              </p>

              <div className="space-y-2 mb-6">
                {voters.map((voter) => {
                  const correct = votes[voter.name] === tellerMark;
                  return (
                    <div
                      key={voter.name}
                      className={`flex items-center justify-between px-4 py-2 rounded-xl border ${
                        correct ? "border-emerald-500/40 bg-emerald-500/10" : "border-border bg-secondary"
                      }`}
                    >
                      <span className="font-body text-sm">{voter.avatar} {voter.name}</span>
                      {correct ? <Check className="w-4 h-4 text-emerald-500" /> : <XIcon className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  );
                })}
              </div>

              {fooledEveryone && (
                <p className="font-heading font-bold text-amber-500 text-sm mb-6">
                  {t(lang, "bluff_fooled_everyone", teller.name)}
                </p>
              )}

              <Button
                onClick={goToNextRound}
                className="w-full h-12 font-heading font-bold rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                {roundIndex + 1 >= roundPrompts.length ? t(lang, "bluff_show_results") : t(lang, "bluff_next_round")}
              </Button>
            </motion.div>
          ) : !handoffConfirmed ? (
            <motion.div
              key={`handoff-${roundIndex}-${step}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-card border border-border rounded-2xl p-8 text-center"
            >
              <div className="text-4xl mb-4">{currentActor.avatar}</div>
              <p className="font-heading font-bold text-lg mb-2">
                {step === 0 ? t(lang, "bluff_pass_to_teller", currentActor.name) : t(lang, "bluff_pass_to_guesser", currentActor.name)}
              </p>
              <p className="font-body text-sm text-muted-foreground mb-6">{t(lang, "bluff_pass_device_hint")}</p>
              <Button
                onClick={handleHandoffReady}
                className="w-full h-12 font-heading font-bold rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                {t(lang, "bluff_ready")}
              </Button>
            </motion.div>
          ) : step === 0 ? (
            <motion.div
              key={`teller-${roundIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-center gap-2 mb-4 text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span className="font-body text-xs">{t(lang, "bluff_prompt_label")}</span>
              </div>

              <p className="font-heading font-bold text-lg text-center mb-6">{promptText}</p>
              <p className="font-body text-sm text-center text-muted-foreground mb-4">{t(lang, "bluff_secret_hint")}</p>

              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => handleTellerMark("truth")} variant="outline" className="h-14 font-heading font-bold rounded-2xl border-2">
                  {t(lang, "bluff_mark_truth")}
                </Button>
                <Button onClick={() => handleTellerMark("bluff")} variant="outline" className="h-14 font-heading font-bold rounded-2xl border-2">
                  {t(lang, "bluff_mark_bluff")}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`vote-${roundIndex}-${step}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-center gap-2 mb-4 text-muted-foreground">
                <EyeOff className="w-4 h-4" />
                <span className="font-body text-xs">{t(lang, "bluff_guess_hint")}</span>
              </div>

              <p className="font-heading font-bold text-lg text-center mb-6">{promptText}</p>

              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => handleVote("truth")} variant="outline" className="h-14 font-heading font-bold rounded-2xl border-2">
                  {t(lang, "bluff_vote_truth")}
                </Button>
                <Button onClick={() => handleVote("bluff")} variant="outline" className="h-14 font-heading font-bold rounded-2xl border-2">
                  {t(lang, "bluff_vote_bluff")}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}