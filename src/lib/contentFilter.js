// Einfacher Filter gegen diskriminierende Inhalte in selbst erstellten Karten.
// Prüft auf rassistische, sexistische, homophobe, transphobe, ableistische
// und andere hassmotivierte Begriffe (DE + EN).

const BANNED_TERMS = [
  // Rassistisch / fremdenfeindlich
  "neger", "nigger", "nigga", "kanake", "kanacken", "wogs", "wog", "paki",
  "schlitzauge", "schlitzaugen", "negerkuß", "negerkuss", "zigeuner", "gypsy",
  "mohr", "mohren", "rasse", "rassen", "racial", "subhuman", "untermensch",
  "untermenschen", "volksverrater", "reichsbürger", "nazi", "nazis", "neo-nazi",
  "neonazi", "neonazis", "kzk", "kz", "juden", "jude", "judenboykott", "holocaustleugnung",
  "holocaustleugner", "shoa-leugner", "antisemit", "antisemitisch", "antisemitismus",
  "judenhass", "allahu akbar", "kameltreiber", "biodeutsch", "biodeutsche",
  "biodeutscher", "rechtsdeutsch", "passportgerman", "passdeutsch",

  // Sexistisch / misogyn
  "schlampe", "schlampen", "hure", "huren", "nutte", "nutten", "fotze", "fotzen",
  "bitch", "bitches", "whore", "whores", "slut", "sluts", "cunt", "bimbo",
  "weibchen", "männchen", "rape", "rapeable", "vergewaltigung", "vergewaltigen",
  "vergewaltigt", "notstand", "notständer", "notstander", "notstandsjoker",
  "frauenfeindlich", "misogyn", "misogynie", "bitchslap", "wifebeater",

  // Homophob / transphob
  "schwuchtel", "schwuchteln", "schwuchtel", "tunte", "tunten", "lesbe", "lesben",
  "faggot", "faggots", "fag", "fags", "dyke", "dykes", "tranny", "trannies",
  "schwul", "schwule", "schwuler", "schwulsein", "homo", "homos", "homo-seksuell",
  "transen", "transe", "männerkleidung", "frauenkleidung", "geschlechtsumwandlung",
  "geschlechtskrankheit", "schwulenhass", "transenhass", "schwuchteljunge",

  // Ableistisch
  "spasti", "spast", "spasten", "spastis", "idiot", "idioten", "idiotin",
  "behindert", "behinderte", "behinderten", "behindertes", "geistig behindert",
  "geistig behinderte", "mongoloid", "mongoloide", "mongolismus", "down-syndrom",
  "trisomie 21", "krippel", "krüppel", "krüppel", "lahm", "lahme", "stumm",
  "stumme", "taub", "taube", "taubstumm", "taubstumme", "retard", "retarded",
  "retardet", "spasst", "spasstard", "behinderung", "spastisch", "minderbegabt",
  "minderbegabte", "blödmann", "blödmann", "dumm", "dumme", "dummkopf", "dummköpfe",

  // Islamophob / religionsfeindlich
  "mohammedaner", "mohammedanisch", "muslime", "moslem", "moslems", "moslemtisch",
  "muslime", "islamfeindlich", "islamophob", "islamhass", "kopftuchweib",
  "kopftuchmädchen", "barbar", "barbaren", "terrorist", "terroristen",
  "bombenleger", "selbstmordattentäter", "allahs vergeltung", "allahs strafe",

  // Hass / Gewalt
  "töten", "umbringen", "umgebracht", "erschiessen", "erschlagen", "erstechen",
  "kill", "kill him", "kill her", "kill them", "murder", "mord", "morden",
  "massaker", "massacre", "genozid", "genocide", "ethnic cleansing",
  "ethnische säuberung", "lynchen", "lynch", "lynching", "vergasen", "vergast",
  "vergassen", "kammer", "gaskammer", "gaskammern", "krematorium", "krematorien",
  "verhungern lassen", "aushungern", "folter", "foltern", "gefoltert",
  "torture", "tortured", "brandstiftung", "brandschatzen", "brandstifter",
  "kinderpornografie", "kinderporno", "kinderpornos", "kinderpornographie",
  "child porn", "kinderficker", "kinderfick", "pädophil", "pädophiler",
  "pedophile", "pedophilia", "kindesmissbrauch", "kindesmißbrauch",

  // Körperlich / Aussehen
  "fett", "fettes", "fettwanst", "fettsack", "fettarsch", "fettes schwein",
  "fat", "fatty", "fatso", "fatass", "lardass", "pig", "piggy", "schwein",
  "schweine", "dick", "dicke", "dickchen", "dickfett", "fettleibig",
  "magersucht", "magersüchtig", "magersüchtige", "anorexia", "anorexic",
  "bulimie", "bulimisch", "bulimie-esser", "brechmittel",

  // Sonstige
  "obdachlos", "obdachlose", "obdachlosen", "penner", "pennerschwein",
  "asylant", "asylanten", "asylantenschwein", "asylbewerber", "asylbetrüger",
  "flüchtling", "flüchtlinge", "flüchtlingspaket", "flüchtlingswelle",
  "flüchtlingsflut", "flüchtlingskrise", "asylmissbrauch", "asylchaos",
  "asylschande", "asylantenflut", "flüchtlingsflut", "überfremdung",
  "remigration", "remigrate", "volksverräter", "volksverrat",
];

// Leichte Normalisierung: Kleinbuchstaben, mehrere Leerzeichen, Bindestriche
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[–—]/g, "-")
    .trim();
}

// Prüft einen Text auf diskriminierende Begriffe.
// Gibt { ok: true } oder { ok: false, reason: string } zurück.
export function checkContent(text) {
  if (!text || !text.trim()) return { ok: true };
  const normalized = normalize(text);

  for (const term of BANNED_TERMS) {
    // Wortgrenzen-Prüfung, um Teil-Treffer zu vermeiden (z.B. "Idiot" in "Idiotikon")
    const pattern = new RegExp(`(^|[^a-zäöüß])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-zäöüß]|$)`, "i");
    if (pattern.test(normalized)) {
      return { ok: false, reason: term };
    }
  }

  return { ok: true };
}

// Filtert ein Array von Karten und gibt nur die akzeptablen zurück.
export function filterCards(cards) {
  if (!Array.isArray(cards)) return [];
  return cards.filter((c) => c && c.text && checkContent(c.text).ok);
}