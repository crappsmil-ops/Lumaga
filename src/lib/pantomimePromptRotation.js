// Local-only Pantomime history: a started game reserves ten distinct card IDs.
// Excluding the previous three games prevents repeats across four consecutive games.
export const PANTOMIME_HISTORY_KEY = "trinkluma_pantomime_recent_games_v1";
const HISTORY_SIZE = 3;

function readHistory(storage) {
  const raw = storage.getItem(PANTOMIME_HISTORY_KEY);
  if (raw === null) return [];
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Der Pantomime-Kartenverlauf ist beschädigt.");
  }
  if (!Array.isArray(parsed) || !parsed.every((game) =>
    game && Array.isArray(game.promptIds) &&
    game.promptIds.every((id) => typeof id === "string")
  )) {
    throw new Error("Der Pantomime-Kartenverlauf ist ungültig.");
  }
  return parsed.slice(-HISTORY_SIZE);
}

function shuffled(items, random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const sampled = Number(random());
    if (!Number.isFinite(sampled) || sampled < 0 || sampled >= 1) {
      throw new Error("Ungültiger Zufallswert für die Pantomime-Kartenauswahl.");
    }
    const j = Math.floor(sampled * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function reservePantomimePrompts(pool, numberOfPrompts, storage = globalThis.localStorage, random = Math.random) {
  if (!storage || !Number.isInteger(numberOfPrompts) || numberOfPrompts < 1) {
    throw new Error("Pantomime-Kartenverlauf kann nicht gespeichert werden.");
  }
  const unique = new Map();
  for (const prompt of pool) {
    if (!prompt?.id || unique.has(prompt.id)) {
      throw new Error("Pantomime-Karten enthalten fehlende oder doppelte IDs.");
    }
    unique.set(prompt.id, prompt);
  }
  const history = readHistory(storage);
  const excluded = new Set(history.flatMap((game) => game.promptIds));
  const available = [...unique.values()].filter((prompt) => !excluded.has(prompt.id));
  if (available.length < numberOfPrompts) {
    throw new Error("Zu wenige neue Pantomime-Karten für drei Spiele ohne Wiederholung.");
  }
  const selected = shuffled(available, random).slice(0, numberOfPrompts);
  // Reserve before play. Aborted games count; storage failure never silently permits repeats.
  storage.setItem(PANTOMIME_HISTORY_KEY, JSON.stringify([
    ...history,
    { promptIds: selected.map((prompt) => prompt.id) },
  ].slice(-HISTORY_SIZE)));
  return selected;
}

export function rememberRestoredPantomimePrompts(promptIds, storage = globalThis.localStorage) {
  if (!storage || !Array.isArray(promptIds) || !promptIds.length ||
      !promptIds.every((id) => typeof id === "string")) return;
  const history = readHistory(storage);
  // An existing session must not count as another game after a reload.
  if (history.some((game) =>
    game.promptIds.length === promptIds.length &&
    game.promptIds.every((id, i) => id === promptIds[i])
  )) return;
  storage.setItem(PANTOMIME_HISTORY_KEY, JSON.stringify([
    ...history,
    { promptIds: [...promptIds] },
  ].slice(-HISTORY_SIZE)));
}
