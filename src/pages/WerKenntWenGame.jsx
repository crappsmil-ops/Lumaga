import React, { useRef, useState, useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";

import BackButton from "@/components/BackButton";

import { useLanguage } from "@/lib/LanguageContext";

import { useGameResults } from "@/lib/GameResultsContext";

import { relationshipQuizQuestions } from "@/lib/relationshipQuizQuestions";

import { getCustomModeCards } from "@/lib/customDeck";

import { reserveWkwQuestions, rememberRestoredWkwQuestions } from "@/lib/wkwQuestionRotation";

import { t } from "@/lib/i18n";

import { EyeOff, Check, X as XIcon } from "lucide-react";

const ROUND_COUNT_CAP = 10;

const SESSION_KEY = "trinkluma_wkw_session_v1";

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

function renderCustomWkwPrompt(text, name) {

  const source =

    typeof text === "string"

      ? text.trim()

      : "";

  return source.split("{name}").join(name || "");

}

function buildCustomWkwQuestions() {

  return getCustomModeCards("wkw")

    .map((card) => {

      const text =

        typeof card?.text === "string"

          ? card.text.trim()

          : "";

      const options = (

        Array.isArray(card?.options)

          ? card.options

          : []

      )

        .map((option) =>

          typeof option === "string"

            ? option.trim()

            : ""

        )

        .filter(Boolean)

        .slice(0, 4);

      if (!text || options.length < 2) {

        return null;

      }

      return {

        id: `custom_wkw_${card.__runtimeId}`,

        prompt: {

          de: (name) =>

            renderCustomWkwPrompt(

              text,

              name

            ),

          en: (name) =>

            renderCustomWkwPrompt(

              text,

              name

            ),

        },

        options: options.map(

          (label, index) => ({

            id: `custom_option_${index}`,

            label: {

              de: label,

              en: label,

            },

          })

        ),

      };

    })

    .filter(Boolean);

}

function shuffleItems(items, random = Math.random) {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

export default function WerKenntWenGame() {

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

  const customQuestionsRef = useRef(null);

  if (customQuestionsRef.current === null) {
    customQuestionsRef.current = buildCustomWkwQuestions();
  }

  const customQuestions = customQuestionsRef.current;

  const questionPoolRef = useRef(null);

  if (questionPoolRef.current === null) {
    questionPoolRef.current = [
      ...relationshipQuizQuestions,
      ...customQuestions,
    ];
  }

  const questionPool = questionPoolRef.current;

  const roundQuestionsRef = useRef(null);

  const deckErrorRef = useRef(null);

  if (roundQuestionsRef.current === null) {
    const roundCount = Math.min(
      ROUND_COUNT_CAP,
      questionPool.length
    );

    const savedIds = savedSession?.questionIds;

    const restored = Array.isArray(savedIds)
      ? savedIds.map((id) =>
          questionPool.find((item) => item.id === id)
        )
      : [];

    const canRestore =
      restored.length === roundCount &&
      restored.every(Boolean) &&
      new Set(savedIds).size === roundCount;

    try {
      if (canRestore) {
        rememberRestoredWkwQuestions(savedIds);
        roundQuestionsRef.current = restored;
      } else if (players.length >= 2) {
        const customCount = Math.min(
          customQuestions.length,
          5,
          roundCount
        );
        const standardCount = roundCount - customCount;

        const selectedStandard =
          standardCount > 0
            ? reserveWkwQuestions(
                relationshipQuizQuestions,
                standardCount
              )
            : [];

        const selectedCustom = shuffleItems(
          customQuestions
        ).slice(0, customCount);

        roundQuestionsRef.current = shuffleItems([
          ...selectedStandard,
          ...selectedCustom,
        ]);
      } else {
        roundQuestionsRef.current = [];
      }
    } catch (error) {
      console.error("WKW-Fragenauswahl fehlgeschlagen:", error);
      deckErrorRef.current = error;
      roundQuestionsRef.current = [];
    }
  }

  const roundQuestions = roundQuestionsRef.current;

  const [roundIndex, setRoundIndex] = useState(() => {

    const value = Number(savedSession?.roundIndex);

    return Number.isInteger(value) && value >= 0

      ? Math.min(value, Math.max(0, roundQuestions.length - 1))

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

  const [targetAnswerId, setTargetAnswerId] = useState(

    () => savedSession?.targetAnswerId ?? null

  );

  const [guesses, setGuesses] = useState(

    () => savedSession?.guesses && typeof savedSession.guesses === "object"

      ? savedSession.guesses

      : {}

  );

  useEffect(() => {

    if (players.length < 2 || !roundQuestions.length) return;

    try {

      localStorage.setItem(SESSION_KEY, JSON.stringify({

        players,

        questionIds: roundQuestions.map((item) => item.id),

        scores,

        roundIndex,

        step,

        handoffConfirmed,

        targetAnswerId,

        guesses,

      }));

    } catch (error) {

      console.warn("Partyspiel-Stand konnte nicht gespeichert werden:", error);

    }

  }, [players, roundQuestions, scores, roundIndex, step, handoffConfirmed, targetAnswerId, guesses]);

  const stepActionRef = useRef(false);

  useEffect(() => {

    stepActionRef.current = false;

  }, [step, roundIndex]);

  const claimStepAction = () => {

    if (stepActionRef.current) return false;

    stepActionRef.current = true;

    return true;

  };

  const currentQuestion = roundQuestions[roundIndex] || roundQuestions[0];

  const targetIndex = players.length ? roundIndex % players.length : 0;

  const targetPlayer = players[targetIndex] || { name: "", avatar: "" };

  const guessers = players.filter((_, i) => i !== targetIndex);

  const totalSteps = 1 + guessers.length;

  const isRevealStep = step >= totalSteps;

  const currentActor = isRevealStep ? null : step === 0 ? targetPlayer : guessers[step - 1];

  const promptText = currentQuestion

    ? currentQuestion.prompt[lang === "en" ? "en" : "de"](targetPlayer.name)

    : "";

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

  if (deckErrorRef.current || !roundQuestions.length) {

    return (

      <div className="min-h-screen bg-background flex flex-col gap-4 items-center justify-center p-6 text-center">

        <p className="font-body">

          {lang === "en"

            ? "The question history could not be saved or there are not enough new questions. Check device storage before starting again."

            : "Der Fragenverlauf konnte nicht gespeichert werden oder es gibt nicht genügend neue Fragen. Bitte prüfe den Gerätespeicher."}

        </p>

        <Button onClick={() => navigate("/setup", { replace: true })}>

          {lang === "en" ? "Back to setup" : "Zur Spielauswahl"}

        </Button>

      </div>

    );

  }

  const handleHandoffReady = () => setHandoffConfirmed(true);

  const handleTargetSelect = (optionId) => {

    if (!claimStepAction()) return;

    setTargetAnswerId(optionId);

    setStep(1);

    setHandoffConfirmed(false);

  };

  const handleGuessSelect = (optionId) => {

    if (!claimStepAction()) return;

    const guesserName = currentActor.name;

    setGuesses((prev) => ({ ...prev, [guesserName]: optionId }));

    if (optionId === targetAnswerId) {

      setScores((prev) => ({

        ...prev,

        [guesserName]: { ...prev[guesserName], points: prev[guesserName].points + 1 },

      }));

    }

    setStep(step + 1);

    setHandoffConfirmed(false);

  };

  const goToNextRound = () => {

    if (!claimStepAction()) return;

    const nextRoundIndex = roundIndex + 1;

    if (nextRoundIndex >= roundQuestions.length) {

      const resultScores = {};

      playerKeys.forEach((name) => {

        resultScores[name] = { points: scores[name]?.points || 0, sips: 0, strips: 0 };

      });

      saveResults({

        scores: resultScores,

        players: players.map((p) => ({ name: p.name, avatar: p.avatar })),

        playerKeys,

        gameMode: "wer_kennt_wen",

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

    setTargetAnswerId(null);

    setGuesses({});

    setHandoffConfirmed(false);

  };

  return (

    <div className="min-h-screen bg-background flex flex-col items-center p-6 relative overflow-x-hidden overflow-y-auto">

      <div className="absolute top-1/3 right-0 w-80 h-80 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-accent/8 rounded-full blur-3xl pointer-events-none" />

      <BackButton />

      <div className="w-full max-w-md relative z-10 my-auto">

        <div className="w-full h-1.5 bg-secondary rounded-full mb-8 overflow-hidden">

          <div

            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"

            style={{ width: `${((roundIndex + 1) / roundQuestions.length) * 100}%` }}

          />

        </div>

        <AnimatePresence mode="wait">

          {isRevealStep ? (

            <motion.div

              key="reveal"

              initial={{ opacity: 0, y: 10 }}

              animate={{ opacity: 1, y: 0 }}

              exit={{ opacity: 0, y: -10 }}

              className="w-full min-w-0 bg-card border border-border rounded-2xl p-6 text-center"

            >

              <p
  className="w-full min-w-0 max-w-full font-heading font-bold text-lg mb-4 text-center"
  style={{
    whiteSpace: "normal",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  }}
>
  {promptText}
</p>

              <p className="font-body text-sm text-muted-foreground mb-2">

                {targetPlayer.name} {t(lang, "wkw_reveal_answer_was")}

              </p>

              <div
  className="w-full min-w-0 h-auto mb-6 px-4 py-3 rounded-2xl border-2 border-primary/30 bg-primary/5 text-primary text-xl font-heading font-bold text-center"
  style={{
    whiteSpace: "normal",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  }}
>
  {currentQuestion.options.find(
    (o) => o.id === targetAnswerId
  )?.label[lang === "en" ? "en" : "de"]}
</div>

              <div className="space-y-2 mb-6">

                {guessers.map((guesser) => {

                  const correct = guesses[guesser.name] === targetAnswerId;

                  return (

                    <div

                      key={guesser.name}

                      className={`flex items-center justify-between px-4 py-2 rounded-xl border ${

                        correct ? "border-emerald-500/40 bg-emerald-500/10" : "border-border bg-secondary"

                      }`}

                    >

                      <span className="font-body text-sm">{guesser.avatar} {guesser.name}</span>

                      {correct ? <Check className="w-4 h-4 text-emerald-500" /> : <XIcon className="w-4 h-4 text-muted-foreground" />}

                    </div>

                  );

                })}

              </div>

              <Button

                onClick={goToNextRound}

                className="w-full h-12 font-heading font-bold rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90"

              >

                {roundIndex + 1 >= roundQuestions.length ? t(lang, "wkw_show_results") : t(lang, "wkw_next_round")}

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

                {step === 0 ? t(lang, "wkw_pass_to_target", currentActor.name) : t(lang, "wkw_pass_to_guesser", currentActor.name)}

              </p>

              <p className="font-body text-sm text-muted-foreground mb-6">{t(lang, "wkw_pass_device_hint")}</p>

              <Button

                onClick={handleHandoffReady}

                className="w-full h-12 font-heading font-bold rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90"

              >

                {t(lang, "wkw_ready")}

              </Button>

            </motion.div>

          ) : (

            <motion.div

              key={`input-${roundIndex}-${step}`}

              initial={{ opacity: 0, y: 10 }}

              animate={{ opacity: 1, y: 0 }}

              exit={{ opacity: 0, y: -10 }}

              className="bg-card border border-border rounded-2xl p-6"

            >

              <div className="flex items-center justify-center gap-2 mb-4 text-muted-foreground">

                <EyeOff className="w-4 h-4" />

                <span className="font-body text-xs">

                  {step === 0 ? t(lang, "wkw_secret_hint") : t(lang, "wkw_guess_hint")}

                </span>

              </div>

              <p className="min-w-0 max-w-full font-heading font-bold text-lg text-center mb-6 whitespace-normal break-words [overflow-wrap:anywhere]">
  {promptText}
</p>

              <div className="flex flex-col gap-3">

                {currentQuestion.options.map((option) => (
  <button
    key={option.id}
    type="button"
    onClick={() =>
      step === 0
        ? handleTargetSelect(option.id)
        : handleGuessSelect(option.id)
    }
    className="w-full min-w-0 rounded-2xl border-2 border-border bg-background px-4 py-4 text-base font-body text-center"
    style={{
      minHeight: "56px",
      height: "auto",
      whiteSpace: "normal",
      overflowWrap: "anywhere",
      wordBreak: "break-word",
    }}
  >
    <span
      className="block w-full min-w-0"
      style={{
        whiteSpace: "normal",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
      }}
    >
      {option.label[lang === "en" ? "en" : "de"]}
    </span>
  </button>
))}

              </div>

            </motion.div>

          )}

        </AnimatePresence>

      </div>

    </div>

  );

}
