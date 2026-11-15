// Local-only Bluff history. Each STARTED game reserves its 10 prompt IDs.
// Excluding the previous 3 games means no card repeats in 4 consecutive games.
export const BLUFF_HISTORY_KEY = "trinkluma_bluff_recent_games_v1";
const HISTORY_SIZE = 3;

function readHistory(storage) {
  const raw = storage.getItem(BLUFF_HISTORY_KEY);
  if (raw === null) return [];
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Der Bluff-Erzählaufgabenverlauf ist beschädigt.");
  }
  if (!Array.isArray(parsed) || !parsed.every((game) =>
    game && Array.isArray(game.promptIds) &&
    game.promptIds.every((id) => typeof id === "string")
  )) {
    throw new Error("Der Bluff-Erzählaufgabenverlauf ist ungültig.");
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

export function reserveBluffPrompts(pool, numberOfPrompts, storage = globalThis.localStorage) {
  if (!storage || !Number.isInteger(numberOfPrompts) || numberOfPrompts < 1) {
    throw new Error("Erzählaufgabenverlauf kann nicht gespeichert werden.");
  }
  const unique = new Map();
  for (const prompt of pool) {
    if (!prompt?.id || unique.has(prompt.id)) {
      throw new Error("Bluff-Erzählaufgaben enthalten fehlende oder doppelte IDs.");
    }
    unique.set(prompt.id, prompt);
  }
  const history = readHistory(storage);
  const excluded = new Set(history.flatMap((game) => game.promptIds));
  const available = [...unique.values()].filter((prompt) => !excluded.has(prompt.id));
  if (available.length < numberOfPrompts) {
    throw new Error("Zu wenige neue Erzählaufgaben für drei Spiele ohne Wiederholung.");
  }
  const selected = shuffled(available).slice(0, numberOfPrompts);
  // Reserve before play: aborting or reloading may not make prompts eligible again.
  // If localStorage fails, do NOT quietly break the no-repeat guarantee.
  storage.setItem(BLUFF_HISTORY_KEY, JSON.stringify([
    ...history,
    { promptIds: selected.map((prompt) => prompt.id) },
  ].slice(-HISTORY_SIZE)));
  return selected;
}

export function rememberRestoredBluffPrompts(promptIds, storage = globalThis.localStorage) {
  if (!storage || !Array.isArray(promptIds) || !promptIds.length ||
      !promptIds.every((id) => typeof id === "string")) return;
  const history = readHistory(storage);
  // Existing game may predate this update. Do not reserve it a second time.
  if (history.some((game) =>
    game.promptIds.length === promptIds.length &&
    game.promptIds.every((id, i) => id === promptIds[i])
  )) return;
  storage.setItem(BLUFF_HISTORY_KEY, JSON.stringify([
    ...history,
    { promptIds: [...promptIds] },
  ].slice(-HISTORY_SIZE)));
}
