// Lazy loader for the large question pools.
// Importing this module does NOT eagerly load questions.js / questionsEN.js;
// they are only fetched when loadQuestionPools() is called (i.e. when Game or
// MultiplayerGame mounts).
export async function loadQuestionPools(lang) {
  const [de, en] = await Promise.all([
    import("@/lib/questions"),
    import("@/lib/questionsEN"),
  ]);
  return {
    CATEGORY_CONFIG: de.CATEGORY_CONFIG,
    SPECIAL_TYPES: de.SPECIAL_TYPES,
    questions: lang === "en" ? en.questionsEN : de.questions,
    hotQuestions: lang === "en" ? en.hotQuestionsEN : de.hotQuestions,
    hardcoreQuestions: lang === "en" ? en.hardcoreQuestionsEN : de.hardcoreQuestions,
  };
}