export const CATEGORY_CONFIG = {
  1: { label: "Warm-Up", sips: 1, points: 3, color: "from-purple-500 to-indigo-600", emoji: "🔥" },
  2: { label: "Spicy", sips: 2, points: 5, color: "from-pink-500 to-rose-600", emoji: "🌶️" },
  3: { label: "Chaos", sips: 3, points: 7, color: "from-red-500 to-orange-600", emoji: "💀" },
  action: { label: "Aktion", sips: 2, points: 5, color: "from-amber-500 to-orange-500", emoji: "🎭" },
  hotmild: { label: "Wild – Mild", sips: 2, points: 5, color: "from-pink-500 to-rose-600", emoji: "💋" },
  hot: { label: "Wild", sips: 3, points: 8, color: "from-rose-500 to-red-600", emoji: "🔥" },
  hardcore: { label: "Chaos", sips: 4, points: 10, color: "from-red-600 to-rose-900", emoji: "💀" },
};

export const SPECIAL_TYPES = {
  group_decision: { emoji: "👥", color: "from-indigo-500 to-purple-600" },
  double_challenge: { emoji: "🤝", color: "from-cyan-500 to-blue-600" },
  blackout: { emoji: "🤐", color: "from-slate-600 to-slate-800" },
  risk_card: { emoji: "🎲", color: "from-amber-600 to-red-600" },
};

const cards = (raw, category, type) => raw.trim().split("\n").map(text => ({
  text: text.trim(),
  ...(category !== null ? { category } : {}),
  ...(type ? { type } : {}),
}));

export const questions = [
  ...cards(`
Was ist dein guilty pleasure Song, zu dem du heimlich tanzt?
Was war dein peinlichster Moment auf einer Party?
Hast du schon mal jemanden geküsst, den du nicht mochtest?
Was ist das Verrückteste, das du je betrunken gemacht hast?
Welche Person in dieser Runde findest du am attraktivsten?
Hast du schon mal jemanden gestalkt auf Social Media?
Was war dein schlimmster Date-Fail?
Hast du schon mal gelogen, um jemanden zu beeindrucken?
Was war der letzte Traum, an den du dich erinnerst?
Hast du schon mal eine Nachricht geschickt, die nicht für diese Person bestimmt war?
Was ist der peinlichste Song in deiner Playlist?
Was war dein letzter Schwarm?
Was ist die dümmste Ausrede, die du je benutzt hast?
Was ist dein peinlichster Benutzername, den du je hattest?
Hast du schon mal so getan, als würdest du jemanden nicht bemerken?
Was ist das Kindischste, das du immer noch tust?
Welches Geheimnis hast du versehentlich verraten?
`, 1),

  ...cards(`
Was ist deine größte Schwäche in einer Beziehung?
Hast du schon mal mit jemandem geschrieben, obwohl du vergeben warst?
Welchen Ex würdest du nochmal daten und warum?
Was macht dich bei jemandem heimlich schwach (z. B. Lachen, Stimme, Humor)?
Hast du schon mal jemanden geghosted? Warum?
Was war der verrückteste Ort, an dem du je geknutscht hast?
Was ist das Mutigste, das du je in einer Beziehung gemacht hast?
Was ist dein größtes Beziehungs-Red-Flag?
Was war dein intensivstes Date?
Was würdest du tun, wenn dein Ex jetzt hier reinkommt?
Was ist das Schmeichelhafteste, das du je bekommen hast?
Wer hier wäre für dich eher ein guter Kumpel als ein Date – und warum?
Was ist dein größter Turn-Off?
`, 2),

  ...cards(`
Mache 10 Liegestütze!
Imitiere eine Person in dieser Runde – alle müssen raten wer!
Mache deinen besten Tanzschritt – alle schauen zu!
Male einem Mitspieler mit dem Finger ein unsichtbares Kunstwerk auf den Handrücken.
Singe 30 Sekunden lang einen Song deiner Wahl!
Erzähle in einer Minute eine spontane Geschichte mit den Wörtern: Kuss, Nacht, Geheimnis!
Flüstere der Person rechts neben dir etwas Nettes ins Ohr!
Mache den albernsten Tanz, den du kennst!
Sprich 30 Sekunden lang mit einem fremden Akzent!
Lasse die Gruppe dein nächstes Getränk bestimmen!
`, "action", "action"),
];

export const hotQuestions = [
  ...cards(`
Küsse die Person deiner Wahl auf die Wange!
Flüstere der Person rechts neben dir einen Flirtspruch ins Ohr!
Gib der Person links neben dir eine 1-minütige Schultermassage!
Tausche deinen Platz mit der attraktivsten Person hier!
Zeige deine filmreifste Tanzpose!
Mache der Person neben dir 3 ehrliche Komplimente!
Streiche der Person neben dir sanft durchs Haar!
Halte die Hand der Person neben dir für 2 Runden!
Gib der Person rechts von dir einen Kuss auf die Stirn!
Flüstere dein größtes Geheimnis der Person links von dir zu!
Streiche der Person gegenüber sanft über die Wange!
Sage der attraktivsten Person hier, was du an ihr magst!
Gib der Person links von dir eine 1-minütige Nackenmassage!
Setze dich für 1 Minute Rücken an Rücken mit der Person rechts von dir!
Beschreibe den perfekten Kuss der Person gegenüber!
Mache ein Model-Selfie mit der Person deiner Wahl!
Sage der Person neben dir ein Kompliment über ihren Style!
Küsse die Person rechts von dir auf die Hand!
Flüstere der attraktivsten Person hier, was dir an ihr zuerst aufgefallen ist!
Streiche der Person links von dir sanft über den Arm!
Sage der Person gegenüber, was dir an ihrer Ausstrahlung am besten gefällt!
Gib der Person rechts von dir einen Kuss auf die Schulter!
Halte für 30 Sekunden Blickkontakt mit der attraktivsten Person hier!
Beschreibe der Person neben dir deinen perfekten ersten Kuss!
Setze dich eng neben die attraktivste Person hier!
Flüstere der Person links von dir zu, was dich bei jemandem sofort schwach macht!
Streiche der Person rechts von dir sanft über den Rücken!
Sage der Person gegenüber, was du an ihr am charmantesten findest!
Gib der Person deiner Wahl eine 60-sekündige Handmassage!
Sage der attraktivsten Person hier, was sie so besonders macht!
Beschreibe der Person rechts von dir deinen idealen Date-Abend!
Küsse die Hand der attraktivsten Person hier!
Sage der Person neben dir, was du an ihr am meisten bewunderst!
Halte für 30 Sekunden engen Blickkontakt mit der Person rechts von dir!
Tanze 20 Sekunden wie in einem Musikvideo um die Person deiner Wahl herum!
Flüstere der Person links von dir zu, was du an ihr richtig cool findest!
Streiche der Person gegenüber sanft über die Hand!
Gib der Person rechts von dir einen Kuss auf die Nase!
Beschreibe der Person neben dir deinen wildesten Kuss!
Lehne dich 30 Sekunden lang an die Schulter der Person links von dir!
Tanze mind. 20 Sekunden einen Paartanz mit der Person deiner Wahl!
Flüstere der attraktivsten Person hier deinen größten Traum zu!
Streiche der Person rechts von dir sanft durchs Gesicht!
Gib der Person links von dir eine 15-sekündige Fußmassage!
`, "hotmild", "action"),

  ...cards(`
Lege ein Accessoire ab!
Tausche ein Accessoire (z. B. Mütze, Schal, Uhr) mit der Person rechts von dir!
Ziehe deinen Pulli oder deine Jacke für eine Runde verkehrt herum an!
Wirf der Person deiner Wahl einen filmreifen Luftkuss zu!
Tausche ein Accessoire mit der Person gegenüber!
Gib der Person rechts von dir einen Handkuss!
Ziehe dein Schuhwerk aus und spiele die nächste Runde barfuß!
Gib der Person links von dir ein Küsschen auf die Wange!
Sitze 2 Runden lang direkt neben der attraktivsten Person!
Ziehe ein Accessoire aus und gib es der Person rechts von dir!
Gib der Person deiner Wahl eine 30-sekündige Umarmung!
Tausche die Socken mit der Person links von dir!
Wirf der Person gegenüber eine Kusshand zu – so dramatisch wie möglich!
Gib zwei Accessoires als Pfand ab – du bekommst sie erst nach 3 Runden zurück!
Gib der Person rechts von dir ein High Five und ein ehrliches Kompliment!
Füttere die Person gegenüber mit einem Snack!
Gib der attraktivsten Person hier einen Kuss auf die Wange!
Tausche ein Accessoire mit der Person deiner Wahl!
Gib der Person rechts von dir einen Eskimo-Kuss (Nasen aneinander reiben)!
Tausche deine Kopfbedeckung oder ein Accessoire mit der attraktivsten Person hier!
Die Gruppe wählt ein Accessoire von dir, das du bis Spielende abgeben musst!
Gib der Person links von dir eine feste Umarmung!
Gib der attraktivsten Person hier ein Accessoire von dir als Pfand!
Küsse der Person deiner Wahl die Hand!
Tausche deine Jacke mit der Person rechts von dir!
Ziehe deine Schuhe aus und spiele die nächste Runde in Socken!
Verbeuge dich vor der attraktivsten Person hier und mache ihr ein Kompliment!
Halte 15 Sekunden lang Händchen mit der Person rechts von dir!
Tausche ein Accessoire mit der Person links von dir!
Setze dich eng neben die Person rechts von dir und halte ihre Hand!
Tausche Mütze, Brille oder Kette mit der attraktivsten Person!
Lege dein Handy für 3 Runden mit dem Display nach oben auf den Tisch!
Die Person links von dir wählt: Wangenkuss, Handkuss oder Umarmung!
Tausche die Schuhe mit der Person rechts von dir!
Die Person gegenüber wählt ein Accessoire, das du eine Runde lang abgibst!
Halte für die nächste Runde Händchen mit der Person deiner Wahl!
Umarme die Person deiner Wahl 15 Sekunden lang!
Spiele eine romantische Filmszene mit einer zufällig bestimmten Person nach!
Bewerte das Outfit von jemandem ehrlich auf einer Skala von 1–10 – mit Begründung!
Sprich eine Runde lang mit einer übertriebenen Radiomoderator-Stimme.
Beschreibe deinen perfekten Partner, ohne Geschlecht oder Namen zu nennen.
Sag, mit wem aus der Runde du am ehesten auf ein Date gehen würdest.
Erfinde einen absurden, aber überzeugenden Grund, warum ihr beide heiraten solltet.
Jemand anderes stellt eine Frage an dich, die du ehrlich beantworten musst.
Sag, wer aus der Runde am besten küssen könnte – nur nach deinem Eindruck.
Sag, welche drei Eigenschaften dich bei jemandem sofort schwach machen.
Wähle zwei Personen, die deiner Meinung nach ein gutes Paar wären.
Lass jemanden deine „Flirt-Skills“ von 1–10 bewerten.
Erfinde einen kreativen Anmachspruch und richte ihn an eine Person.
Mach deinen schlechtesten Anmachspruch.
Erzähle deine peinlichste Dating-Story.
Zeig dein ältestes Selfie.
Spiele 1 Runde lang einen völlig übertrieben eifersüchtigen Partner.
Beschreibe deinen letzten Crush mit drei Emojis.
Sag jemandem, was dir an ihm/ihr zuerst aufgefallen ist.
Gib jemandem einen neuen, flirtigen Spitznamen.
Sag jemandem, welchen Song du mit ihm/ihr verbinden würdest.
Lass die Person gegenüber eine Frage auswählen, die du ehrlich beantworten musst.
Wähle jemanden und beschreibe euer perfektes erstes Date.
Sag, mit wem aus der Runde du am ehesten den Sonnenaufgang erleben würdest.
Erfinde einen gemeinsamen Paar-Spitznamen für dich und eine Person.
Lass jemanden für eine Runde deine Antworten auswählen.
Mache eine dramatische Liebeserklärung an die Person links von dir.
Flirte mit einem Gegenstand im Raum.
Sag deinen peinlichsten Spitznamen aus der Vergangenheit.
Zeige dein meistgenutztes Emoji.
Du darfst dich diese Runde ausruhen - PAUSE!
Der Spieler deiner Wahl darf dir ein Accessoire abnehmen und eine Runde lang behalten.
Spiele mit einer leeren Flasche eine dramatische Liebesszene nach!
Täusche einen dramatischen Filmtod vor!
Erfinde mit der Person gegenüber einen geheimen Handschlag!
Stelle pantomimisch dein perfektes Date nach – die anderen raten!
Macht euch gegenseitig 3 Komplimente!
Verratet euch gegenseitig ein Geheimnis!
Teilt euch gemeinsam ein Getränk!
Massiert euch gegenseitig jeweils 1 Minute die Schultern!
Macht ein gemeinsames Foto!
Du darfst dir diese Runde eine Verschnaufspause gönnen!
`, "hot", "action"),

  ...cards(`
Hast du dich schon mal in jemanden verguckt, der eigentlich tabu war (z. B. Ex deiner besten Freundin/deines besten Freundes)?
Welche Person hier würde am ehesten einen Marathon schaffen?
Was würdest du tun, wenn du und eine Person hier allein auf einer Insel wärst?
Was ist dein absolutes No-Go beim Dating?
Welche Person hier wäre das beste Date – und warum?
Welche Eigenschaft macht dich heimlich schwach, die niemand von dir erwarten würde?
Mit wem hier würdest du am ehesten spontan in den Urlaub fliegen?
Was ist das Mutigste, das du je bei einem Date gemacht hast?
Welche Person hier hat die charmanteste Ausstrahlung?
Was fällt dir bei jemandem als Allererstes auf?
Hast du schon mal von jemandem hier geträumt?
Welche Person hier würdest du am ehesten küssen?
Was ist das Romantischste, das du je gesagt hast?
Welche Person hier hat das ansteckendste Lachen?
Wie sähe dein Traum-Date mit jemandem hier aus?
Hast du heute Abend schon heimlich zu jemandem hier rübergeschaut?
Welche Regel würdest du heimlich gerne mal brechen?
Mit wem hier würdest du am ehesten ein Geheimnis teilen?
Welche Person hier hat die attraktivste Stimme?
Was ist das schönste Kompliment, das du je von einem Schwarm bekommen hast?
Was steht ganz oben auf deiner Bucket List?
Welche Person hier hat die schönsten Augen?
Was ist die peinlichste Flirtnachricht, die du je geschrieben hast?
Mit wem hier würdest du am ehesten einen Roadtrip machen?
Welche Person hier strahlt das meiste Selbstbewusstsein aus?
Hattest du schon mal einen komischen Traum über jemanden hier?
Was findest du heimlich süß, würdest es aber nie zugeben?
Welche Person hier wäre der beste Filmstar?
Hast du schon mal einen Screenshot von einer Nachricht von jemandem hier gemacht?
Welche Person hier wäre die beste Geschichtenerzählerin / der beste Geschichtenerzähler?
Was ist das Romantischste, das du je im Urlaub erlebt hast?
Mit wem hier würdest du am ehesten einen Filmabend unter einer Decke machen?
Welche Person hier hat die attraktivsten Hände?
Hast du schon mal jemanden hier heimlich süß gefunden?
Was ist deine geheimste Guilty-Pleasure-Serie?
Welche Person hier würdest du am ehesten als Mitbewohner:in wählen?
Was ist das Romantischste, das du je bei einem Date gemacht hast?
Welche Person hier könnte am besten Hörbücher einsprechen?
Was ist das Peinlichste, das dir je an einem öffentlichen Ort passiert ist?
Welches Thema findest du heimlich faszinierend, redest aber nie darüber?
Welche Person hier tanzt am besten?
Mit wem hier würdest du am ehesten ein Wochenende verbringen?
Was ist der seltsamste Traum, den du je hattest?
Welche Person hier hat den besten Style?
Hast du schon mal jemanden hier in Gedanken geküsst?
Was willst du unbedingt noch erleben?
Mit wem hier würdest du am ehesten ein Spiel spielen – und welches?
Welche Person hier hat das charmanteste Lächeln?
Was ist die kitschigste Liebesnachricht, die du je geschrieben hast?
Hast du schon mal jemanden hier heimlich angeschmachtet?
Was wäre dein perfekter romantischer Abend mit jemandem hier?
`, "hotmild"),

  ...cards(`
Was ist dein absolutes Tabu bei einem ersten Date?
Wen aus dieser Runde würdest du am ehesten zum Essen bei dir zu Hause einladen?
Wie sieht dein perfekter spontaner Abend aus?
Was ist das Wildeste, das du je auf einem Konzert oder Festival gemacht hast?
Was ist dein geheimes Traum-Szenario für ein Date?
An welcher Stelle bist du am kitzligsten?
Welchen Wunsch hast du noch nie laut ausgesprochen?
Beschreibe deinen wildesten Kuss!
Was ist das Gewagteste, das du je getragen hast?
Welche Person hier würdest du am ehesten um ein Date bitten?
Beschreibe deinen perfekten Kuss!
Was ist das Süßeste, das dir je jemand ins Ohr geflüstert hat?
Was ist das Mutigste, das du je für deinen Schwarm versucht hast?
Welche Person hier würdest du am ehesten küssen – und wie?
Beschreibe deinen wildesten Abend!
Welche Person hier hat die beste Party-Energie?
Was ist dein größtes Tabu, das du nie brechen würdest?
Wie sieht dein perfekter Kuschelabend aus?
Wie würdest du jemanden hier um ein Date bitten? Zeig's uns!
Wie sieht dein perfektes Abenteuer zu zweit aus?
Was ist der peinlichste Schlafanzug, den du je getragen hast?
Welche Person hier würdest du am ehesten zum Karaoke mitnehmen?
Welches Partyspiel spielst du am liebsten?
Was ist das Lustigste, das du je jemandem ins Ohr geflüstert hast?
Welche Person hier würdest du am ehesten mit auf eine Insel nehmen?
Was würdest du nur in dieser Runde zugeben?
Wie sähe dein verrücktester Partyabend mit jemandem hier aus?
Was ist der mutigste Date-Vorschlag, den du je gemacht hast?
Wie sähe dein perfekter Tag mit jemandem hier aus?
Was ist das Peinlichste, das dir je in einer Umkleide passiert ist?
Wer hier hätte die verrücktesten Ideen für einen Gruppenurlaub?
Was ist das Gewagteste, das du je auf einer Party gemacht hast?
Was ist das Verrückteste, das du je im Schwimmbad oder am See gemacht hast?
Wann hast du zuletzt so richtig laut gelacht – und worüber?
Welches Schimpfwort benutzt du am häufigsten?
Mit welcher Person hier würdest du am ehesten flirten – und warum?
Wer hat das schönste Lächeln?
Mit wem würdest du am ehesten eine Nacht durchreden?
Was war dein bisher bestes Date?
Was macht jemanden für dich sofort attraktiv?
Glaubst du an Liebe auf den ersten Blick?
Was ist für dich das perfekte erste Date?
Was ist deine größte Green Flag?
Wer sieht besser aus, als er/sie selbst denkt?
Was ist das Peinlichste, was du je für jemanden gemacht hast?
Was war deine schlimmste Abfuhr?
Hast du schon mal jemanden nur aus Langeweile gedatet?
Hast du schon mal eine Nachricht absichtlich ignoriert, obwohl du sie gelesen hast?
Was ist für dich beim Küssen am wichtigsten?
Wie viele Dates hattest du ungefähr im letzten Jahr?
Würdest du jemanden daten, der völlig andere Hobbys hat als du?
Wie viele Leute hast du schon geküsst?
Würdest du eine Fernbeziehung führen?
Würdest du deinem Ex eine zweite Chance geben?
Würdest du für die große Liebe in ein anderes Land ziehen?
Hast du schon mal eine Nachricht geschrieben und sofort bereut?
Hast du schon mal jemanden absichtlich eifersüchtig gemacht?
Hast du schon mal jemanden gedatet, obwohl du wusstest, dass es keine Zukunft hat?
Hast du schon mal einen Crush deiner besten Freundin/deinem besten Freund verschwiegen?
Hast du schon mal jemanden nur wegen seines Aussehens gedatet?
Hast du schon mal einen Korb gegeben, obwohl du eigentlich interessiert warst?
Was war dein peinlichstes Date-Outfit?
Wen hier würdest du deinen Eltern vorstellen?
Wen hier würdest du nachts um 3 Uhr anrufen?
Wen hier würdest du auf einer Dating-App nach rechts swipen?
Wer hier könnte dich am ehesten dazu bringen, deine Dating-Regeln zu brechen?
`, "hot"),
];

export const hardcoreQuestions = [
  ...cards(`
Was ist das Schlimmste, das du je getan hast, ohne erwischt zu werden?
Hast du schon mal jemanden absichtlich verletzt?
Was ist der seltsamste Gedanke, den du je hattest?
Hast du schon mal ein anvertrautes Geheimnis verraten?
Was ist das Skandalöseste, das du je getan hast?
Hast du schon mal jemanden betrogen und es nie zugegeben?
Was ist dein größtes Tabu, das du gebrochen hast?
Hast du schon mal ein falsches Spiel gespielt?
Was ist das Peinlichste, das dir je bei einem Date passiert ist?
Hast du schon mal jemanden absichtlich gedemütigt?
Was ist das Ekligste, das du je gegessen hast?
Hast du schon mal jemanden hintergangen?
Was ist das Gefährlichste, das du je getan hast?
Was ist das Verrückteste, das du je für Geld getan hast?
Hast du schon mal jemanden zu einem Spiel überredet, auf das er/sie keine Lust hatte?
Was ist das Skandalöseste, das du je auf einer Party getan hast?
Was ist das Schlimmste, das du je gesagt hast?
Was ist das Verrückteste, das du je im Schlaf gesagt hast?
Wann warst du zuletzt dein großes Geschäft verrichten?
Hast du schon mal jemanden gedatet und dann einfach fallen gelassen?
Hast du beim Küssen schon mal an jemand anderen gedacht?
Was ist der größte Unsinn, den du je aus Langeweile gemacht hast?
Was ist das Skandalöseste, das du je im Urlaub getan hast?
Was ist der fieseste Gedanke, den du heute schon hattest?
Hast du schon mal jemanden absichtlich manipuliert?
Was ist das Verrückteste, das du je getrunken hast?
Hast du schon mal jemanden absichtlich geärgert und es lustig gefunden?
Was ist das Skandalöseste, das du je geschrieben hast?
Hast du schon mal jemanden absichtlich betrogen und es bereut?
Was ist das Gefährlichste, das du je gesagt hast?
Hast du schon mal über jemanden gelacht und es später bereut?
Was ist das Verrückteste, das du je mit jemandem gemacht hast?
Was ist das Schlimmste, das du je getan hast, ohne es zu bereuen?
Was ist das Verrückteste, das du je mit deiner besten Freundin/deinem besten Freund gemacht hast?
Hast du schon mal mit jemandem geflirtet und es danach bereut?
Was ist das Verrückteste, das du je auf einer Party gemacht hast?
Was ist das Schlimmste, das du je bei einem Date getan hast?
Hast du schon mal jemanden absichtlich manipuliert und es bereut?
Was ist das Verrückteste, das du je für jemanden getan hast?
Was ist das Ekligste, das du je auf einer Party gesehen hast?
Was ist das Schlimmste, das du je mit jemandem hier getan hast?
Was ist das Skandalöseste, das du je mit jemandem hier gemacht hast?
Was ist das Verrückteste, das du je auf einem Roadtrip erlebt hast?
Was ist der schlechteste Witz, den du je erzählt hast?
Was ist das Gefährlichste, das du je mit jemandem hier getan hast?
Was ist die größte Lüge, die du in einer Beziehung erzählt hast?
Wen hast du zuletzt angelogen?
Was ist etwas, das niemand hier über dich weiß?
Welche Person aus deinem Leben vermisst du heimlich?
Worauf bist du insgeheim neidisch?
Was ist deine größte Unsicherheit?
Welche Wahrheit über dich würdest du am liebsten verstecken?
Mit welchem Ex würdest du niemals wieder sprechen und warum?
Hast du schon mal mit jemandem Schluss gemacht, obwohl du ihn/sie noch geliebt hast?
Hast du schon mal mit jemandem geflirtet, obwohl du wusstest, dass er/sie vergeben ist?
Welche Beziehung bereust du am meisten?
Wem aus der Runde würdest du deinen Haustürschlüssel anvertrauen?
Wen würdest du deiner besten Freundin/deinem besten Freund niemals als Partner empfehlen?
Welche Eigenschaft an dir würdest du deinem zukünftigen Partner verschweigen?
Was ist das Gemeinste, das du aus Liebeskummer gemacht hast?
Wer in der Runde wirkt am sportlichsten?
`, "hardcore"),

  ...cards(`
Gesteh der Gruppe dein größtes Geheimnis!
Zeige der Gruppe ein peinliches Foto von dir!
Rufe jemanden an und sag etwas Peinliches!
Tausche Platz und Getränk mit der Person rechts von dir!
Mache einen Vorschlag, den alle mitmachen müssen!
Erzähle der Gruppe von deinem schlimmsten Date!
Lasse die Gruppe eine Challenge für dich bestimmen!
Lasse die Gruppe ein Accessoire bestimmen, das du tragen musst!
Schreib eine Nachricht an deinen Ex – aber lies sie nur der Gruppe vor, ohne sie abzuschicken!
Erzähle der Gruppe dein größtes Tabu!
Iss 3 ungekochte Nudeln.
Iss einen Teelöffel Senf!
Renne einmal um die Gruppe und rufe dabei: „Ich bin die Legende dieser Party!“
Klopfe der Person links von dir auf die Schulter und mache ihr ein Kompliment!
Trage bis zum Ende des Spiels ein Accessoire oder eine Verkleidung, die die Gruppe aussucht!
Verteile 5 Schlücke an deine Mitspieler.
Mache einer Türklinke deiner Wahl eine Liebeserklärung!
Lass dir von der Person links von dir einen Klecks Majo auf die Nasenspitze tupfen – er bleibt eine Runde dran!
Flüstere der Person rechts von dir ein Wort ins Ohr – sie muss es pantomimisch darstellen!
Beschreibe das Ohr eines anderen Spielers so poetisch wie möglich!
Denkt euch zu zweit einen Partnertanz aus und führt ihn vor (Partner deiner Wahl)!
Iss eine Zitronenscheibe, ohne das Gesicht zu verziehen!
Male einem Mitspieler mit dem Finger einen unsichtbaren Schnurrbart ins Gesicht!
Kitzle einen Mitspieler 5 Sekunden lang (wenn er/sie einverstanden ist)!
Schäle eine Banane nur mit einer Hand!
Befülle deinen Mund mit Ketchup.
Schlage einen Mitspieler mit einem imaginären Schwert zum Ritter!
Halte eine 30-sekündige Liebesrede an den Kühlschrank!
Schreibe der 7. Person in deinem Chatverlauf ein ehrliches Kompliment!
Du darfst 6 Schlücke an deine Mitspieler verteilen.
Mache der Gruppe ein Geständnis!
Lasse die Gruppe eine Strafe für dich bestimmen!
Rufe jemanden an und beichte etwas!
Tausche deine Schuhe mit der Person links von dir!
Erzähle der Gruppe von deinem peinlichsten Moment.
Lasse die Gruppe bestimmen, wem du schreibst!
Erzähle der Gruppe von deinem wildesten Abend!
Rufe jemanden an und singe ihm etwas vor!
Erzähle der Gruppe von deinem schlimmsten Kuss!
Lasse die Gruppe eine Kopfbedeckung oder Verkleidung für dich bestimmen!
Rufe jemanden an und beichte deine Gefühle!
Lasse die Gruppe eine Wahrheit über dich erraten!
Mache der Gruppe ein Versprechen, das du halten musst!
Erzähle der Gruppe von deinem peinlichsten Traum!
Lasse die Gruppe eine Challenge für die nächste Runde bestimmen!
Rufe jemanden an und erzähle ihm ein Geheimnis!
Mache der Gruppe ein Geständnis über deinen heimlichen Musik- oder Filmgeschmack!
Lasse die Gruppe bestimmen, wen du anrufst!
Rufe jemanden an und sag etwas Verwirrendes!
Spiele der Gruppe deine letzte selbst gesendete Sprachnachricht vor.
Lasse die Gruppe eine Strafe für die nächste Runde bestimmen!
Mache der Gruppe ein Angebot, das alle mitmachen müssen!
Lasse die Gruppe eine Frage an dich stellen!
Rufe jemanden an und flüstere ihm etwas zu!
Mache der Gruppe ein Versprechen für die nächste Woche!
Lasse die Gruppe eine Aufgabe für die nächste Stunde bestimmen!
Rufe jemanden an und beichte etwas Peinliches!
Lasse die Gruppe bestimmen, was du als Nächstes sagst!
Lasse die Gruppe eine Challenge für die ganze Runde bestimmen!
`, "hardcore", "action"),

  ...cards(`
Nenne drei Personen, die du attraktiv findest.
`, "hardcore"),

  ...cards(`
Erzähle der Runde, worüber du zuletzt mit deinem Crush geschrieben hast.
Nenne deinen aktuellen Crush.
Sag, wen du aus der Runde küssen würdest.
Verrate dein größtes Dating-Geheimnis.
Sag, wen du zuletzt attraktiv fandest.
Erzähle deinen peinlichsten Flirt-Fail.
Zeig dein erstes Selfie.
Jeder schreibt einen Namen auf einen Zettel; die Person mit den meisten Stimmen bekommt eine Challenge.
`, "hardcore", "action"),

  ...cards(`
Die Gruppe wählt den mutigsten Spieler für die nächste Aufgabe!
Die Gruppe bestimmt, wer die nächste Runde spendiert!
Die Gruppe wählt, wer als Nächstes ein Geheimnis preisgeben muss!
Die Gruppe wählt den charmantesten Spieler für die nächste Aufgabe!
Die Gruppe entscheidet, wer als Nächstes jemanden anrufen muss!
Die Gruppe nominiert den Spieler mit der wildesten Geschichte!
Die Gruppe bestimmt, wer ein Accessoire tauschen muss!
Die Gruppe nominiert den Spieler mit dem schlimmsten Date!
Die Gruppe bestimmt, wer ein Geständnis machen muss!
Die Gruppe wählt den Spieler, der am meisten zu verbergen hat!
Die Gruppe nominiert den Spieler mit dem größten Tabu!
Die Gruppe wählt den Spieler, der am ehesten lügen würde!
Die Gruppe entscheidet, wer ein peinliches Foto zeigen muss!
Die Gruppe nominiert den Spieler mit der blühendsten Fantasie!
Die Gruppe entscheidet, wer als Nächstes ein Geheimnis teilt!
Die Gruppe nominiert den Spieler mit dem schlimmsten Geheimnis!
Die Gruppe bestimmt, wer die nächste Strafe bekommt!
Kocht zu zweit pantomimisch eine Bolognese und kommentiert alles wie in einer Kochshow!
`, null, "group_decision"),

  ...cards(`
Zwei Spieler müssen gemeinsam 10 Liegestütze machen!
Zwei Spieler müssen gemeinsam einen Tanz aufführen!
Zwei Spieler müssen gemeinsam eine Geschichte erzählen!
Zwei Spieler müssen eine Armdrück-Challenge machen!
Zwei Spieler müssen sich gegenseitig etwas zuflüstern!
Zwei Spieler müssen sich gegenseitig eine Frage stellen!
Zwei Spieler müssen sich gegenseitig imitieren!
Zwei Spieler müssen gemeinsam eine Aufgabe lösen!
Zwei Spieler müssen sich gegenseitig einen Kuss auf die Wange geben!
Zwei Spieler müssen gemeinsam ein Lied singen!
Zwei Spieler müssen gemeinsam eine Challenge vorschlagen!
Zwei Spieler müssen sich gegenseitig etwas eingestehen!
Zwei Spieler müssen sich gegenseitig eine Challenge stellen!
Zwei Spieler müssen sich gegenseitig ein Versprechen geben!
Zwei Spieler müssen sich gegenseitig etwas Peinliches sagen!
`, null, "double_challenge"),

  ...cards(`
Hast du schon mal gelogen? (Blackout: Sage NICHT 'Ja'!)
Hast du schon mal betrogen? (Blackout: Sage NICHT 'Ja'!)
Hast du schon mal gestohlen? (Blackout: Sage NICHT 'Ja'!)
Hast du schon mal jemanden verletzt? (Blackout: Sage NICHT 'Ja'!)
Hast du schon mal ein Geheimnis verraten? (Blackout: Sage NICHT 'Ja'!)
Hast du schon mal einen Kater vor deinen Eltern verheimlicht? (Blackout: Sage NICHT 'Ja'!)
Hast du schon mal gelogen, um jemanden zu schützen? (Blackout: Sage NICHT 'Ja'!)
Hast du schon mal jemanden absichtlich verletzt? (Blackout: Sage NICHT 'Ja'!)
Hast du schon mal ein falsches Spiel gespielt? (Blackout: Sage NICHT 'Ja'!)
Hast du schon mal jemanden absichtlich getäuscht? (Blackout: Sage NICHT 'Ja'!)
Hast du schon mal jemanden absichtlich hereingelegt? (Blackout: Sage NICHT 'Ja'!)
Hast du schon mal jemanden absichtlich manipuliert? (Blackout: Sage NICHT 'Ja'!)
Hast du schon mal jemanden geghostet? (Blackout: Sage NICHT 'Ja'!)
Hast du schon mal jemanden absichtlich bloßgestellt? (Blackout: Sage NICHT 'Ja'!)
Hast du schon mal jemanden absichtlich eifersüchtig gemacht? (Blackout: Sage NICHT 'Ja'!)
Hast du schon mal bei einem Spiel geschummelt? (Blackout: Sage NICHT 'Ja'!)
`, null, "blackout"),

  ...cards(`
Schaffst du 20 Liegestütze?
Schaffst du, 30 Sekunden auf einem Bein zu balancieren?
Schaffst du, einen Löffel 10 Sekunden auf der Nase zu balancieren?
Schaffst du, das Alphabet rückwärts aufzusagen?
Schaffst du, 30 Sekunden nicht zu lachen?
Schaffst du einen Handstand?
Schaffst du, einen Apfel in 3 Bissen zu essen?
Schaffst du, 30 Sekunden nicht zu blinzeln?
Schaffst du, ein Lied zu pfeifen?
Schaffst du, dich 30 Sekunden zu drehen ohne umzufallen?
Schaffst du, einen Plastikbecher mit Wasser auf dem Kopf zu balancieren?
Schaffst du, deinen Namen rückwärts zu buchstabieren?
Schaffst du, 15 Sekunden die Luft anzuhalten?
Schaffst du einen Radschlag?
Schaffst du, mit geschlossenen Augen auf einem Bein zu stehen?
Schaffst du 20 Kniebeugen?
Schaffst du, rückwärts von 20 zu zählen?
Schaffst du, einen Kronkorken mit einem Fingerschnipser vom Tisch zu schießen?
Schaffst du, ein Stöckchen 20 Sekunden auf dem Finger zu balancieren?
Schaffst du, in 5 Sekunden einen Reim zu finden?
Schaffst du, 3 Gläser zu stapeln?
Schaffst du, mit nur einem Auge zu zwinkern?
Schaffst du, 10 Sekunden lang zu jodeln?
Schaffst du, ein Lied auswendig zu singen?
Schaffst du einen Handstand an der Wand?
Schaffst du, 1 Minute lang still zu sein?
`, null, "risk_card"),
];
