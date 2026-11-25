import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  Check,
  Flame,
  Skull,
  Users,
  SkipForward,
} from "lucide-react";
import {
  getQuestionLimit,
} from "@/lib/seededShuffle";
import {
  loadQuestionPools,
} from "@/lib/loadQuestions";
import {
  getCustomDeck,
} from "@/lib/customDeck";
import {
  getRecentQuestionKeys,
  getQuestionHistoryKey,
  rememberGameQuestions,
} from "@/lib/questionHistory";
import {
  Button,
} from "@/components/ui/button";
import QuestionCard from "@/components/game/QuestionCard";
import PlayerIndicator from "@/components/game/PlayerIndicator";
import ActionButtons from "@/components/game/ActionButtons";
import GroupDecisionPicker from "@/components/game/GroupDecisionPicker";
import JokerButton from "@/components/game/JokerButton";
import {
  usePremium,
} from "@/lib/PremiumContext";
import {
  useLocalTrial,
} from "@/lib/LocalTrialContext";
import {
  useLanguage,
} from "@/lib/LanguageContext";
import {
  useGameResults,
} from "@/lib/GameResultsContext";
import {
  t,
} from "@/lib/i18n";
import BackButton from "@/components/BackButton";
import { Capacitor } from "@capacitor/core";
import {
  playSFX,
} from "@/lib/audio";
const RISK_SUCCESS_POINTS = 10;
// Genau 12 feste kostenlose Fun-Fragen, unabhängig vom Party-Pass.
// Die Reihenfolge und Auswahl ändern sich zwischen Spielen nicht.
const FREE_FUN_QUESTIONS = {
  de: [
    "Was ist dein lustigstes Party-Erlebnis?",
    "Welcher Song bringt dich sofort zum Tanzen?",
    "Was war dein peinlichster Versprecher?",
    "Wenn du eine Superkraft hättest, welche wäre das?",
    "Was ist deine ungewöhnlichste Essenskombination?",
    "Welcher Film bringt dich immer zum Lachen?",
    "Was war dein spontanster Ausflug?",
    "Welche drei Dinge würdest du auf eine einsame Insel mitnehmen?",
    "Was ist dein heimliches Talent?",
    "Welche berühmte Person würdest du gern treffen?",
    "Was ist der lustigste Spitzname, den du je hattest?",
    "Wenn du morgen irgendwo aufwachen könntest, wo wäre das?",
  ],
  en: [
    "What is your funniest party memory?",
    "Which song always makes you dance?",
    "What was your most embarrassing slip of the tongue?",
    "If you could have a superpower, what would it be?",
    "What is your most unusual food combination?",
    "Which movie always makes you laugh?",
    "What was your most spontaneous trip?",
    "Which three things would you take to a deserted island?",
    "What is your hidden talent?",
    "Which celebrity would you love to meet?",
    "What is the funniest nickname you have ever had?",
    "If you could wake up anywhere tomorrow, where would it be?",
  ],
};

export default function Game() {
  const location =
    useLocation();
  const navigate =
    useNavigate();
  const {
    saveResults,
  } =
    useGameResults();
  const players =
    location.state?.players ||
    [];
  const hotMode =
    location.state?.hotMode ||
    false;
  const hardcoreMode =
    location.state?.hardcoreMode ||
    false;
  const customQuestions =
    useMemo(
      () =>
        getCustomDeck(),
      []
    );
  const {
    lang,
  } =
    useLanguage();
  const {
    isHotPremium: isHotPurchased,
    isHardcorePremium: isHardcorePurchased,
    hasPartyPass,
  } =
    usePremium();

  // Ein aktiver 24h-Party-Pass schaltet Wild und Chaos ebenso frei
  // wie ein dauerhafter Kauf.
  const isHotPremium =
    isHotPurchased || Boolean(hasPartyPass);
  const isHardcorePremium =
    isHardcorePurchased || Boolean(hasPartyPass);
  const {
    trialAvailable,
  } =
    useLocalTrial();
  
  // Wild und Chaos nur während der lokalen Entwicklung
  // im Browser zum Testen freischalten.
  const isWebPreview =
    import.meta.env.DEV &&
    Capacitor.getPlatform() === "web";

  const hasFullClassicAccess =
    isHotPremium && isHardcorePremium;

  const hasPaidCurrentFullMode =
    hardcoreMode
      ? isHardcorePremium
      : hotMode
        ? isHotPremium
        : hasFullClassicAccess;

  const usesTrial =
    !hasPaidCurrentFullMode &&
    trialAvailable;

  const effectiveHardcoreMode =
  hardcoreMode &&
  (isHardcorePremium || usesTrial);

  const effectiveHotMode =
  hotMode &&
  (isHotPremium || usesTrial) &&
  !effectiveHardcoreMode;

  const playerKeys =
    players.map(
      (p) =>
        typeof p ===
        "object"
          ? p.name
          : p
    );
  const [pools, setPools] =
    useState(null);
  const [questionLoadError, setQuestionLoadError] =
    useState(false);
  const poolsRef =
    useRef(null);
  useEffect(() => {
    let alive = true;
    setQuestionLoadError(false);
    loadQuestionPools(lang)
      .then((p) => {
        if (!alive) {
          return;
        }
        poolsRef.current = p;
        setPools(p);
      })
      .catch((error) => {
        console.error(
          "Trinkspiel-Fragen konnten nicht geladen werden:",
          error
        );
        if (alive) {
          setQuestionLoadError(true);
        }
      });
    return () => {
      alive = false;
    };
  }, [lang]);
  /*
   * Fragen aus den letzten
   * 3 Spielen merken.
   */
  const recentQuestionKeys =
    useMemo(
      () =>
        getRecentQuestionKeys(),
      []
    );
  const historyGameIdRef =
    useRef(
      `local_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 10)}`
    );
  const CATEGORY_CONFIG =
    poolsRef.current
      ?.CATEGORY_CONFIG ||
    {};
  const shuffled =
    useMemo(() => {
      if (!pools) {
        return [];
      }
      // Kostenloser Fun-Modus: ausschließlich diese 12 festen Karten.
      // Keine anderen Fragen, auch keine eigenen Karten, hinzufügen.
      // Premium-Zugänge und die bestehende Testphase bleiben unverändert.
      const isFreeFunMode =
        !hotMode &&
        !hardcoreMode &&
        !hasFullClassicAccess &&
        !usesTrial;
      if (isFreeFunMode) {
        return FREE_FUN_QUESTIONS[lang === "en" ? "en" : "de"].map(
          (text) => ({ text, category: 1 })
        );
      }
      const q =
        Array.isArray(pools.questions)
          ? pools.questions.filter(Boolean)
          : [];
      const hq =
        Array.isArray(pools.hotQuestions)
          ? pools.hotQuestions.filter(Boolean)
          : [];
      const hcq =
        Array.isArray(pools.hardcoreQuestions)
          ? pools.hardcoreQuestions.filter(Boolean)
          : [];
      const hasBaseQuestionAccess =
        effectiveHotMode ||
        effectiveHardcoreMode ||
        hasFullClassicAccess ||
        usesTrial;
      let pool =
        hasBaseQuestionAccess
          ? [
              ...q,
            ]
          : [];
      if (
        effectiveHotMode
      ) {
        pool =
          [
            ...pool,
            ...hq,
          ];
      }
      if (
        effectiveHardcoreMode
      ) {
        pool =
          [
            ...pool,
            ...hcq,
          ];
      }
      const fullPoolBeforeHistory = [
        ...pool,
      ];
      const blockedQuestionKeys =
        new Set(
          recentQuestionKeys
        );
      /*
       * Fragen aus den letzten
       * 3 Spielen möglichst sperren.
       * Wenn dadurch zu wenige Karten
       * übrig bleiben, werden ältere
       * Fragen wieder zugelassen.
       */
      if (
        blockedQuestionKeys.size >
        0
      ) {
        pool =
          pool.filter(
            (question) =>
              !blockedQuestionKeys.has(
                getQuestionHistoryKey(
                  question
                )
              )
          );
      }
      const normalLimit =
        getQuestionLimit(
          players.length,
          {
            mode:
              effectiveHardcoreMode
                ? "hardcore"
                : effectiveHotMode
                  ? "hot"
                  : "free",
          }
        );
      if (
        pool.length < normalLimit &&
        fullPoolBeforeHistory.length >
          pool.length
      ) {
        const existingKeys =
          new Set(
            pool.map(
              (question) =>
                getQuestionHistoryKey(
                  question
                )
            )
          );
        const fallbackQuestions =
          fullPoolBeforeHistory.filter(
            (question) => {
              const key =
                getQuestionHistoryKey(
                  question
                );
              if (
                existingKeys.has(key)
              ) {
                return false;
              }
              existingKeys.add(key);
              return true;
            }
          );
        for (
          let i =
            fallbackQuestions.length - 1;
          i > 0;
          i--
        ) {
          const j =
            Math.floor(
              Math.random() *
                (i + 1)
            );
          [
            fallbackQuestions[i],
            fallbackQuestions[j],
          ] = [
            fallbackQuestions[j],
            fallbackQuestions[i],
          ];
        }
        const missingCount =
          Math.max(
            0,
            normalLimit -
              pool.length
          );
        pool = [
          ...pool,
          ...fallbackQuestions.slice(
            0,
            missingCount
          ),
        ];
      }
      for (
        let i =
          pool.length - 1;
        i > 0;
        i--
      ) {
        const j =
          Math.floor(
            Math.random() *
              (
                i + 1
              )
          );
        [
          pool[i],
          pool[j],
        ] =
          [
            pool[j],
            pool[i],
          ];
      }
      const limit =
        normalLimit;
      const customCards =
        Array.isArray(customQuestions)
          ? customQuestions.filter(Boolean)
          : [];
      /*
       * Eigene Karten dürfen durch das
       * normale Fragenlimit nicht verschwinden.
       */
      const totalLimit =
        Math.max(
          limit,
          customCards.length
        );
      const normalQuestionCount =
        Math.max(
          0,
          totalLimit -
            customCards.length
        );
      const result =
        pool.slice(
          0,
          normalQuestionCount
        );
      customCards.forEach(
        (
          card,
          index
        ) => {
          const position =
            Math.min(
              result.length,
              Math.floor(
                (
                  (index + 1) *
                  (result.length + 1)
                ) /
                  (
                    customCards.length +
                    1
                  )
              )
            );
          result.splice(
            position,
            0,
            card
          );
        }
      );
      return result.slice(
        0,
        totalLimit
      );
        }, [
      pools,
      effectiveHotMode,
      effectiveHardcoreMode,
      hasFullClassicAccess,
      usesTrial,
      customQuestions,
      players.length,
      recentQuestionKeys,
      hotMode,
      hardcoreMode,
      lang,
    ]);
  /*
   * Dieses Deck als aktuelles Spiel
   * merken. Durch die feste Game-ID
   * wird es nur einmal gespeichert.
   */
  useEffect(() => {
    if (
      !shuffled.length
    ) {
      return;
    }
    rememberGameQuestions(
      shuffled,
      historyGameIdRef.current
    );
  }, [
    shuffled,
  ]);
  const [
    questionIndex,
    setQuestionIndex,
  ] =
    useState(0);
  const [
    playerIndex,
    setPlayerIndex,
  ] =
    useState(0);
  const [
    scores,
    setScores,
  ] =
    useState(
      Object.fromEntries(
        playerKeys.map(
          (p) => [
            p,
            {
              points: 0,
              sips: 0,
              strips: 0,
            },
          ]
        )
      )
    );
  const [
    jokers,
    setJokers,
  ] =
    useState(
      effectiveHardcoreMode ||
        effectiveHotMode
        ? Object.fromEntries(
            playerKeys.map(
              (k) => [
                k,
                true,
              ]
            )
          )
        : {}
    );
  const [
    riskPhase,
    setRiskPhase,
  ] =
    useState(null);
  const [
    partnerName,
    setPartnerName,
  ] =
    useState(null);
  const turnFinishedRef =
    useRef(false);
  useEffect(() => {
    turnFinishedRef.current =
      false;
  }, [
    questionIndex,
  ]);
  const claimTurn =
    () => {
      if (
        turnFinishedRef.current
      ) {
        return false;
      }
      turnFinishedRef.current =
        true;
      return true;
    };
  useEffect(() => {
    if (
      shuffled.length >
        0 &&
      questionIndex >=
        shuffled.length
    ) {
      playSFX(
        "finish"
      );
      saveResults({
        scores,
        players,
        playerKeys,
        hardcoreMode:
          effectiveHardcoreMode,
      });
      navigate(
        "/results"
      );
    }
    }, [
    questionIndex,
    shuffled.length,
  ]);
  if (
    players.length ===
    0
  ) {
    navigate(
      "/"
    );
    return null;
  }
  if (questionLoadError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 text-center space-y-4">
          <h1 className="font-heading font-bold text-xl">
            {lang === "en"
              ? "Game could not be loaded"
              : "Spiel konnte nicht geladen werden"}
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            {lang === "en"
              ? "The game cards could not be loaded. Please try again."
              : "Die Spielkarten konnten nicht geladen werden. Bitte versuche es erneut."}
          </p>
          <Button
            className="w-full"
            onClick={() =>
              window.location.reload()
            }
          >
            {lang === "en"
              ? "Try again"
              : "Erneut versuchen"}
          </Button>
        </div>
      </div>
    );
  }
  if (!pools) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }
  if (
    shuffled.length ===
    0
  ) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 text-center space-y-4">
          <h1 className="font-heading font-bold text-xl">
            {lang === "en"
              ? "No game cards available"
              : "Keine Spielkarten verfügbar"}
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            {lang === "en"
              ? "No suitable cards could be prepared for this game."
              : "Für dieses Spiel konnten keine passenden Karten vorbereitet werden."}
          </p>
          <Button
            className="w-full"
            onClick={() =>
              navigate(
                "/setup",
                { replace: true }
              )
            }
          >
            {lang === "en"
              ? "Back to game selection"
              : "Zur Spielauswahl"}
          </Button>
        </div>
      </div>
    );
  }
  if (
    questionIndex >=
    shuffled.length
  ) {
    return null;
  }
  const currentPlayer =
    players[
      playerIndex
    ];
  const currentPlayerName =
    typeof currentPlayer ===
    "object"
      ? currentPlayer.name
      : currentPlayer;
  const currentQuestion =
    shuffled[
      questionIndex
    ];
  const advance =
    (
      nextPlayerIndex
    ) => {
        setTimeout(
        () =>
          playSFX(
            "turn"
          ),
        220
      );
      const nextIdx =
        nextPlayerIndex !==
        undefined
          ? nextPlayerIndex
          : (
              playerIndex +
              1
            ) %
            players.length;
      setQuestionIndex(
        (i) =>
          i + 1
      );
      setPlayerIndex(
        nextIdx
      );
    };
  const resetTurnState =
    () => {
      setRiskPhase(
        null
      );
      setPartnerName(
        null
      );
    };
  const handleAnswer =
    () => {
      if (
        !claimTurn()
      ) {
        return;
      }
      const config =
        CATEGORY_CONFIG[
          currentQuestion
            .category
        ] || {
          points: 5,
        };
      const names =
        currentQuestion.type ===
          "double_challenge" &&
        partnerName
          ? [
              currentPlayerName,
              partnerName,
            ]
          : [
              currentPlayerName,
            ];
      setScores(
        (prev) => {
          const updated =
            {
              ...prev,
            };
          names.forEach(
            (n) => {
              updated[n] =
                {
                  ...updated[
                    n
                  ],
                  points:
                    updated[
                      n
                    ]
                      .points +
                    config.points,
                };
            }
          );
          return updated;
        }
      );
      resetTurnState();
      advance();
    };


  const handleJokerUse =
    () => {
      if (
        (
          effectiveHardcoreMode ||
          effectiveHotMode
        ) &&
        jokers[
          currentPlayerName
        ]
      ) {
        if (
          !claimTurn()
        ) {
          return;
        }
        playSFX(
          "joker"
        );
        setJokers(
          (prev) => ({
            ...prev,
            [currentPlayerName]:
              false,
          })
        );
        resetTurnState();
        advance();
      }
    };
  const handleSkip = () => {
    if (!claimTurn()) return;
    resetTurnState();
    advance();
  };


  const handleBlackoutYes = () => {
    if (!claimTurn()) return;
    resetTurnState();
    advance();
  };
  const handleBlackoutAvoid =
    () => {
      if (
        !claimTurn()
      ) {
        return;
      }
      advance();
    };
  const handleGroupPick =
    (
      name
    ) => {
      if (
        !claimTurn()
      ) {
        return;
      }
      const pickedIndex =
        players.findIndex(
          (p) =>
            (
              typeof p ===
              "object"
                ? p.name
                : p
            ) ===
            name
        );
      advance(
        pickedIndex
      );
    };
  const handlePartnerPick =
    (
      name
    ) => {
      if (
        turnFinishedRef.current
      ) {
        return;
      }
      setPartnerName(
        name
      );
    };
  const handleRiskAccept =
    () => {
      if (
        turnFinishedRef.current
      ) {
        return;
      }
      setRiskPhase(
        "attempting"
      );
    };
  const handleRiskDecline = () => {
    if (!claimTurn()) return;
    resetTurnState();
    advance();
  };
  const handleRiskSuccess =
    () => {
      if (
        !claimTurn()
      ) {
        return;
      }
      setScores(
        (prev) => ({
          ...prev,
          [currentPlayerName]:
            {
              ...prev[
                currentPlayerName
              ],
              points:
                prev[
                  currentPlayerName
                ].points +
                RISK_SUCCESS_POINTS,
            },
        })
      );
      resetTurnState();
      advance();
    };
  const handleRiskFail = () => {
    if (!claimTurn()) return;
    resetTurnState();
    advance();
  };
  const specialType =
    currentQuestion
      ?.type;
  const isGroupDecision =
    specialType ===
    "group_decision";
  const isDoubleChallenge =
    specialType ===
    "double_challenge";
  const isRiskCard =
    specialType ===
    "risk_card";
  const skipLabel = t(lang, "action_skip");
  const SkipButton =
    () => (
      <Button
        onClick={
          handleSkip
        }
        variant="ghost"
        className="h-10 w-full text-sm font-body text-muted-foreground hover:text-foreground rounded-2xl"
      >
        <SkipForward className="w-4 h-4 mr-2" />
        {skipLabel}
      </Button>
    );
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-accent/8 rounded-full blur-3xl pointer-events-none" />
      <BackButton />
      <div className="w-full max-w-md relative z-10">
        <div className="w-full h-1.5 bg-secondary rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
            style={{
              width:
                `${
                  (
                    (
                      questionIndex +
                      1
                    ) /
                    shuffled.length
                  ) *
                  100
                }%`,
            }}
          />
        </div>
        {(
          effectiveHardcoreMode ||
          effectiveHotMode
        ) &&
          !isGroupDecision &&
          !isRiskCard && (
            <div className="mb-4">
              {effectiveHardcoreMode && (
                <p className="text-center text-xs font-body text-muted-foreground mb-2">
                  {lang === "de"
                    ? "Joker zum Überspringen"
                    : "Joker to skip"}
                </p>
              )}
              <JokerButton
                hasJoker={
                  !!jokers[
                    currentPlayerName
                  ]
                }
                onUse={
                  handleJokerUse
                }
                playerName={
                  currentPlayerName
                }
              />
            </div>
          )}
        {isGroupDecision ? (
          <div className="w-full">
            <GroupDecisionPicker
              players={
                players
              }
              onPick={
                handleGroupPick
              }
            />
            <div className="mt-3">
              <SkipButton />
            </div>
          </div>
        ) : isRiskCard ? (
          <div className="w-full">
            <AnimatePresence mode="wait">
              <QuestionCard
                question={
                  currentQuestion
                }
                questionIndex={
                  questionIndex
                }
                totalQuestions={
                  shuffled.length
                }
              />
            </AnimatePresence>
            {riskPhase ===
            "attempting" ? (
              <div className="flex flex-col gap-3 mt-8">
                <div className="text-center text-sm font-heading font-bold text-amber-400 mb-1">
                  {t(
                    lang,
                    "hc_risk_attempting"
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={
                      handleRiskSuccess
                    }
                    className="min-h-14 h-auto min-w-0 px-2 py-3 text-sm font-heading font-bold rounded-2xl whitespace-normal break-words overflow-hidden active:scale-95 bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90 shadow-lg shadow-emerald-500/20"
                  >
                    <Check className="w-4 h-4 mr-1.5 shrink-0" />
                    <span className="block min-w-0 max-w-full whitespace-normal break-words text-center leading-tight">
                      {t(
                        lang,
                        "hc_risk_success"
                      )}
                    </span>
                  </Button>
                  <Button
                    onClick={
                      handleRiskFail
                    }
                    className="min-h-14 h-auto min-w-0 px-2 py-3 text-sm font-heading font-bold rounded-2xl whitespace-normal break-words overflow-hidden active:scale-95 bg-gradient-to-r from-red-600 to-rose-900 hover:opacity-90 shadow-lg shadow-red-600/20"
                  >
                    <Skull className="w-4 h-4 mr-1.5 shrink-0" />
                    <span className="block min-w-0 max-w-full whitespace-normal break-words text-center leading-tight">
                      {lang === "de" ? "Nicht geschafft" : "Not completed"}
                    </span>
                  </Button>
                </div>
                <SkipButton />
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-8">
                <div className="text-center text-sm font-heading font-bold text-amber-400 mb-1">
                  {lang === "de" ? "Traust du dich? Du kannst die Aufgabe jederzeit überspringen." : "Want to try? You can skip this challenge at any time."}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={
                      handleRiskAccept
                    }
                    className="min-h-14 h-auto min-w-0 px-2 py-3 text-sm font-heading font-bold rounded-2xl whitespace-normal break-words overflow-hidden active:scale-95 bg-gradient-to-r from-amber-500 to-red-600 hover:opacity-90 shadow-lg shadow-amber-500/20"
                  >
                    <Flame className="w-4 h-4 mr-1.5 shrink-0" />
                    <span className="block min-w-0 max-w-full whitespace-normal break-words text-center leading-tight">
                      {t(
                        lang,
                        "hc_risk_accept"
                      )}
                    </span>
                  </Button>
                  <Button
                    onClick={
                      handleRiskDecline
                    }
                    variant="outline"
                    className="min-h-14 h-auto min-w-0 px-2 py-3 text-sm font-heading font-bold rounded-2xl whitespace-normal break-words overflow-hidden border-2 border-muted hover:bg-muted/10"
                  >
                    <span className="block min-w-0 max-w-full whitespace-normal break-words text-center leading-tight">
                      {lang === "de" ? "Nicht mitmachen" : "Pass"}
                    </span>
                  </Button>
                </div>
                <SkipButton />
              </div>
            )}
          </div>
        ) : isDoubleChallenge &&
          !partnerName ? (
          <div className="w-full">
            <GroupDecisionPicker
              players={
                players
              }
              onPick={
                handlePartnerPick
              }
              title={
                t(
                  lang,
                  "hc_double_challenge"
                )
              }
              subtitle={
                t(
                  lang,
                  "hc_double_challenge_desc"
                )
              }
              excludeName={
                currentPlayerName
              }
            />
            <div className="mt-3">
              <SkipButton />
            </div>
          </div>
        ) : (
          <>
            <PlayerIndicator
              currentPlayer={
                currentPlayer
              }
            />
            {isDoubleChallenge &&
              partnerName && (
                <div className="text-center mb-4">
                  <p className="text-sm font-heading font-bold text-cyan-400 flex items-center justify-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {
                        currentPlayerName
                      }{" "}
                      &{" "}
                      {
                        partnerName
                      }
                    </span>
                  </p>
                </div>
              )}
            <AnimatePresence mode="wait">
              <QuestionCard
                question={
                  currentQuestion
                }
                questionIndex={
                  questionIndex
                }
                totalQuestions={
                  shuffled.length
                }
              />
            </AnimatePresence>
            <ActionButtons
              question={
                currentQuestion
              }
              onAnswer={
                handleAnswer
              }
              onSkip={
                handleSkip
              }
              onBlackoutYes={
                handleBlackoutYes
              }
              onBlackoutAvoid={
                handleBlackoutAvoid
              }
              hotMode={
                effectiveHotMode
              }
              hardcoreMode={
                effectiveHardcoreMode
              }
              hasJoker={
                !!jokers[
                  currentPlayerName
                ]
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
