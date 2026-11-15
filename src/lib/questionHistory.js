const STORAGE_KEY =
  "trinkluma_question_history_v1";

const MAX_HISTORY_GAMES =
  3;

function normalizeText(
  value
) {
  return String(
    value || ""
  )
    .trim()
    .toLowerCase()
    .replace(
      /\\s+/g,
      " "
    );
}

export function getQuestionHistoryKey(
  question
) {
  if (!question) {
    return "";
  }

  const text =
    normalizeText(
      question?.text ||
        question?.question ||
        question?.title ||
        question?.prompt ||
        ""
    );

  const type =
    normalizeText(
      question?.type ||
        ""
    );

  const category =
    normalizeText(
      question?.category ||
        ""
    );

  if (!text) {
    return "";
  }

  return [
    type,
    category,
    text,
  ].join("|");
}

function readHistory() {
  try {
    if (
      typeof window ===
        "undefined" ||
      !window.localStorage
    ) {
      return [];
    }

    const raw =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (!raw) {
      return [];
    }

    const parsed =
      JSON.parse(raw);

    if (
      !Array.isArray(parsed)
    ) {
      return [];
    }

    return parsed
      .filter(
        (entry) =>
          entry &&
          Array.isArray(
            entry.keys
          )
      )
      .slice(
        0,
        MAX_HISTORY_GAMES
      );
  } catch {
    return [];
  }
}

function writeHistory(
  history
) {
  try {
    if (
      typeof window ===
        "undefined" ||
      !window.localStorage
    ) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        history.slice(
          0,
          MAX_HISTORY_GAMES
        )
      )
    );
  } catch {
    // Verlauf darf niemals
    // ein Spiel blockieren.
  }
}

export function getRecentQuestionKeys() {
  const history =
    readHistory();

  const keys =
    new Set();

  history.forEach(
    (entry) => {
      entry.keys.forEach(
        (key) => {
          const safeKey =
            String(
              key || ""
            )
              .trim()
              .toLowerCase();

          if (safeKey) {
            keys.add(
              safeKey
            );
          }
        }
      );
    }
  );

  return Array.from(
    keys
  );
}

export function rememberGameQuestions(
  questions,
  gameId
) {
  const safeQuestions =
    Array.isArray(
      questions
    )
      ? questions
      : [];

  const keys =
    Array.from(
      new Set(
        safeQuestions
          .map(
            getQuestionHistoryKey
          )
          .filter(Boolean)
      )
    );

  if (
    keys.length === 0
  ) {
    return;
  }

  const safeGameId =
    String(
      gameId ||
        `game_${Date.now()}`
    );

  let history =
    readHistory();

  /*
   * Dasselbe Spiel darf durch
   * React-Neuladen/Remount nicht
   * mehrfach gezählt werden.
   */
  history =
    history.filter(
      (entry) =>
        String(
          entry?.id || ""
        ) !== safeGameId
    );

  history.unshift({
    id:
      safeGameId,

    createdAt:
      Date.now(),

    keys,
  });

  writeHistory(
    history.slice(
      0,
      MAX_HISTORY_GAMES
    )
  );
}
