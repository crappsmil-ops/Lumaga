import { neverPrompts } from "./neverPrompts";
import { reserveNeverPrompts } from "./neverPromptRotation";
import { getCustomModeCards } from "./customDeck";

export const NEVER_ROUNDS = 10;
export const NEVER_SESSION_KEY = "trinkluma_never_session_v1";
export const PARTY_ROSTER_KEY = "trinkluma_party_mode_players_v1";

const STAGES = new Set(["handoff", "answer", "reveal"]);

function shuffleItems(items, random = Math.random) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function getCustomNeverPrompts() {
  return getCustomModeCards("never")
    .map((card) => {
      const text =
        typeof card?.text === "string"
          ? card.text.trim()
          : "";

      if (!text) {
        return null;
      }

      return {
        id: `custom_never_${card.__runtimeId}`,
        de: text,
        en: text,
      };
    })
    .filter(Boolean);
}

function getNeverPromptPool() {
  return [
    ...neverPrompts,
    ...getCustomNeverPrompts(),
  ];
}

function getNeverPromptsById() {
  return new Map(
    getNeverPromptPool().map((prompt) => [prompt.id, prompt])
  );
}

export function validNeverPlayers(input) {
  if (
    !Array.isArray(input) ||
    input.length < 2 ||
    input.length > 20
  ) {
    return [];
  }

  const players = input.map((player) => ({
    name:
      typeof player?.name === "string"
        ? player.name.trim()
        : "",
    avatar:
      typeof player?.avatar === "string"
        ? player.avatar
        : "🎉",
  }));

  if (
    players.some((player) => !player.name) ||
    new Set(players.map((player) => player.name)).size !== players.length
  ) {
    return [];
  }

  return players;
}

export function createNeverGame(
  input,
  random = Math.random,
  storage = globalThis.localStorage
) {
  const players = validNeverPlayers(input);
  const customPrompts = getCustomNeverPrompts();

  if (
    !players.length ||
    neverPrompts.length < NEVER_ROUNDS
  ) {
    return null;
  }

  const customCount = Math.min(
    customPrompts.length,
    Math.floor(NEVER_ROUNDS / 2)
  );

  const standardCount =
    NEVER_ROUNDS - customCount;

  const selectedStandard = reserveNeverPrompts(
    neverPrompts,
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
    promptIds: selected.map(
      (prompt) => prompt.id
    ),
    round: 0,
    stage: "handoff",
    answerIndex: 0,
    answers: {},
    scores: Object.fromEntries(
      players.map((player) => [
        player.name,
        0,
      ])
    ),
  };
}

export function restoreNeverGame(raw, routePlayers = null) {
  if (
    !raw ||
    typeof raw !== "object" ||
    raw.version !== 1
  ) {
    return null;
  }

  const players = validNeverPlayers(raw.players);

  if (
    !players.length ||
    (
      routePlayers &&
      JSON.stringify(
        validNeverPlayers(routePlayers)
      ) !== JSON.stringify(players)
    )
  ) {
    return null;
  }

  const promptById = getNeverPromptsById();

  if (
    !Array.isArray(raw.promptIds) ||
    raw.promptIds.length !== NEVER_ROUNDS ||
    new Set(raw.promptIds).size !== NEVER_ROUNDS ||
    raw.promptIds.some(
      (id) => !promptById.has(id)
    )
  ) {
    return null;
  }

  if (
    !Number.isInteger(raw.round) ||
    raw.round < 0 ||
    raw.round >= NEVER_ROUNDS ||
    !STAGES.has(raw.stage)
  ) {
    return null;
  }

  if (
    !Number.isInteger(raw.answerIndex) ||
    raw.answerIndex < 0 ||
    raw.answerIndex > players.length ||
    (
      raw.stage !== "reveal" &&
      raw.answerIndex === players.length
    )
  ) {
    return null;
  }

  if (
    !raw.answers ||
    typeof raw.answers !== "object" ||
    Array.isArray(raw.answers) ||
    Object.keys(raw.answers).length !== raw.answerIndex
  ) {
    return null;
  }

  if (
    players.some((player, index) =>
      index < raw.answerIndex
        ? typeof raw.answers[player.name] !== "boolean"
        : Object.prototype.hasOwnProperty.call(
            raw.answers,
            player.name
          )
    )
  ) {
    return null;
  }

  if (
    raw.stage === "reveal" &&
    raw.answerIndex !== players.length
  ) {
    return null;
  }

  if (
    !raw.scores ||
    typeof raw.scores !== "object" ||
    players.some(
      (player) =>
        !Number.isSafeInteger(
          raw.scores[player.name]
        ) ||
        raw.scores[player.name] < 0 ||
        raw.scores[player.name] >
          raw.round + 1
    )
  ) {
    return null;
  }

  return {
    version: 1,
    players,
    promptIds: [...raw.promptIds],
    round: raw.round,
    stage: raw.stage,
    answerIndex: raw.answerIndex,
    answers: Object.fromEntries(
      players
        .slice(0, raw.answerIndex)
        .map((player) => [
          player.name,
          raw.answers[player.name],
        ])
    ),
    scores: Object.fromEntries(
      players.map((player) => [
        player.name,
        raw.scores[player.name],
      ])
    ),
  };
}

export function currentNeverPrompt(game) {
  if (!game) {
    return null;
  }

  return (
    getNeverPromptsById().get(
      game.promptIds[game.round]
    ) || null
  );
}

export function currentNeverPlayer(game) {
  return (
    game?.players?.[
      game?.answerIndex
    ] || null
  );
}

export function advanceNeverGame(game, action) {
  if (!game) {
    return game;
  }

  if (
    game.stage === "handoff" &&
    action?.type === "READY"
  ) {
    return {
      ...game,
      stage: "answer",
    };
  }

  if (
    game.stage === "answer" &&
    action?.type === "ANSWER" &&
    typeof action.didIt === "boolean"
  ) {
    const player =
      currentNeverPlayer(game);

    if (
      !player ||
      Object.prototype.hasOwnProperty.call(
        game.answers,
        player.name
      )
    ) {
      return game;
    }

    const answerIndex =
      game.answerIndex + 1;

    return {
      ...game,
      answerIndex,
      stage:
        answerIndex ===
        game.players.length
          ? "reveal"
          : "handoff",
      answers: {
        ...game.answers,
        [player.name]:
          action.didIt,
      },
      scores: {
        ...game.scores,
        [player.name]:
          game.scores[player.name] +
          (action.didIt ? 1 : 0),
      },
    };
  }

  if (
    game.stage === "reveal" &&
    action?.type === "NEXT"
  ) {
    if (
      game.round + 1 ===
      NEVER_ROUNDS
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
      answerIndex: 0,
      answers: {},
    };
  }

  return game;
}

export function neverResults(game) {
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
    gameMode: "ich_habe_noch_nie",
    alcoholFree: true,
  };
}