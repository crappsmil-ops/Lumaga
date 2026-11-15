// Each started local game reserves 10 IDs; the previous three games are excluded.
export const NEVER_HISTORY_KEY = "trinkluma_never_recent_games_v1";
const HISTORY_SIZE = 3;

function readHistory(storage) {
  const raw = storage.getItem(NEVER_HISTORY_KEY);
  if (raw === null) return [];
  let parsed;
  try { parsed = JSON.parse(raw); }
  catch { throw new Error("Der Ich-habe-noch-nie-Kartenverlauf ist beschädigt."); }
  if (!Array.isArray(parsed) || !parsed.every((game) =>
    game && Array.isArray(game.promptIds) && game.promptIds.length > 0 &&
    game.promptIds.every((id) => typeof id === "string" && id.length > 0)
  )) {
    throw new Error("Der Ich-habe-noch-nie-Kartenverlauf ist ungültig.");
  }
  return parsed.slice(-HISTORY_SIZE);
}

function shuffle(items, random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const n = Number(random());
    if (!Number.isFinite(n) || n < 0 || n >= 1) throw new Error("Ungültiger Zufallswert.");
    const j = Math.floor(n * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function reserveNeverPrompts(pool, count, storage = globalThis.localStorage, random = Math.random) {
  if (!storage || !Number.isInteger(count) || count < 1 || !Array.isArray(pool)) {
    throw new Error("Kartenauswahl konnte nicht gespeichert werden.");
  }
  const byId = new Map();
  for (const prompt of pool) {
    if (!prompt?.id || typeof prompt.id !== "string" || byId.has(prompt.id)) {
      throw new Error("Fehlende oder doppelte Karten-ID.");
    }
    byId.set(prompt.id, prompt);
  }
  const history = readHistory(storage);
  const excluded = new Set(history.flatMap((game) => game.promptIds));
  const available = [...byId.values()].filter((prompt) => !excluded.has(prompt.id));
  if (available.length < count) throw new Error("Zu wenige ungespielte Karten für die Wiederholungssperre.");
  const selected = shuffle(available, random).slice(0, count);
  // Reserve before the round starts. An abandoned game still counts.
  storage.setItem(NEVER_HISTORY_KEY, JSON.stringify([
    ...history,
    { promptIds: selected.map((prompt) => prompt.id) },
  ].slice(-HISTORY_SIZE)));
  return selected;
}

export function rememberRestoredNeverPrompts(promptIds, storage = globalThis.localStorage) {
  if (!storage || !Array.isArray(promptIds) || promptIds.length === 0 ||
      !promptIds.every((id) => typeof id === "string" && id.length > 0)) return;
  const history = readHistory(storage);
  if (history.some((game) => game.promptIds.length === promptIds.length &&
    game.promptIds.every((id, i) => id === promptIds[i]))) return;
  // Restore missing history without reserving the same saved game twice.
  storage.setItem(NEVER_HISTORY_KEY, JSON.stringify([
    ...history,
    { promptIds: [...promptIds] },
  ].slice(-HISTORY_SIZE)));
}
