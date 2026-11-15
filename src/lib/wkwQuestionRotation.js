// Local-only WKW history. Each STARTED game reserves its 10 question IDs.
// Excluding the previous 3 games means no card repeats in 4 consecutive games.
export const WKW_HISTORY_KEY = "trinkluma_wkw_recent_games_v1";
const HISTORY_SIZE = 3;

function readHistory(storage) {
  const raw = storage.getItem(WKW_HISTORY_KEY);
  if (raw === null) return [];
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Der WKW-Fragenverlauf ist beschädigt.");
  }
  if (!Array.isArray(parsed) || !parsed.every((game) =>
    game && Array.isArray(game.questionIds) &&
    game.questionIds.every((id) => typeof id === "string")
  )) {
    throw new Error("Der WKW-Fragenverlauf ist ungültig.");
  }
  return parsed.slice(-HISTORY_SIZE);
}

function shuffled(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function reserveWkwQuestions(pool, numberOfQuestions, storage = globalThis.localStorage) {
  if (!storage || !Number.isInteger(numberOfQuestions) || numberOfQuestions < 1) {
    throw new Error("Fragenverlauf kann nicht gespeichert werden.");
  }
  const unique = new Map();
  for (const question of pool) {
    if (!question?.id || unique.has(question.id)) {
      throw new Error("WKW-Fragen enthalten fehlende oder doppelte IDs.");
    }
    unique.set(question.id, question);
  }
  const history = readHistory(storage);
  const excluded = new Set(history.flatMap((game) => game.questionIds));
  const available = [...unique.values()].filter((question) => !excluded.has(question.id));
  if (available.length < numberOfQuestions) {
    throw new Error("Zu wenige neue Fragen für drei Spiele ohne Wiederholung.");
  }
  const selected = shuffled(available).slice(0, numberOfQuestions);
  // Reserve before play: aborting or reloading may not make questions eligible again.
  // If localStorage fails, do NOT quietly break the no-repeat guarantee.
  storage.setItem(WKW_HISTORY_KEY, JSON.stringify([
    ...history,
    { questionIds: selected.map((question) => question.id) },
  ].slice(-HISTORY_SIZE)));
  return selected;
}

export function rememberRestoredWkwQuestions(questionIds, storage = globalThis.localStorage) {
  if (!storage || !Array.isArray(questionIds) || !questionIds.length ||
      !questionIds.every((id) => typeof id === "string")) return;
  const history = readHistory(storage);
  // Existing game may predate this update. Do not reserve it a second time.
  if (history.some((game) =>
    game.questionIds.length === questionIds.length &&
    game.questionIds.every((id, i) => id === questionIds[i])
  )) return;
  storage.setItem(WKW_HISTORY_KEY, JSON.stringify([
    ...history,
    { questionIds: [...questionIds] },
  ].slice(-HISTORY_SIZE)));
}
