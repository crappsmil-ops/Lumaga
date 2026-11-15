const STORAGE_KEY = "trinkluma_custom_decks";
const LEGACY_KEY = "trinkluma_custom_deck";

import { filterCards, checkContent } from "@/lib/contentFilter";

const SPECIAL_MODES = new Set(["wkw", "pantomime", "never"]);

export function getCustomCardMode(card) {
  const mode = String(card?.mode || "").trim().toLowerCase();
  return SPECIAL_MODES.has(mode) ? mode : "classic";
}

function safeText(value) {
  const text = typeof value === "string" ? value.trim() : "";
  return text && checkContent(text).ok ? text : "";
}

function normalizeOption(option) {
  if (typeof option === "string") {
    return option.trim();
  }

  if (option && typeof option === "object") {
    const value =
      option.text ??
      option.label?.de ??
      option.label?.en ??
      "";

    return typeof value === "string" ? value.trim() : "";
  }

  return "";
}

function createImportedCardId(index) {
  return `custom_import_${Date.now()}_${index}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function getDecks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.map((deck) => ({
        ...deck,

        /*
         * Alte und neue Decks sind standardmäßig lokal aktiv.
         * Die Multiplayer-Eigenschaft bleibt für eine mögliche
         * spätere Reaktivierung erhalten, wird aber in "Mein Deck"
         * nicht mehr angezeigt.
         */
        active: deck?.active !== false,

        multiplayer: Boolean(deck?.multiplayer),

        cards: Array.isArray(deck?.cards) ? deck.cards : [],
      }));
    }

    // Migration vom alten flachen Format
    const legacy = localStorage.getItem(LEGACY_KEY);

    if (legacy) {
      const cards = JSON.parse(legacy);

      if (Array.isArray(cards) && cards.length > 0) {
        const migrated = [
          {
            id: "default",
            name: "Mein Deck",
            active: true,
            cards,
          },
        ];

        saveDecks(migrated);
        localStorage.removeItem(LEGACY_KEY);

        return migrated;
      }
    }

    return [];
  } catch {
    return [];
  }
}

export function saveDecks(decks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

/*
 * Klassische Karten:
 * Alte Karten ohne "mode" gelten automatisch als klassische Karten.
 * Dadurch bleiben bestehende Decks vollständig kompatibel.
 */
export function getActiveCards() {
  return getDecks()
    .filter((deck) => deck.active)
    .flatMap((deck) =>
      (Array.isArray(deck.cards) ? deck.cards : []).filter(
        (card) => getCustomCardMode(card) === "classic"
      )
    );
}

// Abwärtskompatibel: flache Liste aller aktiven klassischen Karten
export function getCustomDeck() {
  return getActiveCards();
}

/*
 * Aktive eigene Inhalte für einen bestimmten lokalen Spezialmodus.
 * __runtimeId wird nur zur Laufzeit ergänzt und nicht gespeichert.
 */
export function getCustomModeCards(mode) {
  const wanted = String(mode || "").trim().toLowerCase();

  if (!SPECIAL_MODES.has(wanted)) {
    return [];
  }

  return getDecks()
    .filter((deck) => deck.active)
    .flatMap((deck) =>
      (Array.isArray(deck.cards) ? deck.cards : []).flatMap(
        (card, index) => {
          if (getCustomCardMode(card) !== wanted) {
            return [];
          }

          const storedId =
            typeof card?.id === "string" && card.id.trim()
              ? card.id.trim()
              : `legacy_${index}`;

          return [
            {
              ...card,
              mode: wanted,
              __deckId: deck.id,
              __runtimeId: `${deck.id}__${storedId}`,
            },
          ];
        }
      )
    );
}

export function createDeck(name, visibility = "private") {
  const decks = getDecks();

  const newDeck = {
    id: `deck_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: name || "Neues Deck",
    active: true,
    multiplayer: false,
    visibility,
    cards: [],
  };

  const updated = [...decks, newDeck];

  saveDecks(updated);

  return updated;
}

export function renameDeck(id, name) {
  const updated = getDecks().map((deck) =>
    deck.id === id ? { ...deck, name } : deck
  );

  saveDecks(updated);

  return updated;
}

export function toggleDeck(id) {
  const updated = getDecks().map((deck) =>
    deck.id === id
      ? {
          ...deck,
          active: !Boolean(deck.active),
        }
      : deck
  );

  saveDecks(updated);

  return updated;
}

export function deleteDeck(id) {
  const updated = getDecks().filter((deck) => deck.id !== id);

  saveDecks(updated);

  return updated;
}

export function addCardToDeck(deckId, card) {
  const updated = getDecks().map((deck) =>
    deck.id === deckId
      ? {
          ...deck,
          cards: [
            ...(Array.isArray(deck.cards) ? deck.cards : []),
            card,
          ],
        }
      : deck
  );

  saveDecks(updated);

  return updated;
}

export function updateCardInDeck(deckId, cardIndex, card) {
  const updated = getDecks().map((deck) =>
    deck.id === deckId
      ? {
          ...deck,
          cards: (Array.isArray(deck.cards) ? deck.cards : []).map(
            (current, index) => (index === cardIndex ? card : current)
          ),
        }
      : deck
  );

  saveDecks(updated);

  return updated;
}

export function removeCardFromDeck(deckId, cardIndex) {
  const updated = getDecks().map((deck) =>
    deck.id === deckId
      ? {
          ...deck,
          cards: (Array.isArray(deck.cards) ? deck.cards : []).filter(
            (_, index) => index !== cardIndex
          ),
        }
      : deck
  );

  saveDecks(updated);

  return updated;
}

// Abwärtskompatibel: alte addToDeck/removeFromDeck flach
export function addToDeck(question) {
  let decks = getDecks();

  if (decks.length === 0) {
    decks = createDeck("Mein Deck");
  }

  const target = decks.find((deck) => deck.active) || decks[0];

  return addCardToDeck(target.id, question);
}

export function removeFromDeck(index) {
  const decks = getDecks();

  if (decks.length === 0) {
    return decks;
  }

  const target = decks.find((deck) => deck.active) || decks[0];

  return removeCardFromDeck(target.id, index);
}

// Teilen: kompakter UTF-8-Base64-Code.
// Alte Codes bleiben weiterhin importierbar.

function encodeDeckPayload(payload) {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);

  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function decodeDeckPayload(code) {
  const cleaned = String(code || "").trim();

  if (!cleaned) {
    throw new Error("empty_code");
  }

  try {
    const binary = atob(cleaned);

    const bytes = Uint8Array.from(
      binary,
      (char) => char.charCodeAt(0)
    );

    const json = new TextDecoder("utf-8", { fatal: true }).decode(bytes);

    return JSON.parse(json);
  } catch {
    // Kompatibilität mit alten Trinkluma-Codes
    return JSON.parse(
      decodeURIComponent(
        atob(cleaned)
      )
    );
  }
}

function sanitizeImportedCard(card, index) {
  if (
    !card ||
    typeof card !== "object" ||
    Array.isArray(card)
  ) {
    return null;
  }

  const text = safeText(card.text);

  if (!text) {
    return null;
  }

  const mode = getCustomCardMode(card);

  const next = {
    ...card,
    id:
      typeof card.id === "string" && card.id.trim()
        ? card.id.trim()
        : createImportedCardId(index),
    text,
    isCustom: true,
    mode,
  };

  if (mode === "classic") {
    next.type = card.type === "action" ? "action" : undefined;
    next.category = next.type === "action" ? "action" : 1;
    delete next.options;

    return next;
  }

  delete next.type;
  delete next.category;

  if (mode === "wkw") {
    const options = (Array.isArray(card.options) ? card.options : [])
      .map(normalizeOption)
      .filter(Boolean)
      .filter((option) => checkContent(option).ok)
      .slice(0, 4);

    if (options.length < 2) {
      return null;
    }

    next.options = options;

    return next;
  }

  delete next.options;

  return next;
}

export function exportDeck(deckId) {
  const deck = getDecks().find(
    (item) => item.id === deckId
  );

  if (!deck) {
    return "";
  }

  return encodeDeckPayload({
    n: deck.name,
    v: deck.visibility || "private",
    c: deck.cards,
  });
}

export function importDeck(code) {
  try {
    const payload = decodeDeckPayload(code);

    // Ein syntaktisch gültiger Base64/JSON-Text ist noch kein Deck.
    if (
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload) ||
      typeof payload.n !== "string" ||
      !payload.n.trim() ||
      !Array.isArray(payload.c)
    ) {
      return null;
    }

    /*
     * Klassische Karten laufen weiterhin durch die bestehende
     * filterCards-Logik. Die neuen Spezialkarten werden mit
     * derselben checkContent-Prüfung validiert, die auch der
     * Editor in "Mein Deck" verwendet.
     */
    const classicCards = payload.c.filter(
      (card) =>
        card &&
        typeof card === "object" &&
        !Array.isArray(card) &&
        getCustomCardMode(card) === "classic"
    );

    const filteredClassic =
      filterCards(classicCards);

    const allowedClassicTexts =
      new Set(
        (
          Array.isArray(filteredClassic)
            ? filteredClassic
            : []
        )
          .map((card) =>
            typeof card?.text === "string"
              ? card.text.trim()
              : ""
          )
          .filter(Boolean)
      );

    const safeCards = payload.c
      .filter(
        (card) =>
          card &&
          typeof card === "object" &&
          !Array.isArray(card) &&
          typeof card.text === "string" &&
          (
            getCustomCardMode(card) !==
              "classic" ||
            allowedClassicTexts.has(
              card.text.trim()
            )
          )
      )
      .map(sanitizeImportedCard)
      .filter(Boolean);

    const decks = getDecks();

    const newDeck = {
      id: `deck_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`,

      name: payload.n || "Importiertes Deck",

      active: true,
      multiplayer: false,

      visibility: payload.v || "private",

      cards: safeCards,
    };

    const updated = [
      ...decks,
      newDeck,
    ];

    saveDecks(updated);

    return updated;
  } catch {
    return null;
  }
}
