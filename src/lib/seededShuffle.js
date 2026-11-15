import {
  getQuestionHistoryKey,
} from "@/lib/questionHistory";

export function seededShuffle(
  array,
  seed
) {
  const arr = [...array];

  let s =
    (seed >>> 0) ||
    12345;

  for (
    let i =
      arr.length - 1;
    i > 0;
    i--
  ) {
    s =
      (
        Math.imul(
          s,
          1664525
        ) +
        1013904223
      ) >>>
      0;

    const j =
      s %
      (i + 1);

    [
      arr[i],
      arr[j],
    ] = [
      arr[j],
      arr[i],
    ];
  }

  return arr;
}

export function getQuestionLimit(
  playerCount,
  options = {}
) {
  const {
    mode = "free",
    multiplayer = false,
    premium = false,
  } = options;

  /*
   * DEINE bereits gewünschte Multiplayer-
   * Fragenanzahl hier so lassen, wie du sie
   * vorher eingestellt hast.
   *
   * Falls du sie bereits geändert hattest,
   * übernimm hier exakt deinen bisherigen Wert.
   */
  if (multiplayer) {
    return premium
      ? playerCount * 8
      : playerCount * 5;
  }

  if (mode === "hardcore") {
    return Math.max(
      30,
      playerCount * 8
    );
  }

  if (mode === "hot") {
    return Math.max(
      30,
      playerCount * 8
    );
  }

  return Math.max(
    30,
    playerCount * 8
  );
}

/*
 * Erzeugt aus einer Frage einen stabilen
 * Vergleichsschlüssel.
 *
 * Wichtig:
 * Nicht primär die ID verwenden.
 * Zwei identische Fragen können unterschiedliche
 * IDs besitzen.
 */
function getQuestionKey(
  question
) {
  const text =
    String(
      question?.text ||
      question?.question ||
      question?.title ||
      question?.prompt ||
      ""
    )
      .trim()
      .toLowerCase()
      .replace(
        /\s+/g,
        " "
      );

  const type =
    String(
      question?.type ||
      ""
    )
      .trim()
      .toLowerCase();

  const category =
    String(
      question?.category ||
      ""
    )
      .trim()
      .toLowerCase();

  /*
   * Wenn Text vorhanden ist, reicht dieser
   * zusammen mit Typ/Kategorie als eindeutige
   * inhaltliche Kennung.
   */
  if (text) {
    return [
      type,
      category,
      text,
    ].join("|");
  }

  /*
   * Nur als Fallback die ID benutzen,
   * wenn wirklich kein Fragetext vorhanden ist.
   */
  return String(
    question?.id ||
    JSON.stringify(
      question ||
      {}
    )
  )
    .trim()
    .toLowerCase();
}

function removeDuplicateQuestions(
  questions
) {
  const seen =
    new Set();

  return (
    Array.isArray(
      questions
    )
      ? questions
      : []
  ).filter(
    (question) => {
      const key =
        getQuestionKey(
          question
        );

      if (!key) {
        return true;
      }

      if (
        seen.has(key)
      ) {
        return false;
      }

      seen.add(key);

      return true;
    }
  );
}

function isSuitableForPlayerCount(
  question,
  playerCount
) {
  /*
   * Falls deine bestehende Datei hier bereits
   * eine umfangreichere Prüfung hatte,
   * diese Funktion bitte NICHT durch diese
   * vereinfachte Variante ersetzen.
   *
   * Diese Fallback-Prüfung lässt normale Fragen zu.
   */
  if (!question) {
    return false;
  }

  const minPlayers =
    Number(
      question?.minPlayers ??
      question?.min_players ??
      0
    );

  if (
    Number.isFinite(
      minPlayers
    ) &&
    minPlayers > 0 &&
    playerCount <
      minPlayers
  ) {
    return false;
  }

  return true;
}

export function buildQuestionDeck(
  hotMode,
  seed,
  customQuestions,
  lang,
  playerCount,
  hardcoreMode,
  options = {},
  pools
) {
  const resolvedPools =
    pools || {};

  const q =
    resolvedPools.questions ||
    [];

  const hq =
    resolvedPools.hotQuestions ||
    [];

  const hcq =
    resolvedPools.hardcoreQuestions ||
    [];

  let pool = [
    ...q,
  ];

  if (hotMode) {
    pool = [
      ...pool,
      ...hq,
    ];
  }

  if (
    hardcoreMode
  ) {
    const filtered =
      hcq.filter(
        (c) =>
          !c.type ||
          (
            c.type !==
              "group_decision" &&
            c.type !==
              "double_challenge" &&
            c.type !==
              "risk_card" &&
            c.type !==
              "blackout"
          )
      );

    pool = [
      ...pool,
      ...filtered,
    ];
  }

  /*
   * Erst ungeeignete Fragen entfernen.
   */
  pool =
    pool.filter(
      (c) =>
        isSuitableForPlayerCount(
          c,
          playerCount
        )
    );

  /*
   * WICHTIG:
   * Dubletten VOR Shuffle und VOR slice()
   * entfernen.
   *
   * Dadurch:
   * - keine identischen Fragen im Spiel
   * - gewünschte Deckgröße bleibt erhalten,
   *   sofern genug unterschiedliche Fragen da sind
   */
  pool =
    removeDuplicateQuestions(
      pool
    );

  /*
   * Vom Host übergebene Fragen
   * aus den letzten 3 Spielen
   * vor dem Shuffle entfernen.
   */
    const excludedQuestionKeySet =
    new Set(
      (
        Array.isArray(
          options
            ?.excludedQuestionKeys
        )
          ? options
              .excludedQuestionKeys
          : []
      )
        .map(
          (key) =>
            String(
              key || ""
            )
              .trim()
              .toLowerCase()
        )
        .filter(Boolean)
    );

  if (
    excludedQuestionKeySet.size >
    0
  ) {
    const modeForLimit =
      hardcoreMode
        ? "hardcore"
        : hotMode
          ? "hot"
          : "free";

    const requiredMinimum =
      getQuestionLimit(
        playerCount,
        {
          mode: modeForLimit,
          multiplayer:
            options.multiplayer ||
            false,
          premium:
            options.premium ||
            false,
        }
      );

    const withoutHistory =
      pool.filter(
        (question) =>
          !excludedQuestionKeySet.has(
            getQuestionHistoryKey(
              question
            )
          )
      );

    if (
      withoutHistory.length >=
      requiredMinimum
    ) {
      pool = withoutHistory;
    } else {
      console.warn(
        "Frageverlauf-Filter übersprungen: zu wenige Fragen übrig",
        {
          available:
            withoutHistory.length,
          required:
            requiredMinimum,
        }
      );
    }
  }

  const shuffled =
    seededShuffle(
      pool,
      seed
    );

  const mode =
    hardcoreMode
      ? "hardcore"
      : hotMode
        ? "hot"
        : "free";

  const limit =
    getQuestionLimit(
      playerCount,
      {
        mode,
        multiplayer:
          options.multiplayer ||
          false,
        premium:
          options.premium ||
          false,
      }
    );

  const customCards =
    Array.isArray(customQuestions)
      ? customQuestions.filter(Boolean)
      : [];

  /*
   * Alle eigenen Karten müssen im
   * finalen Multiplayer-Deck bleiben.
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
    shuffled.slice(
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
}