import { pantomimePrompts } from "./pantomimePrompts";
import { reservePantomimePrompts } from "./pantomimePromptRotation";
import { getCustomModeCards } from "./customDeck";

export const PANTOMIME_ROUNDS = 10;
export const PANTOMIME_SECONDS = 60;
export const PANTOMIME_SESSION_KEY = "trinkluma_pantomime_session_v1";
export const PARTY_ROSTER_KEY = "trinkluma_party_mode_players_v1";

const STAGES = new Set(["handoff", "acting", "chooseGuesser", "reveal"]);

function shuffleItems(items, random = Math.random) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function getCustomPantomimePrompts() {
  return getCustomModeCards("pantomime")
    .map((card) => {
      const text =
        typeof card?.text === "string"
          ? card.text.trim()
          : "";

      if (!text) {
        return null;
      }

      return {
        id: `custom_pantomime_${card.__runtimeId}`,
        de: text,
        en: text,
        category: "custom",
      };
    })
    .filter(Boolean);
}

function getPantomimePool() {
  return [
    ...pantomimePrompts,
    ...getCustomPantomimePrompts(),
  ];
}

function getPromptsById() {
  return new Map(
    getPantomimePool().map((prompt) => [prompt.id, prompt])
  );
}

export function validPlayers(input) {
  if (!Array.isArray(input)) return [];

  const players = input.map((player) => ({
    name:
      typeof player?.name === "string"
        ? player.name.trim()
        : "",
    avatar:
      typeof player?.avatar === "string"
        ? player.avatar
        : "🎭",
  }));

  if (players.length < 2 || players.length > 20) {
    return [];
  }

  if (
    players.some((player) => !player.name) ||
    new Set(players.map((player) => player.name)).size !== players.length
  ) {
    return [];
  }

  return players;
}

export function createPantomimeGame(
  inputPlayers,
  random = Math.random,
  storage = globalThis.localStorage
) {
  const players = validPlayers(inputPlayers);
  const customPrompts = getCustomPantomimePrompts();

  if (
    !players.length ||
    pantomimePrompts.length < PANTOMIME_ROUNDS
  ) {
    return null;
  }

  const customCount = Math.min(
    customPrompts.length,
    Math.floor(PANTOMIME_ROUNDS / 2)
  );

  const standardCount =
    PANTOMIME_ROUNDS - customCount;

  const selectedStandard = reservePantomimePrompts(
    pantomimePrompts,
    standardCount,
    storage,
    random
  );

  const selectedCustom = shuffleItems(
    customPrompts,
    random
  ).slice(0, customCount);

  const selected = shuffleItems(
    [...selectedStandard, ...selectedCustom],
    random
  );

  return {
    version: 1,
    players,
    promptIds: selected.map((prompt) => prompt.id),
    round: 0,
    stage: "handoff",
    deadline: null,
    outcome: null,
    guessedBy: null,
    scores: Object.fromEntries(
      players.map((player) => [player.name, 0])
    ),
  };
}

export function restorePantomimeGame(raw, routePlayers = null) {
  if (
    !raw ||
    typeof raw !== "object" ||
    raw.version !== 1
  ) {
    return null;
  }

  const players = validPlayers(raw.players);

  if (!players.length) {
    return null;
  }

  if (
    routePlayers &&
    JSON.stringify(validPlayers(routePlayers)) !== JSON.stringify(players)
  ) {
    return null;
  }

  const promptsById = getPromptsById();

  if (
    !Array.isArray(raw.promptIds) ||
    raw.promptIds.length !== PANTOMIME_ROUNDS ||
    new Set(raw.promptIds).size !== PANTOMIME_ROUNDS ||
    raw.promptIds.some((id) => !promptsById.has(id))
  ) {
    return null;
  }

  if (
    !Number.isInteger(raw.round) ||
    raw.round < 0 ||
    raw.round >= PANTOMIME_ROUNDS ||
    !STAGES.has(raw.stage)
  ) {
    return null;
  }

  if (
    !raw.scores ||
    typeof raw.scores !== "object" ||
    players.some(
      (player) =>
        !Number.isSafeInteger(raw.scores[player.name]) ||
        raw.scores[player.name] < 0
    )
  ) {
    return null;
  }

  if (
    raw.stage === "acting" &&
    (!Number.isFinite(raw.deadline) || raw.deadline <= 0)
  ) {
    return null;
  }

  if (
    raw.stage !== "acting" &&
    raw.deadline !== null
  ) {
    return null;
  }

  if (
    raw.stage === "reveal" &&
    !["solved", "missed"].includes(raw.outcome)
  ) {
    return null;
  }

  if (
    raw.stage === "chooseGuesser" &&
    raw.outcome !== null
  ) {
    return null;
  }

  return {
    version: 1,
    players,
    promptIds: [...raw.promptIds],
    round: raw.round,
    stage: raw.stage,
    deadline: raw.deadline,
    outcome:
      raw.stage === "reveal"
        ? raw.outcome
        : null,
    guessedBy:
      raw.stage === "reveal" &&
      raw.outcome === "solved"
        ? raw.guessedBy
        : null,
    scores: Object.fromEntries(
      players.map((player) => [
        player.name,
        raw.scores[player.name],
      ])
    ),
  };
}

export function secondsLeft(game, now = Date.now()) {
  if (!game || game.stage !== "acting") {
    return 0;
  }

  return Math.max(
    0,
    Math.ceil((game.deadline - now) / 1000)
  );
}

export function currentPrompt(game) {
  if (!game) {
    return null;
  }

  return (
    getPromptsById().get(
      game.promptIds[game.round]
    ) || null
  );
}

export function currentActor(game) {
  return game
    ? game.players[
        game.round % game.players.length
      ]
    : null;
}

export function advancePantomime(game, action, now = Date.now()) {
  if (!game) {
    return game;
  }

  if (
    game.stage === "handoff" &&
    action?.type === "START"
  ) {
    return {
      ...game,
      stage: "acting",
      deadline:
        now +
        PANTOMIME_SECONDS * 1000,
    };
  }

  if (game.stage === "acting") {
    if (
      action?.type === "SOLVED" &&
      secondsLeft(game, now) > 0
    ) {
      return {
        ...game,
        stage: "chooseGuesser",
        deadline: null,
      };
    }

    if (action?.type === "MISS") {
      return {
        ...game,
        stage: "reveal",
        deadline: null,
        outcome: "missed",
        guessedBy: null,
      };
    }
  }

  if (
    game.stage === "chooseGuesser" &&
    action?.type === "AWARD"
  ) {
    const guesserName = action.guesserName;
    const actorName = currentActor(game).name;

    if (
      !game.players.some(
        (player) => player.name === guesserName
      ) ||
      guesserName === actorName
    ) {
      return game;
    }

    return {
      ...game,
      stage: "reveal",
      outcome: "solved",
      guessedBy: guesserName,
      scores: {
        ...game.scores,
        [actorName]:
          game.scores[actorName] + 1,
        [guesserName]:
          game.scores[guesserName] + 1,
      },
    };
  }

  if (
    game.stage === "reveal" &&
    action?.type === "NEXT"
  ) {
    if (
      game.round + 1 >=
      PANTOMIME_ROUNDS
    ) {
      return {
        ...game,
        stage: "finished",
      };
    }

    return {
      ...game,
      round: game.round + 1,
      stage: "handoff",
      deadline: null,
      outcome: null,
      guessedBy: null,
    };
  }

  return game;
}

export function pantomimeResults(game) {
  if (
    !game ||
    game.stage !== "finished"
  ) {
    return null;
  }

  return {
    scores: Object.fromEntries(
      game.players.map((player) => [
        player.name,
        {
          points:
            game.scores[player.name],
          sips: 0,
          strips: 0,
        },
      ])
    ),
    players: game.players.map(
      (player) => ({
        name: player.name,
        avatar: player.avatar,
      })
    ),
    playerKeys: game.players.map(
      (player) => player.name
    ),
    gameMode: "pantomime",
    alcoholFree: true,
  };
}