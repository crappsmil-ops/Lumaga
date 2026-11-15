export const relationshipQuizQuestions = [
  {
    id: "rq_beach_city",
    prompt: {
      de: (name) => `Was würde ${name} eher wählen?`,
      en: (name) => `What would ${name} rather choose?`,
    },
    options: [
      { id: "a", label: { de: "Strandurlaub", en: "Beach vacation" } },
      { id: "b", label: { de: "Städtetrip", en: "City trip" } },
    ],
  },
  {
    id: "rq_morning_evening",
    prompt: {
      de: (name) => `Ist ${name} eher ein Morgen- oder ein Abendmensch?`,
      en: (name) => `Is ${name} more of a morning or an evening person?`,
    },
    options: [
      { id: "a", label: { de: "Morgenmensch", en: "Morning person" } },
      { id: "b", label: { de: "Abendmensch", en: "Evening person" } },
    ],
  },
  {
    id: "rq_pizza_topping",
    prompt: {
      de: (name) => `Welchen Pizza-Belag würde ${name} am ehesten wählen?`,
      en: (name) => `Which pizza topping would ${name} most likely choose?`,
    },
    options: [
      { id: "a", label: { de: "Salami", en: "Pepperoni" } },
      { id: "b", label: { de: "Vegetarisch", en: "Vegetarian" } },
      { id: "c", label: { de: "Hawaii (Ananas)", en: "Hawaiian (pineapple)" } },
    ],
  },
  {
    id: "rq_superpower",
    prompt: {
      de: (name) => `Welche Superkraft würde sich ${name} am ehesten wünschen?`,
      en: (name) => `Which superpower would ${name} most likely wish for?`,
    },
    options: [
      { id: "a", label: { de: "Fliegen", en: "Flying" } },
      { id: "b", label: { de: "Unsichtbarkeit", en: "Invisibility" } },
      { id: "c", label: { de: "Gedanken lesen", en: "Reading minds" } },
    ],
  },
  {
    id: "rq_vacation_style",
    prompt: {
      de: (name) => `Wie plant ${name} am liebsten einen Urlaub?`,
      en: (name) => `How does ${name} prefer to plan a vacation?`,
    },
    options: [
      { id: "a", label: { de: "Bis ins Detail durchgeplant", en: "Planned down to the last detail" } },
      { id: "b", label: { de: "Spontan, ohne Plan", en: "Spontaneous, no plan" } },
    ],
  },
  {
    id: "rq_movie_genre",
    prompt: {
      de: (name) => `Welches Film-Genre schaut sich ${name} am liebsten an?`,
      en: (name) => `Which movie genre does ${name} like watching most?`,
    },
    options: [
      { id: "a", label: { de: "Komödie", en: "Comedy" } },
      { id: "b", label: { de: "Horror", en: "Horror" } },
      { id: "c", label: { de: "Drama", en: "Drama" } },
    ],
  },
  {
    id: "rq_lottery",
    prompt: {
      de: (name) => `Was würde ${name} zuerst mit einem Lottogewinn machen?`,
      en: (name) => `What would ${name} do first with lottery winnings?`,
    },
    options: [
      { id: "a", label: { de: "Reisen", en: "Travel" } },
      { id: "b", label: { de: "Sparen/Investieren", en: "Save/invest" } },
      { id: "c", label: { de: "Freunden & Familie etwas schenken", en: "Give gifts to friends & family" } },
    ],
  },
  {
    id: "rq_pet",
    prompt: {
      de: (name) => `Welches Haustier würde ${name} sich am ehesten zulegen?`,
      en: (name) => `Which pet would ${name} most likely get?`,
    },
    options: [
      { id: "a", label: { de: "Hund", en: "Dog" } },
      { id: "b", label: { de: "Katze", en: "Cat" } },
      { id: "c", label: { de: "Kein Haustier", en: "No pet" } },
    ],
  },
  {
    id: "rq_karaoke",
    prompt: {
      de: (name) => `Würde ${name} beim Karaoke eher singen oder sich verstecken?`,
      en: (name) => `At karaoke, would ${name} rather sing or hide?`,
    },
    options: [
      { id: "a", label: { de: "Singen", en: "Sing" } },
      { id: "b", label: { de: "Verstecken", en: "Hide" } },
    ],
  },
  {
    id: "rq_breakfast",
    prompt: {
      de: (name) => `Was isst ${name} am liebsten zum Frühstück?`,
      en: (name) => `What does ${name} like to eat for breakfast most?`,
    },
    options: [
      { id: "a", label: { de: "Süß (z.B. Müsli, Pancakes)", en: "Sweet (e.g. cereal, pancakes)" } },
      { id: "b", label: { de: "Herzhaft (z.B. Brot, Eier)", en: "Savory (e.g. bread, eggs)" } },
    ],
  },
  {
    id: "rq_conflict_style",
    prompt: {
      de: (name) => `Wie geht ${name} am ehesten mit Streit um?`,
      en: (name) => `How does ${name} most likely handle conflict?`,
    },
    options: [
      { id: "a", label: { de: "Direkt ansprechen", en: "Address it directly" } },
      { id: "b", label: { de: "Erstmal Abstand gewinnen", en: "Take some distance first" } },
    ],
  },
  {
    id: "rq_weekend",
    prompt: {
      de: (name) => `Wie verbringt ${name} am liebsten ein freies Wochenende?`,
      en: (name) => `How does ${name} like to spend a free weekend?`,
    },
    options: [
      { id: "a", label: { de: "Draußen aktiv sein", en: "Active outdoors" } },
      { id: "b", label: { de: "Zuhause entspannen", en: "Relax at home" } },
      { id: "c", label: { de: "Mit Freunden unterwegs", en: "Out with friends" } },
    ],
  },
  {
    id: "rq_music",
    prompt: {
      de: (name) => `Welche Musikrichtung hört ${name} am meisten?`,
      en: (name) => `Which music genre does ${name} listen to most?`,
    },
    options: [
      { id: "a", label: { de: "Pop", en: "Pop" } },
      { id: "b", label: { de: "Hip-Hop/Rap", en: "Hip-hop/Rap" } },
      { id: "c", label: { de: "Rock/Metal", en: "Rock/Metal" } },
    ],
  },
  {
    id: "rq_new_skill",
    prompt: {
      de: (name) => `Welche Fähigkeit würde ${name} am liebsten sofort können?`,
      en: (name) => `Which skill would ${name} most like to instantly have?`,
    },
    options: [
      { id: "a", label: { de: "Ein Instrument spielen", en: "Play an instrument" } },
      { id: "b", label: { de: "Eine neue Sprache sprechen", en: "Speak a new language" } },
      { id: "c", label: { de: "Kochen wie ein Profi", en: "Cook like a pro" } },
    ],
  },
  {
    id: "rq_fear",
    prompt: {
      de: (name) => `Wovor hat ${name} am ehesten Angst?`,
      en: (name) => `What is ${name} most likely afraid of?`,
    },
    options: [
      { id: "a", label: { de: "Spinnen/Insekten", en: "Spiders/insects" } },
      { id: "b", label: { de: "Höhe", en: "Heights" } },
      { id: "c", label: { de: "Vor Publikum sprechen", en: "Public speaking" } },
    ],
  },
  {
    id: "rq_phone_habit",
    prompt: {
      de: (name) => `Was macht ${name} morgens zuerst nach dem Aufwachen?`,
      en: (name) => `What does ${name} do first after waking up?`,
    },
    options: [
      { id: "a", label: { de: "Handy checken", en: "Check phone" } },
      { id: "b", label: { de: "Aufstehen & aktiv werden", en: "Get up & be active" } },
      { id: "c", label: { de: "Nochmal snoozen", en: "Hit snooze again" } },
    ],
  },
  {
    id: "rq_extra_017",
    prompt: {
      de: (name) => `Welches Wetter macht ${name} am glücklichsten?`,
      en: (name) => `Which weather makes ${name} happiest?`,
    },
    options: [
      { id: "a", label: { de: "Sonnig", en: "Sunny" } },
      { id: "b", label: { de: "Regnerisch", en: "Rainy" } },
      { id: "c", label: { de: "Schnee", en: "Snowy" } },
    ],
  },
  {
    id: "rq_extra_018",
    prompt: {
      de: (name) => `Welche Jahreszeit würde ${name} gern verlängern?`,
      en: (name) => `Which season would ${name} like to make longer?`,
    },
    options: [
      { id: "a", label: { de: "Frühling", en: "Spring" } },
      { id: "b", label: { de: "Sommer", en: "Summer" } },
      { id: "c", label: { de: "Herbst", en: "Autumn" } },
      { id: "d", label: { de: "Winter", en: "Winter" } },
    ],
  },
  {
    id: "rq_extra_019",
    prompt: {
      de: (name) => `Welchen Ausflug würde ${name} am ehesten wählen?`,
      en: (name) => `Which outing would ${name} most likely choose?`,
    },
    options: [
      { id: "a", label: { de: "Zoo", en: "Zoo" } },
      { id: "b", label: { de: "Museum", en: "Museum" } },
      { id: "c", label: { de: "Freizeitpark", en: "Theme park" } },
    ],
  },
  {
    id: "rq_extra_020",
    prompt: {
      de: (name) => `Wie würde ${name} am liebsten eine unbekannte Stadt erkunden?`,
      en: (name) => `How would ${name} most like to explore a new city?`,
    },
    options: [
      { id: "a", label: { de: "Zu Fuß", en: "On foot" } },
      { id: "b", label: { de: "Mit dem Fahrrad", en: "By bike" } },
      { id: "c", label: { de: "Mit öffentlichen Verkehrsmitteln", en: "By public transport" } },
    ],
  },
  {
    id: "rq_extra_021",
    prompt: {
      de: (name) => `Welche Unterkunft würde ${name} bevorzugen?`,
      en: (name) => `Which accommodation would ${name} prefer?`,
    },
    options: [
      { id: "a", label: { de: "Hotel", en: "Hotel" } },
      { id: "b", label: { de: "Ferienwohnung", en: "Vacation rental" } },
      { id: "c", label: { de: "Camping", en: "Camping" } },
    ],
  },
  {
    id: "rq_extra_022",
    prompt: {
      de: (name) => `Was würde ${name} auf eine lange Zugfahrt mitnehmen?`,
      en: (name) => `What would ${name} bring on a long train ride?`,
    },
    options: [
      { id: "a", label: { de: "Ein Buch", en: "A book" } },
      { id: "b", label: { de: "Kopfhörer", en: "Headphones" } },
      { id: "c", label: { de: "Ein Kartenspiel", en: "A card game" } },
    ],
  },
  {
    id: "rq_extra_023",
    prompt: {
      de: (name) => `Was würde ${name} bei einem freien Nachmittag zuerst tun?`,
      en: (name) => `What would ${name} do first on a free afternoon?`,
    },
    options: [
      { id: "a", label: { de: "Spazieren gehen", en: "Go for a walk" } },
      { id: "b", label: { de: "Ein Nickerchen machen", en: "Take a nap" } },
      { id: "c", label: { de: "Etwas Kreatives machen", en: "Make something creative" } },
    ],
  },
  {
    id: "rq_extra_024",
    prompt: {
      de: (name) => `Wie würde ${name} lieber einen Geburtstag feiern?`,
      en: (name) => `How would ${name} rather celebrate a birthday?`,
    },
    options: [
      { id: "a", label: { de: "Große Party", en: "Big party" } },
      { id: "b", label: { de: "Kleines Essen", en: "Small dinner" } },
      { id: "c", label: { de: "Ausflug", en: "Day trip" } },
    ],
  },
  {
    id: "rq_extra_025",
    prompt: {
      de: (name) => `Welches Getränk würde ${name} morgens am ehesten wählen?`,
      en: (name) => `Which morning drink would ${name} most likely choose?`,
    },
    options: [
      { id: "a", label: { de: "Kaffee", en: "Coffee" } },
      { id: "b", label: { de: "Tee", en: "Tea" } },
      { id: "c", label: { de: "Saft", en: "Juice" } },
      { id: "d", label: { de: "Wasser", en: "Water" } },
    ],
  },
  {
    id: "rq_extra_026",
    prompt: {
      de: (name) => `Welche Süßigkeit würde ${name} zuerst nehmen?`,
      en: (name) => `Which treat would ${name} pick first?`,
    },
    options: [
      { id: "a", label: { de: "Schokolade", en: "Chocolate" } },
      { id: "b", label: { de: "Gummibärchen", en: "Gummy bears" } },
      { id: "c", label: { de: "Kekse", en: "Cookies" } },
    ],
  },
  {
    id: "rq_extra_027",
    prompt: {
      de: (name) => `Welches Gericht würde ${name} am liebsten selbst kochen?`,
      en: (name) => `Which dish would ${name} most like to cook?`,
    },
    options: [
      { id: "a", label: { de: "Pasta", en: "Pasta" } },
      { id: "b", label: { de: "Curry", en: "Curry" } },
      { id: "c", label: { de: "Burger", en: "Burgers" } },
    ],
  },
  {
    id: "rq_extra_028",
    prompt: {
      de: (name) => `Wie würde ${name} am liebsten einen Abend mit Freunden verbringen?`,
      en: (name) => `How would ${name} most like to spend an evening with friends?`,
    },
    options: [
      { id: "a", label: { de: "Brettspiele", en: "Board games" } },
      { id: "b", label: { de: "Gemeinsam kochen", en: "Cook together" } },
      { id: "c", label: { de: "Spazieren gehen", en: "Go for a walk" } },
    ],
  },
  {
    id: "rq_extra_029",
    prompt: {
      de: (name) => `Wofür würde ${name} einen Geschenkgutschein bevorzugen?`,
      en: (name) => `What kind of gift voucher would ${name} prefer?`,
    },
    options: [
      { id: "a", label: { de: "Buchladen", en: "Bookshop" } },
      { id: "b", label: { de: "Restaurant", en: "Restaurant" } },
      { id: "c", label: { de: "Erlebnis", en: "Experience" } },
    ],
  },
  {
    id: "rq_extra_030",
    prompt: {
      de: (name) => `Welche App würde ${name} am ehesten für einen Tag löschen?`,
      en: (name) => `Which app would ${name} be most willing to delete for a day?`,
    },
    options: [
      { id: "a", label: { de: "Social Media", en: "Social media" } },
      { id: "b", label: { de: "Streaming", en: "Streaming" } },
      { id: "c", label: { de: "Spiele", en: "Games" } },
    ],
  },
  {
    id: "rq_extra_031",
    prompt: {
      de: (name) => `Wie würde ${name} auf eine Nachricht um Mitternacht reagieren?`,
      en: (name) => `How would ${name} react to a message at midnight?`,
    },
    options: [
      { id: "a", label: { de: "Sofort antworten", en: "Reply immediately" } },
      { id: "b", label: { de: "Morgens antworten", en: "Reply in the morning" } },
      { id: "c", label: { de: "Nur bei Dringlichkeit", en: "Only if urgent" } },
    ],
  },
  {
    id: "rq_extra_032",
    prompt: {
      de: (name) => `Was wäre ${name} bei einem neuen Smartphone am wichtigsten?`,
      en: (name) => `What would matter most to ${name} in a new phone?`,
    },
    options: [
      { id: "a", label: { de: "Kamera", en: "Camera" } },
      { id: "b", label: { de: "Akkulaufzeit", en: "Battery life" } },
      { id: "c", label: { de: "Preis", en: "Price" } },
    ],
  },
  {
    id: "rq_extra_033",
    prompt: {
      de: (name) => `Welche Aufgabe im Haushalt würde ${name} eher übernehmen?`,
      en: (name) => `Which household chore would ${name} rather do?`,
    },
    options: [
      { id: "a", label: { de: "Kochen", en: "Cooking" } },
      { id: "b", label: { de: "Staubsaugen", en: "Vacuuming" } },
      { id: "c", label: { de: "Wäsche machen", en: "Laundry" } },
    ],
  },
  {
    id: "rq_extra_034",
    prompt: {
      de: (name) => `Welchen Raum würde ${name} zuerst neu gestalten?`,
      en: (name) => `Which room would ${name} redecorate first?`,
    },
    options: [
      { id: "a", label: { de: "Wohnzimmer", en: "Living room" } },
      { id: "b", label: { de: "Schlafzimmer", en: "Bedroom" } },
      { id: "c", label: { de: "Küche", en: "Kitchen" } },
    ],
  },
  {
    id: "rq_extra_035",
    prompt: {
      de: (name) => `Wie würde ${name} am liebsten einen Sonntag beginnen?`,
      en: (name) => `How would ${name} most like to start a Sunday?`,
    },
    options: [
      { id: "a", label: { de: "Gemütlich frühstücken", en: "Slow breakfast" } },
      { id: "b", label: { de: "Sport machen", en: "Exercise" } },
      { id: "c", label: { de: "Lange im Bett bleiben", en: "Stay in bed" } },
    ],
  },
  {
    id: "rq_extra_036",
    prompt: {
      de: (name) => `Was würde ${name} in einem Café bestellen?`,
      en: (name) => `What would ${name} order in a café?`,
    },
    options: [
      { id: "a", label: { de: "Kuchen", en: "Cake" } },
      { id: "b", label: { de: "Sandwich", en: "Sandwich" } },
      { id: "c", label: { de: "Nur ein Getränk", en: "Just a drink" } },
    ],
  },
  {
    id: "rq_extra_037",
    prompt: {
      de: (name) => `Welche Fortbewegung würde ${name} für den Arbeitsweg wählen?`,
      en: (name) => `Which commute would ${name} choose?`,
    },
    options: [
      { id: "a", label: { de: "Fahrrad", en: "Bicycle" } },
      { id: "b", label: { de: "Bus oder Bahn", en: "Bus or train" } },
      { id: "c", label: { de: "Auto", en: "Car" } },
      { id: "d", label: { de: "Zu Fuß", en: "Walking" } },
    ],
  },
  {
    id: "rq_extra_038",
    prompt: {
      de: (name) => `Was würde ${name} eher freiwillig lernen?`,
      en: (name) => `What would ${name} rather learn voluntarily?`,
    },
    options: [
      { id: "a", label: { de: "Fotografieren", en: "Photography" } },
      { id: "b", label: { de: "Programmieren", en: "Coding" } },
      { id: "c", label: { de: "Tanzen", en: "Dancing" } },
    ],
  },
  {
    id: "rq_extra_039",
    prompt: {
      de: (name) => `Welche Sportart würde ${name} lieber ausprobieren?`,
      en: (name) => `Which sport would ${name} rather try?`,
    },
    options: [
      { id: "a", label: { de: "Klettern", en: "Climbing" } },
      { id: "b", label: { de: "Schwimmen", en: "Swimming" } },
      { id: "c", label: { de: "Badminton", en: "Badminton" } },
    ],
  },
  {
    id: "rq_extra_040",
    prompt: {
      de: (name) => `Welche Aktivität würde ${name} bei Regen lieber machen?`,
      en: (name) => `What would ${name} rather do on a rainy day?`,
    },
    options: [
      { id: "a", label: { de: "Kino", en: "Cinema" } },
      { id: "b", label: { de: "Museum", en: "Museum" } },
      { id: "c", label: { de: "Zuhause spielen", en: "Play games at home" } },
    ],
  },
  {
    id: "rq_extra_041",
    prompt: {
      de: (name) => `Wie würde ${name} ein neues Rezept auswählen?`,
      en: (name) => `How would ${name} choose a new recipe?`,
    },
    options: [
      { id: "a", label: { de: "Nach Bildern", en: "By pictures" } },
      { id: "b", label: { de: "Nach Zutaten", en: "By ingredients" } },
      { id: "c", label: { de: "Nach Bewertungen", en: "By reviews" } },
    ],
  },
  {
    id: "rq_extra_042",
    prompt: {
      de: (name) => `Welches Tier würde ${name} gern einmal in freier Wildbahn sehen?`,
      en: (name) => `Which animal would ${name} love to see in the wild?`,
    },
    options: [
      { id: "a", label: { de: "Wal", en: "Whale" } },
      { id: "b", label: { de: "Bär", en: "Bear" } },
      { id: "c", label: { de: "Delfin", en: "Dolphin" } },
      { id: "d", label: { de: "Fuchs", en: "Fox" } },
    ],
  },
  {
    id: "rq_extra_043",
    prompt: {
      de: (name) => `Welche Form von Urlaub würde ${name} als Nächstes ausprobieren?`,
      en: (name) => `What kind of holiday would ${name} try next?`,
    },
    options: [
      { id: "a", label: { de: "Wandern", en: "Hiking" } },
      { id: "b", label: { de: "Wellness", en: "Spa retreat" } },
      { id: "c", label: { de: "Kulturreise", en: "Cultural trip" } },
    ],
  },
  {
    id: "rq_extra_044",
    prompt: {
      de: (name) => `Welche Art von Buch würde ${name} eher lesen?`,
      en: (name) => `What kind of book would ${name} rather read?`,
    },
    options: [
      { id: "a", label: { de: "Krimi", en: "Mystery" } },
      { id: "b", label: { de: "Fantasy", en: "Fantasy" } },
      { id: "c", label: { de: "Biografie", en: "Biography" } },
    ],
  },
  {
    id: "rq_extra_045",
    prompt: {
      de: (name) => `Welche Serie würde ${name} eher anfangen?`,
      en: (name) => `Which series would ${name} rather start?`,
    },
    options: [
      { id: "a", label: { de: "Comedy", en: "Comedy" } },
      { id: "b", label: { de: "Science-Fiction", en: "Science fiction" } },
      { id: "c", label: { de: "Dokumentation", en: "Documentary" } },
    ],
  },
  {
    id: "rq_extra_046",
    prompt: {
      de: (name) => `Was wäre ${name} bei einem Konzert am wichtigsten?`,
      en: (name) => `What would matter most to ${name} at a concert?`,
    },
    options: [
      { id: "a", label: { de: "Gute Sicht", en: "Good view" } },
      { id: "b", label: { de: "Guter Klang", en: "Good sound" } },
      { id: "c", label: { de: "Mit Freunden dort sein", en: "Being there with friends" } },
    ],
  },
  {
    id: "rq_extra_047",
    prompt: {
      de: (name) => `Welche Farbe würde ${name} für ein Fahrrad wählen?`,
      en: (name) => `Which color would ${name} pick for a bicycle?`,
    },
    options: [
      { id: "a", label: { de: "Schwarz", en: "Black" } },
      { id: "b", label: { de: "Rot", en: "Red" } },
      { id: "c", label: { de: "Blau", en: "Blue" } },
      { id: "d", label: { de: "Grün", en: "Green" } },
    ],
  },
  {
    id: "rq_extra_048",
    prompt: {
      de: (name) => `Welche Kleinigkeit würde ${name} am ehesten sammeln?`,
      en: (name) => `What small thing would ${name} most likely collect?`,
    },
    options: [
      { id: "a", label: { de: "Postkarten", en: "Postcards" } },
      { id: "b", label: { de: "Magnete", en: "Magnets" } },
      { id: "c", label: { de: "Sticker", en: "Stickers" } },
      { id: "d", label: { de: "Nichts", en: "Nothing" } },
    ],
  },
  {
    id: "rq_extra_049",
    prompt: {
      de: (name) => `Wie würde ${name} ein unbekanntes Spiel angehen?`,
      en: (name) => `How would ${name} approach an unfamiliar game?`,
    },
    options: [
      { id: "a", label: { de: "Regeln genau lesen", en: "Read the rules carefully" } },
      { id: "b", label: { de: "Einfach losspielen", en: "Just start playing" } },
      { id: "c", label: { de: "Andere erklären lassen", en: "Ask someone to explain" } },
    ],
  },
  {
    id: "rq_extra_050",
    prompt: {
      de: (name) => `Welche Rolle würde ${name} in einer Quizgruppe übernehmen?`,
      en: (name) => `Which role would ${name} take in a quiz team?`,
    },
    options: [
      { id: "a", label: { de: "Wissen liefern", en: "Provide answers" } },
      { id: "b", label: { de: "Zeit im Blick behalten", en: "Keep track of time" } },
      { id: "c", label: { de: "Team motivieren", en: "Motivate the team" } },
    ],
  },
  {
    id: "rq_extra_051",
    prompt: {
      de: (name) => `Was würde ${name} bei einem Stromausfall zuerst suchen?`,
      en: (name) => `What would ${name} look for first during a power cut?`,
    },
    options: [
      { id: "a", label: { de: "Taschenlampe", en: "Flashlight" } },
      { id: "b", label: { de: "Kerzen", en: "Candles" } },
      { id: "c", label: { de: "Powerbank", en: "Power bank" } },
    ],
  },
  {
    id: "rq_extra_052",
    prompt: {
      de: (name) => `Wofür würde ${name} eher einen freien Tag nutzen?`,
      en: (name) => `What would ${name} use a day off for?`,
    },
    options: [
      { id: "a", label: { de: "Aufräumen", en: "Tidy up" } },
      { id: "b", label: { de: "Ausflug", en: "Day trip" } },
      { id: "c", label: { de: "Ein neues Hobby", en: "New hobby" } },
    ],
  },
  {
    id: "rq_extra_053",
    prompt: {
      de: (name) => `Welche Challenge würde ${name} eher annehmen?`,
      en: (name) => `Which challenge would ${name} rather accept?`,
    },
    options: [
      { id: "a", label: { de: "Einen Tag ohne Handy", en: "One day without a phone" } },
      { id: "b", label: { de: "Eine Woche ohne Süßigkeiten", en: "A week without sweets" } },
      { id: "c", label: { de: "Jeden Tag spazieren", en: "Walk every day" } },
    ],
  },
  {
    id: "rq_extra_054",
    prompt: {
      de: (name) => `Welchen Ort würde ${name} gern nachts besuchen?`,
      en: (name) => `Which place would ${name} like to visit at night?`,
    },
    options: [
      { id: "a", label: { de: "Sternwarte", en: "Observatory" } },
      { id: "b", label: { de: "Strand", en: "Beach" } },
      { id: "c", label: { de: "Großstadt", en: "Big city" } },
    ],
  },
  {
    id: "rq_extra_055",
    prompt: {
      de: (name) => `Welche Sache würde ${name} lieber selbst reparieren?`,
      en: (name) => `Which item would ${name} rather repair themself?`,
    },
    options: [
      { id: "a", label: { de: "Fahrrad", en: "Bicycle" } },
      { id: "b", label: { de: "Kleidung", en: "Clothing" } },
      { id: "c", label: { de: "Möbel", en: "Furniture" } },
    ],
  },
  {
    id: "rq_extra_056",
    prompt: {
      de: (name) => `Wie würde ${name} ein Wochenende ohne Internet verbringen?`,
      en: (name) => `How would ${name} spend a weekend without internet?`,
    },
    options: [
      { id: "a", label: { de: "Lesen", en: "Reading" } },
      { id: "b", label: { de: "Draußen sein", en: "Be outdoors" } },
      { id: "c", label: { de: "Freunde besuchen", en: "Visit friends" } },
    ],
  },
  {
    id: "rq_extra_057",
    prompt: {
      de: (name) => `Was würde ${name} in einem Escape Room zuerst tun?`,
      en: (name) => `What would ${name} do first in an escape room?`,
    },
    options: [
      { id: "a", label: { de: "Alle Ecken absuchen", en: "Search every corner" } },
      { id: "b", label: { de: "Codes knacken", en: "Crack codes" } },
      { id: "c", label: { de: "Aufgaben verteilen", en: "Assign tasks" } },
    ],
  },
  {
    id: "rq_extra_058",
    prompt: {
      de: (name) => `Welche Art Überraschung würde ${name} mehr freuen?`,
      en: (name) => `Which surprise would ${name} enjoy more?`,
    },
    options: [
      { id: "a", label: { de: "Überraschungsbesuch", en: "Surprise visit" } },
      { id: "b", label: { de: "Kleine Aufmerksamkeit", en: "Small gift" } },
      { id: "c", label: { de: "Geplanter Ausflug", en: "Planned outing" } },
    ],
  },
  {
    id: "rq_extra_059",
    prompt: {
      de: (name) => `Wie würde ${name} eine lange Warteschlange überstehen?`,
      en: (name) => `How would ${name} cope with a long queue?`,
    },
    options: [
      { id: "a", label: { de: "Musik hören", en: "Listen to music" } },
      { id: "b", label: { de: "Mit jemandem reden", en: "Chat with someone" } },
      { id: "c", label: { de: "Geduldig beobachten", en: "People-watch patiently" } },
    ],
  },
  {
    id: "rq_extra_060",
    prompt: {
      de: (name) => `Was würde ${name} bei einem Flohmarkt zuerst suchen?`,
      en: (name) => `What would ${name} look for first at a flea market?`,
    },
    options: [
      { id: "a", label: { de: "Bücher", en: "Books" } },
      { id: "b", label: { de: "Kleidung", en: "Clothing" } },
      { id: "c", label: { de: "Deko", en: "Decorations" } },
    ],
  },
  {
    id: "rq_extra_061",
    prompt: {
      de: (name) => `Welchen Kurs würde ${name} spontan buchen?`,
      en: (name) => `Which course would ${name} book on a whim?`,
    },
    options: [
      { id: "a", label: { de: "Keramik", en: "Ceramics" } },
      { id: "b", label: { de: "Improtheater", en: "Improv theatre" } },
      { id: "c", label: { de: "Sushi machen", en: "Sushi making" } },
    ],
  },
  {
    id: "rq_extra_062",
    prompt: {
      de: (name) => `Welches kleine Talent hätte ${name} gern?`,
      en: (name) => `Which small talent would ${name} like to have?`,
    },
    options: [
      { id: "a", label: { de: "Perfekt pfeifen", en: "Whistle perfectly" } },
      { id: "b", label: { de: "Schnell zeichnen", en: "Draw quickly" } },
      { id: "c", label: { de: "Mit beiden Händen schreiben", en: "Write with both hands" } },
    ],
  },
  {
    id: "rq_extra_063",
    prompt: {
      de: (name) => `Womit würde ${name} eher jemanden aufmuntern?`,
      en: (name) => `How would ${name} rather cheer someone up?`,
    },
    options: [
      { id: "a", label: { de: "Witz erzählen", en: "Tell a joke" } },
      { id: "b", label: { de: "Zuhören", en: "Listen" } },
      { id: "c", label: { de: "Kleines Geschenk", en: "Small gift" } },
    ],
  },
  {
    id: "rq_extra_064",
    prompt: {
      de: (name) => `Welche Art von Rätsel mag ${name} am liebsten?`,
      en: (name) => `Which kind of puzzle does ${name} like most?`,
    },
    options: [
      { id: "a", label: { de: "Kreuzworträtsel", en: "Crosswords" } },
      { id: "b", label: { de: "Logikrätsel", en: "Logic puzzles" } },
      { id: "c", label: { de: "Bilderrätsel", en: "Picture puzzles" } },
    ],
  },
  {
    id: "rq_extra_065",
    prompt: {
      de: (name) => `Welche Aufgabe würde ${name} bei einem Picknick übernehmen?`,
      en: (name) => `What would ${name} bring to a picnic?`,
    },
    options: [
      { id: "a", label: { de: "Snacks", en: "Snacks" } },
      { id: "b", label: { de: "Getränke ohne Alkohol", en: "Non-alcoholic drinks" } },
      { id: "c", label: { de: "Decke und Spiele", en: "Blanket and games" } },
    ],
  },
  {
    id: "rq_extra_066",
    prompt: {
      de: (name) => `Welches Museum würde ${name} eher besuchen?`,
      en: (name) => `Which museum would ${name} rather visit?`,
    },
    options: [
      { id: "a", label: { de: "Naturkunde", en: "Natural history" } },
      { id: "b", label: { de: "Kunst", en: "Art" } },
      { id: "c", label: { de: "Technik", en: "Technology" } },
    ],
  },
  {
    id: "rq_extra_067",
    prompt: {
      de: (name) => `Was würde ${name} bei einem Kochduell zuerst entscheiden?`,
      en: (name) => `What would ${name} decide first in a cooking duel?`,
    },
    options: [
      { id: "a", label: { de: "Das Gericht", en: "The dish" } },
      { id: "b", label: { de: "Die Gewürze", en: "The spices" } },
      { id: "c", label: { de: "Die Präsentation", en: "The presentation" } },
    ],
  },
  {
    id: "rq_extra_068",
    prompt: {
      de: (name) => `Welche Art von Foto würde ${name} am liebsten machen?`,
      en: (name) => `What kind of photo would ${name} most like to take?`,
    },
    options: [
      { id: "a", label: { de: "Landschaft", en: "Landscape" } },
      { id: "b", label: { de: "Porträt", en: "Portrait" } },
      { id: "c", label: { de: "Schnappschuss", en: "Candid shot" } },
    ],
  },
  {
    id: "rq_extra_069",
    prompt: {
      de: (name) => `Welches Erlebnis würde ${name} eher verschenken?`,
      en: (name) => `Which experience would ${name} rather give as a gift?`,
    },
    options: [
      { id: "a", label: { de: "Theaterbesuch", en: "Theatre visit" } },
      { id: "b", label: { de: "Kletterpark", en: "Climbing park" } },
      { id: "c", label: { de: "Kochkurs", en: "Cooking class" } },
    ],
  },
  {
    id: "rq_extra_070",
    prompt: {
      de: (name) => `Wie würde ${name} am liebsten ein neues Land kennenlernen?`,
      en: (name) => `How would ${name} most like to get to know a new country?`,
    },
    options: [
      { id: "a", label: { de: "Essen probieren", en: "Try the food" } },
      { id: "b", label: { de: "Mit Menschen reden", en: "Talk to locals" } },
      { id: "c", label: { de: "Natur entdecken", en: "Explore nature" } },
    ],
  },
  {
    id: "rq_extra_071",
    prompt: {
      de: (name) => `Welche Aktivität würde ${name} bei einem Teamtag wählen?`,
      en: (name) => `Which activity would ${name} choose for a team day?`,
    },
    options: [
      { id: "a", label: { de: "Bowling", en: "Bowling" } },
      { id: "b", label: { de: "Escape Room", en: "Escape room" } },
      { id: "c", label: { de: "Gemeinsames Kochen", en: "Cooking together" } },
    ],
  },
  {
    id: "rq_extra_072",
    prompt: {
      de: (name) => `Welche Form von Musik würde ${name} live am liebsten hören?`,
      en: (name) => `What kind of music would ${name} most like to hear live?`,
    },
    options: [
      { id: "a", label: { de: "Akustikkonzert", en: "Acoustic gig" } },
      { id: "b", label: { de: "Orchester", en: "Orchestra" } },
      { id: "c", label: { de: "DJ-Set", en: "DJ set" } },
    ],
  },
  {
    id: "rq_extra_073",
    prompt: {
      de: (name) => `Was würde ${name} eher bei einem Talentabend zeigen?`,
      en: (name) => `What would ${name} rather perform at a talent night?`,
    },
    options: [
      { id: "a", label: { de: "Zaubertrick", en: "Magic trick" } },
      { id: "b", label: { de: "Gedicht", en: "Poem" } },
      { id: "c", label: { de: "Tanz", en: "Dance" } },
    ],
  },
  {
    id: "rq_extra_074",
    prompt: {
      de: (name) => `Welche Sache würde ${name} vor einer Reise besonders prüfen?`,
      en: (name) => `What would ${name} double-check before a trip?`,
    },
    options: [
      { id: "a", label: { de: "Tickets", en: "Tickets" } },
      { id: "b", label: { de: "Wetter", en: "Weather" } },
      { id: "c", label: { de: "Gepäck", en: "Luggage" } },
    ],
  },
  {
    id: "rq_extra_075",
    prompt: {
      de: (name) => `Welche Spielfigur würde ${name} in einem Fantasy-Spiel wählen?`,
      en: (name) => `Which character would ${name} choose in a fantasy game?`,
    },
    options: [
      { id: "a", label: { de: "Magier", en: "Wizard" } },
      { id: "b", label: { de: "Krieger", en: "Warrior" } },
      { id: "c", label: { de: "Heiler", en: "Healer" } },
      { id: "d", label: { de: "Entdecker", en: "Explorer" } },
    ],
  },
  {
    id: "rq_extra_076",
    prompt: {
      de: (name) => `Was würde ${name} bei einer Schatzsuche am liebsten machen?`,
      en: (name) => `What would ${name} most like to do on a treasure hunt?`,
    },
    options: [
      { id: "a", label: { de: "Karte lesen", en: "Read the map" } },
      { id: "b", label: { de: "Hinweise lösen", en: "Solve clues" } },
      { id: "c", label: { de: "Verstecke durchsuchen", en: "Search hiding places" } },
    ],
  },
  {
    id: "rq_extra_077",
    prompt: {
      de: (name) => `Welche Art von Geschenk verpackt ${name} lieber?`,
      en: (name) => `Which type of present would ${name} rather wrap?`,
    },
    options: [
      { id: "a", label: { de: "Kleine Schachtel", en: "Small box" } },
      { id: "b", label: { de: "Großes Paket", en: "Big parcel" } },
      { id: "c", label: { de: "Geschenktüte", en: "Gift bag" } },
    ],
  },
  {
    id: "rq_extra_078",
    prompt: {
      de: (name) => `Wie würde ${name} eine neue Sprache am liebsten üben?`,
      en: (name) => `How would ${name} most like to practise a new language?`,
    },
    options: [
      { id: "a", label: { de: "Mit Menschen sprechen", en: "Talk to people" } },
      { id: "b", label: { de: "Filme schauen", en: "Watch films" } },
      { id: "c", label: { de: "Mit einer App lernen", en: "Use an app" } },
    ],
  },
  {
    id: "rq_extra_079",
    prompt: {
      de: (name) => `Welche Pizza-Alternative würde ${name} eher wählen?`,
      en: (name) => `Which pizza alternative would ${name} rather choose?`,
    },
    options: [
      { id: "a", label: { de: "Flammkuchen", en: "Tarte flambée" } },
      { id: "b", label: { de: "Pasta", en: "Pasta" } },
      { id: "c", label: { de: "Salat", en: "Salad" } },
    ],
  },
  {
    id: "rq_extra_080",
    prompt: {
      de: (name) => `Was würde ${name} bei einem spontanen Besuch anbieten?`,
      en: (name) => `What would ${name} offer unexpected guests?`,
    },
    options: [
      { id: "a", label: { de: "Tee oder Kaffee", en: "Tea or coffee" } },
      { id: "b", label: { de: "Etwas Süßes", en: "Something sweet" } },
      { id: "c", label: { de: "Ein Spiel", en: "A game" } },
    ],
  },
  {
    id: "rq_extra_081",
    prompt: {
      de: (name) => `Welche Umgebung hilft ${name} am ehesten beim Konzentrieren?`,
      en: (name) => `Which setting helps ${name} concentrate best?`,
    },
    options: [
      { id: "a", label: { de: "Absolute Ruhe", en: "Complete silence" } },
      { id: "b", label: { de: "Leise Musik", en: "Quiet music" } },
      { id: "c", label: { de: "Café-Geräusche", en: "Café ambience" } },
    ],
  },
  {
    id: "rq_extra_082",
    prompt: {
      de: (name) => `Wie würde ${name} lieber ein Wochenende planen?`,
      en: (name) => `How would ${name} rather plan a weekend?`,
    },
    options: [
      { id: "a", label: { de: "Alles im Voraus", en: "Everything in advance" } },
      { id: "b", label: { de: "Nur einen Höhepunkt", en: "One main activity" } },
      { id: "c", label: { de: "Ganz spontan", en: "Completely spontaneously" } },
    ],
  },
  {
    id: "rq_extra_083",
    prompt: {
      de: (name) => `Welche Aktivität würde ${name} eher alleine machen?`,
      en: (name) => `Which activity would ${name} rather do alone?`,
    },
    options: [
      { id: "a", label: { de: "Ins Kino gehen", en: "Go to the cinema" } },
      { id: "b", label: { de: "Wandern", en: "Go hiking" } },
      { id: "c", label: { de: "Ins Café gehen", en: "Go to a café" } },
    ],
  },
  {
    id: "rq_extra_084",
    prompt: {
      de: (name) => `Wie würde ${name} am liebsten eine gute Nachricht teilen?`,
      en: (name) => `How would ${name} most like to share good news?`,
    },
    options: [
      { id: "a", label: { de: "Persönlich", en: "In person" } },
      { id: "b", label: { de: "Sprachnachricht", en: "Voice message" } },
      { id: "c", label: { de: "Gruppenchat", en: "Group chat" } },
    ],
  },
  {
    id: "rq_extra_085",
    prompt: {
      de: (name) => `Welcher kleine Luxus wäre ${name} am liebsten?`,
      en: (name) => `Which little luxury would ${name} like most?`,
    },
    options: [
      { id: "a", label: { de: "Frühstück ans Bett", en: "Breakfast in bed" } },
      { id: "b", label: { de: "Ein freier Nachmittag", en: "A free afternoon" } },
      { id: "c", label: { de: "Lieblingsessen geliefert", en: "Favourite food delivered" } },
    ],
  },
  {
    id: "rq_extra_086",
    prompt: {
      de: (name) => `Welche Aufgabe würde ${name} auf einer gemeinsamen Reise übernehmen?`,
      en: (name) => `What role would ${name} take on a group trip?`,
    },
    options: [
      { id: "a", label: { de: "Route planen", en: "Plan the route" } },
      { id: "b", label: { de: "Unterkünfte suchen", en: "Find accommodation" } },
      { id: "c", label: { de: "Aktivitäten aussuchen", en: "Pick activities" } },
    ],
  },
  {
    id: "rq_extra_087",
    prompt: {
      de: (name) => `Was würde ${name} in einer Bibliothek zuerst machen?`,
      en: (name) => `What would ${name} do first in a library?`,
    },
    options: [
      { id: "a", label: { de: "Stöbern", en: "Browse" } },
      { id: "b", label: { de: "Gezielt suchen", en: "Search for something specific" } },
      { id: "c", label: { de: "Einen ruhigen Platz suchen", en: "Find a quiet spot" } },
    ],
  },
  {
    id: "rq_extra_088",
    prompt: {
      de: (name) => `Was wäre ${name} bei einem neuen Hobby am wichtigsten?`,
      en: (name) => `What would matter most to ${name} in a new hobby?`,
    },
    options: [
      { id: "a", label: { de: "Schnell Fortschritte sehen", en: "Make quick progress" } },
      { id: "b", label: { de: "Etwas mit anderen machen", en: "Do it with others" } },
      { id: "c", label: { de: "Kreativ sein", en: "Be creative" } },
    ],
  },
  {
    id: "rq_extra_089",
    prompt: {
      de: (name) => `Welche Snack-Kombination würde ${name} eher ausprobieren?`,
      en: (name) => `Which snack combination would ${name} rather try?`,
    },
    options: [
      { id: "a", label: { de: "Süß und salzig", en: "Sweet and salty" } },
      { id: "b", label: { de: "Scharf und süß", en: "Spicy and sweet" } },
      { id: "c", label: { de: "Fruchtig und herzhaft", en: "Fruity and savoury" } },
    ],
  },
  {
    id: "rq_extra_090",
    prompt: {
      de: (name) => `Welche Art von Festival würde ${name} eher besuchen?`,
      en: (name) => `Which type of festival would ${name} rather attend?`,
    },
    options: [
      { id: "a", label: { de: "Musikfestival", en: "Music festival" } },
      { id: "b", label: { de: "Food-Festival", en: "Food festival" } },
      { id: "c", label: { de: "Filmfestival", en: "Film festival" } },
    ],
  },
  {
    id: "rq_extra_091",
    prompt: {
      de: (name) => `Welche Aufgabe würde ${name} beim Umzug lieber übernehmen?`,
      en: (name) => `Which task would ${name} rather take on during a move?`,
    },
    options: [
      { id: "a", label: { de: "Kartons packen", en: "Pack boxes" } },
      { id: "b", label: { de: "Möbel tragen", en: "Carry furniture" } },
      { id: "c", label: { de: "Alles organisieren", en: "Organise everything" } },
    ],
  },
  {
    id: "rq_extra_092",
    prompt: {
      de: (name) => `Wie würde ${name} einen unerwarteten Geldfund am ehesten behandeln?`,
      en: (name) => `What would ${name} most likely do with money they found?`,
    },
    options: [
      { id: "a", label: { de: "Abgeben", en: "Hand it in" } },
      { id: "b", label: { de: "Nach dem Besitzer suchen", en: "Look for the owner" } },
      { id: "c", label: { de: "Beim Fundbüro nachfragen", en: "Ask at lost property" } },
    ],
  },
  {
    id: "rq_extra_093",
    prompt: {
      de: (name) => `Welche kleine Mutprobe würde ${name} eher wagen?`,
      en: (name) => `Which small dare would ${name} rather try?`,
    },
    options: [
      { id: "a", label: { de: "Vor Fremden singen", en: "Sing in front of strangers" } },
      { id: "b", label: { de: "Eine neue Sportart testen", en: "Try a new sport" } },
      { id: "c", label: { de: "Allein auf eine Bühne", en: "Go on stage alone" } },
    ],
  },
  {
    id: "rq_extra_094",
    prompt: {
      de: (name) => `Welche Art von Nachricht verschickt ${name} am liebsten?`,
      en: (name) => `Which type of message does ${name} prefer sending?`,
    },
    options: [
      { id: "a", label: { de: "Kurzer Text", en: "Short text" } },
      { id: "b", label: { de: "Sprachnachricht", en: "Voice note" } },
      { id: "c", label: { de: "Anruf", en: "Phone call" } },
    ],
  },
  {
    id: "rq_extra_095",
    prompt: {
      de: (name) => `Was würde ${name} für eine Zeitkapsel auswählen?`,
      en: (name) => `What would ${name} put in a time capsule?`,
    },
    options: [
      { id: "a", label: { de: "Ein Foto", en: "A photograph" } },
      { id: "b", label: { de: "Einen Brief", en: "A letter" } },
      { id: "c", label: { de: "Einen kleinen Gegenstand", en: "A small object" } },
    ],
  },
  {
    id: "rq_extra_096",
    prompt: {
      de: (name) => `Welche Art von Spaziergang würde ${name} eher machen?`,
      en: (name) => `Which kind of walk would ${name} rather take?`,
    },
    options: [
      { id: "a", label: { de: "Durch den Wald", en: "Through a forest" } },
      { id: "b", label: { de: "Am Wasser", en: "By the water" } },
      { id: "c", label: { de: "Durch die Stadt", en: "Through the city" } },
    ],
  },
  {
    id: "rq_extra_097",
    prompt: {
      de: (name) => `Wie würde ${name} bei einem verlorenen Gegenstand suchen?`,
      en: (name) => `How would ${name} look for a lost item?`,
    },
    options: [
      { id: "a", label: { de: "Systematisch", en: "Systematically" } },
      { id: "b", label: { de: "Alle fragen", en: "Ask everyone" } },
      { id: "c", label: { de: "Erst mal abwarten", en: "Wait a bit first" } },
    ],
  },
  {
    id: "rq_extra_098",
    prompt: {
      de: (name) => `Welches Fantasiewesen würde ${name} gern treffen?`,
      en: (name) => `Which mythical creature would ${name} like to meet?`,
    },
    options: [
      { id: "a", label: { de: "Drache", en: "Dragon" } },
      { id: "b", label: { de: "Einhorn", en: "Unicorn" } },
      { id: "c", label: { de: "Meerjungfrau", en: "Mermaid" } },
    ],
  },
  {
    id: "rq_extra_099",
    prompt: {
      de: (name) => `Wie würde ${name} lieber einen Wettbewerb gewinnen?`,
      en: (name) => `How would ${name} rather win a competition?`,
    },
    options: [
      { id: "a", label: { de: "Mit Wissen", en: "With knowledge" } },
      { id: "b", label: { de: "Mit Kreativität", en: "With creativity" } },
      { id: "c", label: { de: "Mit Teamarbeit", en: "With teamwork" } },
    ],
  },
  {
    id: "rq_extra_100",
    prompt: {
      de: (name) => `Wie würde ${name} am liebsten einen gemeinsamen Erfolg feiern?`,
      en: (name) => `How would ${name} most like to celebrate a shared success?`,
    },
    options: [
      { id: "a", label: { de: "Zusammen essen gehen", en: "Go out for a meal" } },
      { id: "b", label: { de: "Einen Spieleabend machen", en: "Have a game night" } },
      { id: "c", label: { de: "Einen Ausflug planen", en: "Plan a day trip" } },
    ],
  },
];
