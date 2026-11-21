// Datenschutzerklärung – einzige Quelle für die Seite /datenschutz
// und für public/lumaga-datenschutz.html.
// Nach Änderungen: npm run build:privacy (erzeugt die HTML-Datei neu).

export const PRIVACY_POLICY = {
  "title": "Datenschutzerklärung – Lumaga",
  "stand": "21. November 2026",
  "blocks": [
    {
      "type": "h2",
      "text": "1. Verantwortlicher"
    },
    {
      "type": "p",
      "text": "Verantwortlich für die Datenverarbeitung im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:"
    },
    {
      "type": "p",
      "text": "Christian Raab"
    },
    {
      "type": "p",
      "text": "Tulpenweg 9"
    },
    {
      "type": "p",
      "text": "63579 Freigericht"
    },
    {
      "type": "p",
      "text": "Deutschland"
    },
    {
      "type": "p",
      "text": "E-Mail: crappsmil@gmail.com"
    },
    {
      "type": "h2",
      "text": "2. Allgemeine Hinweise zur Datenverarbeitung"
    },
    {
      "type": "p",
      "text": "Der Schutz personenbezogener Daten ist uns wichtig. Die Anwendung wird so gestaltet, dass durch den Betreiber möglichst wenige personenbezogene Daten erhoben und verarbeitet werden."
    },
    {
      "type": "p",
      "text": "Eine Nutzung der App ist grundsätzlich ohne Registrierung und ohne die Erstellung eines Benutzerkontos möglich."
    },
    {
      "type": "p",
      "text": "Die Webversion wird über Vercel bereitgestellt. Beim Start der Webapp wird eine Verbindung zu Base44 aufgebaut, um technische App-Einstellungen abzurufen; dabei ist außerdem eine Nutzungsanalyse von Base44 aktiv (siehe Abschnitt 9). Schriftarten werden von Google Fonts geladen (siehe Abschnitt 10). Für die Webversion werden serverseitige Kaufprüfungen über Vercel-Funktionen bereitgestellt. Für die freiwillige Wiederherstellung von Käufen per Wiederherstellungscode wird die Datenbank Upstash Redis eingesetzt (siehe Abschnitt 5). Für das Support- und Feedbackfenster wird zusätzlich Cloudflare Workers als technischer Endpunkt eingesetzt; der Versand der Supportnachricht erfolgt anschließend über den E-Mail-Versanddienst Resend."
    },
    {
      "type": "p",
      "text": "Für die Verwaltung und Prüfung von Kaufberechtigungen wird RevenueCat eingesetzt. Zahlungen in der Webapp werden über RevenueCat Billing und Stripe abgewickelt. Lumaga wird ausschließlich als Browser-Webapp angeboten."
    },
    {
      "type": "p",
      "text": "Lokale Spielmodi, darunter „Wer würde…?“, „Wer kennt wen?“, „Bluff & Wahrheit“, „Pantomime“ und „Ich habe noch nie“, verwenden für ihren Spielstatus grundsätzlich lokale Browser-Speicherfunktionen. Der kostenlose Fun-Testmodus stellt feste Testfragen bereit. Lokale Spielstände werden grundsätzlich nicht an den Betreiber übertragen; die Prüfung kostenpflichtiger Freischaltungen über RevenueCat bleibt davon unberührt."
    },
    {
      "type": "p",
      "text": "Bei der Nutzung solcher Funktionen können technisch erforderliche sowie spielbezogene Daten an die hierfür eingesetzten technischen Dienstleister übermittelt und dort verarbeitet werden."
    },
    {
      "type": "p",
      "text": "Die Verarbeitung erfolgt nur, soweit dies zur Bereitstellung, Sicherheit und Funktionsfähigkeit der jeweiligen App-Funktion oder zur Bearbeitung einer vom Nutzer ausdrücklich übermittelten Anfrage erforderlich ist."
    },
    {
      "type": "h2",
      "text": "3. Verarbeitung und Speicherung von Daten"
    },
    {
      "type": "p",
      "text": "Der Betreiber unterhält keine eigenen physischen Server. Die Webapp wird über Vercel bereitgestellt. Hinzu kommen Base44 (bei jedem App-Start), Google Fonts (Schriftarten), Upstash Redis (Kauf-Wiederherstellung) sowie Cloudflare Workers und Resend (nur bei Support- und Feedbackanfragen)."
    },
    {
      "type": "p",
      "text": "Der Betreiber erhebt – abgesehen von Daten, die Nutzer im Rahmen einer Support- oder Feedbackanfrage freiwillig beziehungsweise zur Beantwortung der Anfrage angeben – insbesondere nicht gezielt:"
    },
    {
      "type": "ul",
      "items": [
        "Anschriften,",
        "Telefonnummern,",
        "Kreditkarten- oder Bankdaten,",
        "dauerhafte Nutzerprofile."
      ]
    },
    {
      "type": "p",
      "text": "E-Mail-Adressen werden grundsätzlich nicht für die normale Nutzung der App benötigt. Sie werden jedoch verarbeitet, wenn ein Nutzer über das Support- beziehungsweise Feedbackfenster eine Anfrage übermittelt und seine E-Mail-Adresse für eine Rückmeldung angibt."
    },
    {
      "type": "p",
      "text": "Bei einer Support- oder Feedbackanfrage werden die angegebene E-Mail-Adresse und der Inhalt der Nachricht über einen Cloudflare Worker an Resend übermittelt und anschließend als E-Mail an das Supportpostfach des Betreibers zugestellt."
    },
    {
      "type": "p",
      "text": "Welche technischen Daten bei der Nutzung anfallen und wofür sie verwendet werden, ist in Abschnitt 8 beschrieben."
    },
    {
      "type": "h2",
      "text": "4. Käufe in der Webapp"
    },
    {
      "type": "p",
      "text": "Die App kann kostenpflichtige digitale Inhalte und Funktionen enthalten."
    },
    {
      "type": "p",
      "text": "Hierzu können insbesondere gehören:"
    },
    {
      "type": "ul",
      "items": [
        "die Freischaltung des „Wild-Modus“,",
        "die Freischaltung des „Chaos-Modus“,",
        "die Freischaltung der Funktion „Mein Deck“,",
        "die dauerhafte Freischaltung der lokalen Modi “Wer würde…?”, „Wer kennt wen?“, „Bluff & Wahrheit“, „Pantomime“ und „Ich habe noch nie“,",
        "die dauerhafte Freischaltung eines lokalen Bundles, das mehrere lokale Premium-Inhalte zusammenfasst,",
        "ein zeitlich begrenzter 24h-Party-Pass für die Freischaltung der Premium-Modi und für bis zu acht lokale Spieler,",
        "kostenpflichtige Einzelaktionen innerhalb eines Spielmodus, beispielsweise das kostenpflichtige Überspringen einer Frage oder Aktion,",
        "eine freiwillige Unterstützung des Entwicklers („Eis spendieren“)."
      ]
    },
    {
      "type": "p",
      "text": "Zur technischen Verwaltung, Validierung und Wiederherstellung von Käufen und Kaufberechtigungen wird zusätzlich RevenueCat eingesetzt."
    },
    {
      "type": "p",
      "text": "Hierbei kann eine technische Nutzerkennung der App als sogenannte „App User ID“ an RevenueCat übermittelt werden, damit Käufe und Freischaltungen dem richtigen Nutzer zugeordnet werden können. In der Webapp ist das eine zufällig erzeugte, pseudonyme Kennung (siehe Abschnitt 7.1)."
    },
    {
      "type": "p",
      "text": "Der Betreiber erhält keine vollständigen Zahlungsdaten, insbesondere keine Kreditkarten- oder Bankdaten."
    },
    {
      "type": "p",
      "text": "Im Zusammenhang mit einem Kauf können jedoch technische Kauf- und Transaktionsinformationen verarbeitet werden, soweit dies für die Überprüfung und Bereitstellung der erworbenen Inhalte erforderlich ist."
    },
    {
      "type": "p",
      "text": "Hierzu können insbesondere gehören:"
    },
    {
      "type": "ul",
      "items": [
        "Kaufbestätigung,",
        "erworbenes Produkt beziehungsweise erworbene Funktion,",
        "Transaktions- oder Kaufkennung,",
        "Zeitpunkt und Status des Kaufs,",
        "Information darüber, ob ein Kauf erfolgreich abgeschlossen oder wiederhergestellt wurde,",
        "bei zeitlich begrenzten Kaufberechtigungen, insbesondere dem 24h-Party-Pass, der serverseitig ermittelte Ablaufzeitpunkt."
      ]
    },
    {
      "type": "p",
      "text": "Für den Lumaga-24h-Party-Pass wird der Kaufstatus über Vercel Server Functions anhand der bei RevenueCat vorliegenden Kaufdaten geprüft. Die hierfür verwendete signierte Browsersitzung wird in einem technisch notwendigen Cookie zugeordnet. Eine eigene dauerhafte Party-Pass-Transaktionstabelle in Upstash wird derzeit nicht geführt."
    },
    {
      "type": "p",
      "text": "Auch bei dauerhaften Freischaltungen wird der Kaufstatus über Vercel Server Functions bei RevenueCat geprüft. Die Zuordnung erfolgt über ein eigenes technisch notwendiges Cookie (siehe Abschnitt 7.1)."
    },
    {
      "type": "p",
      "text": "Diese Daten werden insbesondere verarbeitet zur:"
    },
    {
      "type": "ul",
      "items": [
        "Freischaltung erworbener Inhalte und Funktionen,",
        "Überprüfung des Kaufstatus,",
        "Wiederherstellung bereits erworbener Inhalte, soweit technisch vorgesehen,",
        "Fehlerbehebung,",
        "Missbrauchs- und Betrugsprävention."
      ]
    },
    {
      "type": "p",
      "text": "Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Verarbeitung zur Durchführung des Vertrags über den jeweiligen Kauf erforderlich ist. Soweit Daten zur Missbrauchs- und Betrugsprävention verarbeitet werden, ist Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO; das berechtigte Interesse liegt im Schutz der App und der Käufe der Nutzer vor Missbrauch."
    },
    {
      "type": "p",
      "text": "Soweit Daten aufgrund gesetzlicher Verpflichtungen verarbeitet oder aufbewahrt werden müssen, kann die Verarbeitung zusätzlich auf Art. 6 Abs. 1 lit. c DSGVO beruhen."
    },
    {
      "type": "p",
      "text": "Die Zahlungsabwicklung erfolgt im Web über RevenueCat Billing und Stripe. Diese Dienstleister können im Rahmen der Zahlungsabwicklung personenbezogene Daten entsprechend ihrer jeweiligen datenschutzrechtlichen Rolle und ihren Datenschutzhinweisen verarbeiten."
    },
    {
      "type": "h2",
      "text": "5. Wiederherstellung von Käufen per Wiederherstellungscode"
    },
    {
      "type": "p",
      "text": "Käufe sind an das jeweilige Browserprofil gebunden. Damit dauerhafte Freischaltungen auch in einem anderen Browser oder auf einem anderen Gerät genutzt werden können, bietet Lumaga eine freiwillige Wiederherstellung per Code an. Eine Registrierung oder die Angabe einer E-Mail-Adresse ist dafür nicht erforderlich. Der 24h-Party-Pass ist von der Wiederherstellung ausgenommen."
    },
    {
      "type": "p",
      "text": "Nach einer serverseitigen Prüfung der Käufe bei RevenueCat kann der Nutzer einen zufällig erzeugten Wiederherstellungscode anfordern. Der Code wird angezeigt und zusätzlich im lokalen Speicher des Browsers abgelegt, damit er dort später erneut angezeigt werden kann. Wer den Code kennt, kann die damit verbundenen Käufe übernehmen; er sollte daher vertraulich aufbewahrt werden."
    },
    {
      "type": "p",
      "text": "In der Datenbank Upstash Redis (Primärregion Frankfurt, Deutschland) werden dafür gespeichert:"
    },
    {
      "type": "ul",
      "items": [
        "ein kryptografischer Prüfwert (Hash) des Codes – nicht der Code selbst,",
        "die pseudonyme Kundenkennung, unter der die Käufe bei RevenueCat geführt werden,",
        "die Liste der wiederherstellbaren Produkte,",
        "die Zuordnung zur pseudonymen Sitzungskennung des aktuell berechtigten Browsers."
      ]
    },
    {
      "type": "p",
      "text": "Wird ein Code in einem anderen Browser eingelöst, wird er ungültig und durch einen neuen Code ersetzt. Die Käufe sind danach nur noch im neuen Browser freigeschaltet; der bisherige Browser verliert die Berechtigung. So wird verhindert, dass ein Kauf in beliebig vielen Browsern gleichzeitig genutzt wird."
    },
    {
      "type": "p",
      "text": "Zum Schutz vor dem Ausprobieren fremder Codes ist die Zahl der Einlöseversuche begrenzt (5 Versuche je Browsersitzung und 30 Versuche je IP-Adresse innerhalb von 15 Minuten). Die IP-Adresse wird dafür nicht im Klartext gespeichert, sondern nur ein mit einem geheimen Schlüssel gebildeter Prüfwert (HMAC). Diese Zähler werden nach 15 Minuten automatisch gelöscht."
    },
    {
      "type": "p",
      "text": "Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Verarbeitung erforderlich ist, um erworbene Inhalte in einem anderen Browser bereitzustellen. Für die Sicherheitsmaßnahmen (Begrenzung der Einlöseversuche, Verhinderung gleichzeitiger Mehrfachnutzung) ist Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO; das berechtigte Interesse liegt im Schutz der Käufe der Nutzer und der App vor Missbrauch."
    },
    {
      "type": "p",
      "text": "Die Wiederherstellungsdaten werden gespeichert, solange die erworbenen dauerhaften Freischaltungen genutzt werden können. Auf Anfrage werden sie gelöscht (siehe Abschnitt 14); eine Wiederherstellung ist danach nicht mehr möglich."
    },
    {
      "type": "h2",
      "text": "6. Funktion „Mein Deck“"
    },
    {
      "type": "p",
      "text": "Über die Funktion „Mein Deck“ können Nutzer eigene Fragen, Aktionen oder sonstige Spielinhalte erstellen."
    },
    {
      "type": "p",
      "text": "Die über „Mein Deck“ erstellten Inhalte werden grundsätzlich ausschließlich lokal auf dem Endgerät beziehungsweise im lokalen Speicher der App oder des Browsers gespeichert."
    },
    {
      "type": "p",
      "text": "Die selbst erstellten Inhalte werden nicht dauerhaft an den Betreiber oder an Base44 übertragen oder dort gespeichert."
    },
    {
      "type": "p",
      "text": "Hierzu können lokal insbesondere gespeichert werden:"
    },
    {
      "type": "ul",
      "items": [
        "der vom Nutzer eingegebene Text,",
        "selbst erstellte Fragen und Aktionen,",
        "die Zuordnung der Inhalte zu einem eigenen Deck,",
        "gegebenenfalls lokale Einstellungen des jeweiligen Decks."
      ]
    },
    {
      "type": "p",
      "text": "Diese Inhalte bleiben grundsätzlich auf dem Endgerät gespeichert, bis:"
    },
    {
      "type": "ul",
      "items": [
        "sie innerhalb der App gelöscht werden,",
        "die lokalen App- oder Browserdaten gelöscht werden,",
        "oder die App deinstalliert wird."
      ]
    },
    {
      "type": "p",
      "text": "Nutzer sollten keine personenbezogenen Daten anderer Personen in selbst erstellte Fragen oder Aktionen aufnehmen, sofern hierfür keine entsprechende Berechtigung besteht."
    },
    {
      "type": "h2",
      "text": "7. Lokal gespeicherte Spiel- und Einstellungsdaten"
    },
    {
      "type": "p",
      "text": "Die App kann bestimmte Spiel-, Sitzungs- und Einstellungsdaten ausschließlich lokal auf dem Endgerät speichern."
    },
    {
      "type": "p",
      "text": "Dazu gehören insbesondere:"
    },
    {
      "type": "ul",
      "items": [
        "die Bestätigung, dass der Nutzer mindestens 16 Jahre alt ist,",
        "App- und Spieleinstellungen, zum Beispiel die gewählte Sprache und die Toneinstellung,",
        "der zuletzt ausgewählte lokale Spielmodus,",
        "die für eine lokale Partie eingegebenen Spielernamen; sie werden beim nächsten vollständigen Neuladen der App automatisch entfernt,",
        "lokale Sitzungs- und Spielfortschrittsdaten der Modi “Wer würde…?”, „Wer kennt wen?“, „Bluff & Wahrheit“, „Pantomime“ und „Ich habe noch nie“, einschließlich lokal geführter Punktestände und Rundeninformationen,",
        "eine lokale Fragen-, Aufgaben- beziehungsweise Kartenhistorie, um unmittelbare Wiederholungen zu vermeiden,",
        "lokal gespeicherte Inhalte aus „Mein Deck“,",
        "der Wiederherstellungscode (siehe Abschnitt 5) und die pseudonyme RevenueCat-Kennung (siehe Abschnitt 7.1),",
        "weitere technische Einstellungen, die für die Nutzung der App erforderlich sind."
      ]
    },
    {
      "type": "p",
      "text": "Bei den genannten lokalen Spielmodi dienen diese Daten insbesondere dazu, eine begonnene Partie auf demselben Gerät fortsetzen zu können und bereits kürzlich verwendete Karten beziehungsweise Fragen für eine begrenzte Anzahl nachfolgender Partien zu vermeiden."
    },
    {
      "type": "p",
      "text": "Im kostenlosen Fun-Testmodus werden feste Testfragen bereitgestellt. Eine zeitlich begrenzte kostenlose Testphase wird in dieser Fassung nicht als aktiv vorausgesetzt. Soweit lokal Test- oder Nutzungsstände gespeichert werden, gelten die übrigen Angaben dieses Abschnitts zur lokalen Speicherung."
    },
    {
      "type": "p",
      "text": "Diese lokal gespeicherten Daten werden grundsätzlich nicht an den Betreiber übertragen, sofern sie nicht für eine vom Nutzer aktiv verwendete Funktion technisch erforderlich sind."
    },
    {
      "type": "p",
      "text": "Die Speicherung dieser Informationen im Browser erfolgt nach § 25 Abs. 2 Nr. 2 TDDDG ohne Einwilligung, da sie unbedingt erforderlich ist, um die vom Nutzer ausdrücklich gewünschten Spielfunktionen bereitzustellen."
    },
    {
      "type": "p",
      "text": "Die lokal gespeicherten Daten bleiben auf dem Endgerät gespeichert, bis:"
    },
    {
      "type": "ul",
      "items": [
        "sie innerhalb der App geändert oder gelöscht werden,",
        "die App- oder Browserdaten gelöscht werden,",
        "oder die App deinstalliert wird."
      ]
    },
    {
      "type": "h3",
      "text": "7.1 Anonyme Sitzungskennungen und technisch notwendige Cookies"
    },
    {
      "type": "p",
      "text": "Für die serverseitige Prüfung des 24h-Party-Passes stellt Lumaga über Vercel eine zufällig erzeugte pseudonyme Sitzungskennung bereit. Das signierte Cookie „lumaga_party_session“ speichert die technische Sitzungszuordnung im Browser. Es ist als HttpOnly, Secure und SameSite=Lax gekennzeichnet und kann nach der gegenwärtigen Einstellung bis zu 365 Tage bestehen bleiben, sofern es nicht vorher gelöscht wird. Die Signatur wird serverseitig überprüft."
    },
    {
      "type": "p",
      "text": "Für dauerhafte Käufe und die Kauf-Wiederherstellung setzt Lumaga ein zweites signiertes Cookie „lumaga_purchase_session“ mit denselben Eigenschaften (HttpOnly, Secure, SameSite=Lax, bis zu 365 Tage). Es enthält ebenfalls nur eine zufällig erzeugte pseudonyme Kennung."
    },
    {
      "type": "p",
      "text": "Die Kennung dient der Zuordnung und sicheren Prüfung der Party-Pass-Kaufberechtigung in einem Browserprofil. Für dauerhafte Einzelkäufe verwendet Lumaga derzeit zusätzlich eine lokal gespeicherte RevenueCat-App-User-ID („lumaga_revenuecat_user_id“). Diese Kennung ist browserprofilabhängig; in einem anderen Browser lassen sich Käufe über den Wiederherstellungscode übernehmen (siehe Abschnitt 5). Der 24h-Party-Pass wird technisch über die gesonderte signierte Browsersitzung geprüft."
    },
    {
      "type": "p",
      "text": "Die Verarbeitung technisch notwendiger Sitzungsdaten erfolgt, soweit sie für die Bereitstellung angeforderter Leistungen erforderlich ist, nach Art. 6 Abs. 1 lit. b DSGVO, im Übrigen für die Sicherheit und Missbrauchsabwehr nach Art. 6 Abs. 1 lit. f DSGVO. Die Speicherung der Cookies und der lokal gespeicherten Kennungen erfolgt nach § 25 Abs. 2 Nr. 2 TDDDG ohne Einwilligung, da sie unbedingt erforderlich ist, um die vom Nutzer gewünschte Kauf- und Freischaltfunktion bereitzustellen."
    },
    {
      "type": "h2",
      "text": "8. Technisch notwendige Daten"
    },
    {
      "type": "p",
      "text": "Bei der Nutzung der App beziehungsweise ihrer technischen Infrastruktur können technisch notwendige Verbindungs- und Nutzungsdaten verarbeitet werden. Diese fallen insbesondere beim Hosting durch Vercel an."
    },
    {
      "type": "p",
      "text": "Hierzu können insbesondere gehören:"
    },
    {
      "type": "ul",
      "items": [
        "IP-Adresse,",
        "Datum und Uhrzeit des Zugriffs,",
        "Geräte- und Browserinformationen,",
        "Betriebssystemversion,",
        "App-Version,",
        "technische Fehler- oder Protokolldaten,",
        "technische Spiel- und Sitzungsinformationen,",
        "eine pseudonyme Nutzerkennung, soweit sie zur Zuordnung von Kaufberechtigungen erforderlich ist."
      ]
    },
    {
      "type": "p",
      "text": "Die konkrete Verarbeitung hängt von den tatsächlich verwendeten Funktionen der App ab."
    },
    {
      "type": "p",
      "text": "Die Verarbeitung erfolgt insbesondere zu folgenden Zwecken:"
    },
    {
      "type": "ul",
      "items": [
        "technische Bereitstellung der App,",
        "Stabilität und Sicherheit,",
        "Fehleranalyse,",
        "Verhinderung von Missbrauch und technischen Angriffen."
      ]
    },
    {
      "type": "p",
      "text": "Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO."
    },
    {
      "type": "p",
      "text": "Das berechtigte Interesse liegt insbesondere in der sicheren, stabilen und funktionsfähigen Bereitstellung der App sowie im Schutz der technischen Infrastruktur vor Missbrauch und Angriffen."
    },
    {
      "type": "h2",
      "text": "9. Vercel und Base44 als technische Dienstleister"
    },
    {
      "type": "p",
      "text": "Die Webversion von Lumaga wird über Vercel gehostet. Anbieter ist Vercel Inc., USA. Bei jedem Webseitenaufruf können Vercel und technische Unterauftragnehmer Verbindungs- und Sicherheitsdaten verarbeiten. Lumaga wurde unter Nutzung von Base44 entwickelt; bei jedem Start der Webapp werden Daten an Base44 übermittelt."
    },
    {
      "type": "p",
      "text": "Hierzu gehören insbesondere:"
    },
    {
      "type": "ul",
      "items": [
        "der Abruf technischer App-Einstellungen beim Start,",
        "eine automatische Nutzungsanalyse (siehe unten),",
        "technische Sicherheits- und Infrastrukturleistungen."
      ]
    },
    {
      "type": "p",
      "text": "Die serverseitige Prüfung des 24h-Party-Passes und dauerhafter Käufe erfolgt nicht über Base44, sondern über Vercel mit einer Abfrage bei RevenueCat."
    },
    {
      "type": "p",
      "text": "Nutzungsanalyse durch Base44: Der in die Webapp eingebundene Programmbaustein von Base44 übermittelt automatisch Nutzungsereignisse an Base44. Dazu gehören ein Ereignis beim Start der App (einschließlich der zuvor besuchten Seite, sogenannter Referrer), ein Lebenszeichen etwa jede Minute, solange die App geöffnet ist, die Dauer der Sitzung, der aufgerufene Seitenpfad und der Zeitpunkt. Hierfür wird im lokalen Speicher des Browsers eine zufällig erzeugte Analyse-Kennung („base44_analytics_session_id“) abgelegt, die bis zur Löschung der Browserdaten bestehen bleibt."
    },
    {
      "type": "p",
      "text": "Supportanfragen, die innerhalb des in der App bereitgestellten Support- und Feedbackfensters möglich sind, werden über Cloudflare Workers und Resend verarbeitet; Einzelheiten hierzu ergeben sich aus Abschnitt 10 und Abschnitt 18."
    },
    {
      "type": "p",
      "text": "Bei Nutzung dieser Funktionen können technisch erforderliche sowie spielbezogene Daten an Base44 übermittelt und dort verarbeitet werden."
    },
    {
      "type": "p",
      "text": "Je nach Funktion können Datenflüsse insbesondere so aussehen:"
    },
    {
      "type": "p",
      "text": "Nutzer → Browser → Vercel (Website und Party-Pass-API) → RevenueCat (Kaufprüfung)."
    },
    {
      "type": "p",
      "text": "Bei der Kauf-Wiederherstellung: Nutzer → Browser → Vercel → RevenueCat (Kaufprüfung) und Upstash (Wiederherstellungsdaten)."
    },
    {
      "type": "p",
      "text": "Beim App-Start und während der Nutzung (Nutzungsanalyse): Nutzer → App → Base44-Infrastruktur."
    },
    {
      "type": "p",
      "text": "Beim Laden der Schriftarten: Browser → Google Fonts."
    },
    {
      "type": "p",
      "text": "Zu den über Base44 verarbeiteten Daten können insbesondere technische Verbindungs- und Protokolldaten sowie die oben genannten Nutzungsereignisse gehören."
    },
    {
      "type": "p",
      "text": "Die Inhalte der Funktion „Mein Deck“ werden nicht dauerhaft über Base44 gespeichert."
    },
    {
      "type": "p",
      "text": "Base44 kann zur Erbringung seiner Leistungen weitere technische Dienstleister beziehungsweise Unterauftragsverarbeiter einsetzen."
    },
    {
      "type": "p",
      "text": "Soweit personenbezogene Daten durch Base44 oder andere eingesetzte Dienstleister außerhalb der Europäischen Union oder des Europäischen Wirtschaftsraums verarbeitet werden, erfolgt eine solche Übermittlung nur unter Beachtung der Voraussetzungen der Art. 44 ff. DSGVO."
    },
    {
      "type": "p",
      "text": "Je nach Empfänger und Verarbeitungsort kann eine Übermittlung insbesondere auf Grundlage eines Angemessenheitsbeschlusses der Europäischen Kommission oder geeigneter Garantien wie den von der Europäischen Kommission beschlossenen Standardvertragsklauseln erfolgen."
    },
    {
      "type": "p",
      "text": "Weitere Informationen zur Verarbeitung personenbezogener Daten durch Base44 sowie zu den von Base44 eingesetzten Unterauftragsverarbeitern ergeben sich aus den jeweils aktuellen Datenschutz- und Vertragsinformationen von Base44."
    },
    {
      "type": "h2",
      "text": "10. Weitere Drittanbieter (RevenueCat, Stripe, Upstash, Cloudflare, Resend, Google)"
    },
    {
      "type": "p",
      "text": "Für Webkäufe werden RevenueCat Billing und Stripe eingesetzt. Die technische Freischaltungsprüfung erfolgt über RevenueCat und eigene Vercel-Serverfunktionen."
    },
    {
      "type": "p",
      "text": "Zusätzlich wird RevenueCat, Inc. als technischer Dienstleister für die Verwaltung, Validierung und Wiederherstellung von Käufen und Premiumberechtigungen eingesetzt."
    },
    {
      "type": "p",
      "text": "RevenueCat kann hierfür insbesondere pseudonyme App-User-IDs, technische Geräte- und Browserinformationen sowie Kauf- und Transaktionsinformationen verarbeiten. Die Anwendung verwendet technische Kennungen zur Kaufzuordnung; vollständige Karten- oder Bankdaten erhält der Betreiber nicht."
    },
    {
      "type": "p",
      "text": "Zur Feststellung dauerhafter Freischaltungen kann die App neben aktiven Kaufberechtigungen auch von RevenueCat zurückgemeldete Kennungen bereits erworbener Produkte auswerten. Dabei handelt es sich um Produkt- und Kaufstatusinformationen; vollständige Zahlungsdaten erhält der Betreiber dadurch nicht."
    },
    {
      "type": "p",
      "text": "Stripe kann im Rahmen der Zahlungsabwicklung personenbezogene und technische Daten in eigener datenschutzrechtlicher Verantwortlichkeit verarbeiten."
    },
    {
      "type": "p",
      "text": "Hierfür gelten ergänzend die Datenschutzinformationen des jeweils beteiligten Zahlungsdienstleisters. Weitere Informationen: https://stripe.com/de/privacy und https://www.revenuecat.com/privacy."
    },
    {
      "type": "p",
      "text": "Upstash, Inc. stellt die Datenbank Upstash Redis bereit, die über Vercel eingebunden ist (Primärregion Frankfurt, Deutschland). Sie wird ausschließlich für die Kauf-Wiederherstellung genutzt; Einzelheiten stehen in Abschnitt 5."
    },
    {
      "type": "p",
      "text": "Google Fonts: Die Webapp lädt die Schriftarten „Space Grotesk“ und „Outfit“ von Servern der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Dabei werden bei jedem Aufruf die IP-Adresse des Nutzers und technische Angaben zum Browser an Google übermittelt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; das berechtigte Interesse liegt in einer einheitlichen Darstellung der Webapp. Eine Übermittlung in die USA kann nicht ausgeschlossen werden."
    },
    {
      "type": "p",
      "text": "Für das Support- und Feedbackfenster werden Cloudflare, Inc. (Cloudflare Workers) sowie Plus Five Five, Inc. (Resend) als technische Dienstleister eingesetzt."
    },
    {
      "type": "p",
      "text": "Cloudflare Workers nimmt die Supportanfrage am technischen Endpunkt entgegen und leitet sie an Resend weiter. Dabei können insbesondere die IP-Adresse, Datum und Uhrzeit, technische Anfrage- und Verbindungsdaten sowie die vom Nutzer übermittelten Supportdaten verarbeitet werden. Die Supportnachricht wird dabei nicht zusätzlich in einer eigenen App-Datenbank gespeichert."
    },
    {
      "type": "p",
      "text": "Resend verarbeitet für die E-Mail-Zustellung insbesondere die angegebene E-Mail-Adresse, den Nachrichteninhalt sowie technische Versand- und Protokolldaten. Die Nachricht wird an das Supportpostfach crappsmil@gmail.com zugestellt. Dadurch kann auch Google als Betreiber des E-Mail-Dienstes Gmail die Supportdaten im Rahmen der E-Mail-Bereitstellung verarbeiten."
    },
    {
      "type": "p",
      "text": "Cloudflare, Resend, Vercel, RevenueCat und Upstash sind Anbieter mit Sitz in den USA. Soweit personenbezogene Daten außerhalb der Europäischen Union oder des Europäischen Wirtschaftsraums verarbeitet werden, erfolgt eine Übermittlung nur unter Beachtung der Voraussetzungen der Art. 44 ff. DSGVO. Je nach Verarbeitung können hierfür insbesondere das EU-U.S. Data Privacy Framework und/oder die von der Europäischen Kommission beschlossenen Standardvertragsklauseln als Übermittlungsgrundlage beziehungsweise geeignete Garantie herangezogen werden."
    },
    {
      "type": "p",
      "text": "Weitere Informationen: Cloudflare-Datenschutz unter https://www.cloudflare.com/privacypolicy/, Resend-Datenschutz unter https://resend.com/legal/privacy-policy, Google-Datenschutz unter https://policies.google.com/privacy und Vercel-Datenschutz unter https://vercel.com/legal/privacy-policy."
    },
    {
      "type": "h2",
      "text": "11. Weitergabe und Übermittlung personenbezogener Daten"
    },
    {
      "type": "p",
      "text": "Eine Weitergabe oder Übermittlung personenbezogener Daten erfolgt grundsätzlich nur, soweit dies für den jeweiligen Zweck erforderlich ist."
    },
    {
      "type": "p",
      "text": "Dies kann insbesondere erfolgen:"
    },
    {
      "type": "ul",
      "items": [
        "aufgrund gesetzlicher Verpflichtungen,",
        "zur technischen Bereitstellung der App,",
        "zur technischen Bereitstellung über Base44,",
        "zur Durchführung und Überprüfung von Käufen und zur Kauf-Wiederherstellung,",
        "zur Bearbeitung von Support- und Feedbackanfragen,",
        "zur Fehleranalyse,",
        "zum Schutz der App vor Missbrauch oder technischen Angriffen."
      ]
    },
    {
      "type": "p",
      "text": "Empfänger können insbesondere Vercel, RevenueCat, Stripe, Base44, Upstash, Google (Google Fonts), Cloudflare Workers und Resend sein. Bei Supportanfragen kann außerdem Google als Anbieter des verwendeten Gmail-Postfachs Empfänger der erforderlichen Daten werden."
    },
    {
      "type": "p",
      "text": "Eine darüber hinausgehende Weitergabe personenbezogener Daten erfolgt nur, wenn hierfür eine gesetzliche Grundlage besteht oder der Nutzer zuvor wirksam eingewilligt hat."
    },
    {
      "type": "p",
      "text": "Eine Nutzung personenbezogener Daten für den Verkauf an Dritte erfolgt nicht."
    },
    {
      "type": "h2",
      "text": "12. Speicherdauer"
    },
    {
      "type": "p",
      "text": "Personenbezogene Daten werden grundsätzlich nur so lange verarbeitet oder gespeichert, wie dies für den jeweiligen Verarbeitungszweck erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen."
    },
    {
      "type": "p",
      "text": "Lokale Spiel- und Rotationszeitdaten:"
    },
    {
      "type": "p",
      "text": "Lokale Sitzungsdaten der lokalen Spielmodi werden je nach Spiel nach Abschluss der Partie gelöscht, durch einen neuen Spielstand ersetzt oder bis zur Fortsetzung der begonnenen Partie auf dem Gerät vorgehalten. Die lokale Fragen-/Kartenhistorie wird fortlaufend aktualisiert; ältere Einträge werden im Rahmen der vorgesehenen Rotationslogik ersetzt."
    },
    {
      "type": "p",
      "text": "Kauf- und Transaktionsdaten:"
    },
    {
      "type": "p",
      "text": "Kauf- und Transaktionsinformationen werden nur so lange verarbeitet, wie dies für die Bereitstellung oder Wiederherstellung erworbener Inhalte, die Bearbeitung von Kaufproblemen oder aufgrund gesetzlicher Verpflichtungen erforderlich ist."
    },
    {
      "type": "p",
      "text": "Beim 24h-Party-Pass werden Kaufstatus und Ablaufzeitpunkt über eine Vercel-Funktion anhand der bei RevenueCat gespeicherten Kaufdaten geprüft. Eine zusätzliche dauerhafte Transaktionstabelle für den Party-Pass wird derzeit nicht in Upstash geführt. RevenueCat und Zahlungsdienstleister speichern Transaktionsdaten nach ihren jeweiligen Aufbewahrungsfristen."
    },
    {
      "type": "p",
      "text": "Cookies:"
    },
    {
      "type": "p",
      "text": "Die Cookies „lumaga_party_session“ und „lumaga_purchase_session“ bleiben bis zu 365 Tage bestehen, sofern sie nicht vorher im Browser gelöscht werden."
    },
    {
      "type": "p",
      "text": "Wiederherstellungsdaten (Upstash):"
    },
    {
      "type": "p",
      "text": "Die Speicherdauer ist in Abschnitt 5 beschrieben. Die Zähler zur Begrenzung von Einlöseversuchen werden nach 15 Minuten automatisch gelöscht."
    },
    {
      "type": "p",
      "text": "Nutzungsanalyse (Base44):"
    },
    {
      "type": "p",
      "text": "Die Analyse-Kennung im Browser bleibt bis zur Löschung der Browserdaten bestehen. Für die bei Base44 gespeicherten Analysedaten gelten die Aufbewahrungsfristen von Base44."
    },
    {
      "type": "p",
      "text": "Technische Daten:"
    },
    {
      "type": "p",
      "text": "Technische Protokoll-, Fehler- und Sicherheitsdaten werden nur so lange gespeichert, wie dies für technische Sicherheit, Fehleranalyse und Missbrauchsprävention erforderlich ist."
    },
    {
      "type": "p",
      "text": "Support- und Feedbackdaten:"
    },
    {
      "type": "p",
      "text": "Die im Rahmen einer Support- oder Feedbackanfrage übermittelte E-Mail-Adresse sowie die Inhalte der Anfrage werden im Supportpostfach des Betreibers grundsätzlich nur so lange gespeichert, wie dies für die Bearbeitung und Beantwortung der jeweiligen Anfrage erforderlich ist."
    },
    {
      "type": "p",
      "text": "Nach Abschluss der Bearbeitung werden die im Einflussbereich des Betreibers gespeicherten Supportdaten gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen oder eine weitere Speicherung zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist. Technische Protokoll-, Versand- oder Sicherheitsdaten bei Cloudflare, Resend oder Google können hiervon unabhängig nach den jeweils geltenden Aufbewahrungsfristen dieser Dienstleister verarbeitet werden."
    },
    {
      "type": "h2",
      "text": "13. Rechte der Nutzer"
    },
    {
      "type": "p",
      "text": "Nutzer haben nach Maßgabe der gesetzlichen Voraussetzungen insbesondere folgende Rechte:"
    },
    {
      "type": "ul",
      "items": [
        "Recht auf Auskunft gemäß Art. 15 DSGVO,",
        "Recht auf Berichtigung gemäß Art. 16 DSGVO,",
        "Recht auf Löschung gemäß Art. 17 DSGVO,",
        "Recht auf Einschränkung der Verarbeitung gemäß Art. 18 DSGVO,",
        "Recht auf Datenübertragbarkeit gemäß Art. 20 DSGVO,",
        "Recht auf Widerspruch gemäß Art. 21 DSGVO."
      ]
    },
    {
      "type": "p",
      "text": "Soweit die Verarbeitung personenbezogener Daten auf einer Einwilligung beruht, besteht außerdem das Recht, diese Einwilligung jederzeit mit Wirkung für die Zukunft zu widerrufen."
    },
    {
      "type": "p",
      "text": "Die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt hiervon unberührt."
    },
    {
      "type": "p",
      "text": "Darüber hinaus besteht das Recht, sich bei einer zuständigen Datenschutzaufsichtsbehörde zu beschweren. Für den Betreiber zuständig ist der Hessische Beauftragte für Datenschutz und Informationsfreiheit, Gustav-Stresemann-Ring 1, 65189 Wiesbaden."
    },
    {
      "type": "p",
      "text": "Soweit Daten ausschließlich lokal auf dem Endgerät gespeichert werden und dem Betreiber nicht zugänglich sind, können diese regelmäßig durch Löschen der betreffenden Inhalte, Löschen der App- oder Browserdaten oder durch Deinstallation der App entfernt werden."
    },
    {
      "type": "h2",
      "text": "14. Löschung personenbezogener Daten"
    },
    {
      "type": "p",
      "text": "Support- und Feedbackdaten werden, soweit sie sich im Einflussbereich des Betreibers befinden, grundsätzlich nach Abschluss der Bearbeitung gelöscht, soweit keine rechtlichen Gründe für eine weitere Speicherung bestehen. Für technische Protokoll- und Versanddaten der eingesetzten Dienstleister gelten ergänzend deren jeweilige Aufbewahrungsregelungen."
    },
    {
      "type": "p",
      "text": "Wiederherstellungsdaten in Upstash werden auf Anfrage gelöscht. Damit sie zugeordnet werden können, muss der Wiederherstellungscode angegeben werden. Nach der Löschung ist eine Wiederherstellung der Käufe in einem anderen Browser nicht mehr möglich."
    },
    {
      "type": "p",
      "text": "Sollte ein Nutzer darüber hinaus Auskunft über personenbezogene Daten oder deren Löschung verlangen wollen, kann er sich über die in Abschnitt 19 genannten Kontaktdaten an den Betreiber wenden."
    },
    {
      "type": "p",
      "text": "Soweit eine Zuordnung der betreffenden Daten technisch möglich ist und keine gesetzlichen Aufbewahrungspflichten oder sonstigen gesetzlichen Gründe entgegenstehen, werden entsprechende personenbezogene Daten gelöscht."
    },
    {
      "type": "p",
      "text": "Bei ausschließlich lokal auf dem Gerät gespeicherten Daten hat der Betreiber grundsätzlich keinen direkten Zugriff auf diese Daten. Die Löschung kann in diesen Fällen durch den Nutzer selbst innerhalb der App, durch Löschen der lokalen App- beziehungsweise Browserdaten oder durch Deinstallation der App erfolgen."
    },
    {
      "type": "h2",
      "text": "15. Widerruf von Einwilligungen und Widerspruch"
    },
    {
      "type": "p",
      "text": "Soweit eine Verarbeitung personenbezogener Daten auf einer Einwilligung beruht, kann diese Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen werden."
    },
    {
      "type": "p",
      "text": "Der Widerruf kann – abhängig von der jeweiligen Verarbeitung – insbesondere erfolgen:"
    },
    {
      "type": "ul",
      "items": [
        "über die Einstellungen des Browsers, zum Beispiel durch Löschen von Cookies und Websitedaten,",
        "oder durch Kontaktaufnahme mit dem Betreiber."
      ]
    },
    {
      "type": "p",
      "text": "Die Rechtmäßigkeit der aufgrund einer Einwilligung bis zum Widerruf erfolgten Verarbeitung bleibt unberührt."
    },
    {
      "type": "p",
      "text": "Soweit personenbezogene Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO verarbeitet werden, besteht nach Maßgabe von Art. 21 DSGVO das Recht, aus Gründen, die sich aus der besonderen Situation des Nutzers ergeben, Widerspruch gegen die Verarbeitung einzulegen."
    },
    {
      "type": "h2",
      "text": "16. Datensicherheit"
    },
    {
      "type": "p",
      "text": "Der Betreiber trifft im Rahmen der technischen Möglichkeiten angemessene technische und organisatorische Maßnahmen zum Schutz personenbezogener Daten insbesondere vor:"
    },
    {
      "type": "ul",
      "items": [
        "Verlust,",
        "Manipulation,",
        "unbefugtem Zugriff,",
        "unbefugter Offenlegung,",
        "unbefugter Veränderung."
      ]
    },
    {
      "type": "p",
      "text": "Für Daten, die über Vercel, RevenueCat, Stripe, Upstash oder Base44 verarbeitet werden, werden die jeweils verfügbaren technischen Sicherheitsmechanismen der betreffenden Plattform eingesetzt."
    },
    {
      "type": "p",
      "text": "Für die Übermittlung von Support- und Feedbackanfragen werden zusätzlich die technischen Sicherheitsmechanismen von Cloudflare Workers, Resend und des eingesetzten E-Mail-Dienstes genutzt."
    },
    {
      "type": "p",
      "text": "Bei serverseitigen Kaufprüfungen werden die RevenueCat-Geheimschlüssel ausschließlich als Vercel-Servervariablen verwendet; an den Browser wird nur die für die jeweilige Funktion erforderliche Kaufstatusinformation zurückgegeben. Die Zuordnung einer anonymen Kennung erfolgt zusätzlich über ein signiertes Sitzungscookie."
    },
    {
      "type": "p",
      "text": "Wiederherstellungscodes werden auf dem Server nur als kryptografischer Prüfwert gespeichert, nicht im Klartext. IP-Adressen werden für die Begrenzung von Einlöseversuchen ebenfalls nur als Prüfwert verarbeitet."
    },
    {
      "type": "p",
      "text": "Trotz angemessener Sicherheitsmaßnahmen kann bei der Übertragung und Verarbeitung von Daten über das Internet keine absolute Sicherheit garantiert werden."
    },
    {
      "type": "h2",
      "text": "17. Änderungen dieser Datenschutzerklärung"
    },
    {
      "type": "p",
      "text": "Diese Datenschutzerklärung kann angepasst werden, wenn:"
    },
    {
      "type": "ul",
      "items": [
        "neue Funktionen eingeführt werden,",
        "neue Dienste integriert werden,",
        "bestehende Funktionen wesentlich geändert werden,",
        "sich technische Abläufe ändern,",
        "oder gesetzliche Anforderungen eine Anpassung erforderlich machen."
      ]
    },
    {
      "type": "p",
      "text": "Bei wesentlichen Änderungen der Datenverarbeitung wird die Datenschutzerklärung entsprechend aktualisiert."
    },
    {
      "type": "p",
      "text": "Es gilt die jeweils innerhalb der App beziehungsweise an der dafür vorgesehenen Stelle bereitgestellte aktuelle Fassung."
    },
    {
      "type": "h3",
      "text": "17.1 Externe Links und Käufe im Browser"
    },
    {
      "type": "p",
      "text": "Bei einem Klick auf einen Web-Kauf kann der Nutzer zu einem von RevenueCat bereitgestellten Zahlungsprozess weitergeleitet werden, in den Stripe eingebunden ist. Dort können Zahlungsdaten, Kontaktdaten für Belege und technische Daten gemäß den beim Checkout bereitgestellten Informationen verarbeitet werden. Der technische Kaufstatus wird anschließend zur Berechtigungsprüfung bei RevenueCat abgefragt. Eine automatische Weiterleitung zurück zu Lumaga ist keine selbstständige Bestätigung einer erfolgreichen Zahlung."
    },
    {
      "type": "p",
      "text": "Bei Aufruf externer Websites gelten zusätzlich die Datenschutzhinweise des jeweiligen Anbieters."
    },
    {
      "type": "h2",
      "text": "18. Support- und Feedbackanfragen"
    },
    {
      "type": "p",
      "text": "In der LUMAGA-App stellen wir ein Support- bzw. Feedbackfenster zur Verfügung."
    },
    {
      "type": "p",
      "text": "Der technische Datenfluss für eine Support- oder Feedbackanfrage erfolgt derzeit wie folgt: Nutzer → App → Cloudflare Workers → Resend → Supportpostfach des Betreibers (Gmail)."
    },
    {
      "type": "p",
      "text": "Darüber können Nutzer insbesondere:"
    },
    {
      "type": "ul",
      "items": [
        "Fragen stellen,",
        "technische Probleme melden,",
        "Fehler melden,",
        "Verbesserungsvorschläge einreichen,",
        "oder sonstige Rückmeldungen zur App übermitteln."
      ]
    },
    {
      "type": "p",
      "text": "Zur Bearbeitung einer Anfrage werden insbesondere folgende Daten verarbeitet:"
    },
    {
      "type": "ul",
      "items": [
        "die angegebene E-Mail-Adresse,",
        "der Inhalt der Nachricht,",
        "die vom Nutzer freiwillig innerhalb der Nachricht angegebenen Informationen,",
        "gegebenenfalls technisch erforderliche Informationen, soweit diese im Zusammenhang mit der Anfrage übermittelt werden.",
        "Beim Aufruf des Support-Endpunkts können zusätzlich insbesondere die IP-Adresse, Datum und Uhrzeit sowie technische Anfrage-, Verbindungs- und Protokolldaten verarbeitet werden."
      ]
    },
    {
      "type": "p",
      "text": "Die Angabe einer E-Mail-Adresse ist verpflichtend. Sie wird benötigt, damit wir die Anfrage bearbeiten und dem Nutzer eine Rückmeldung zukommen lassen können."
    },
    {
      "type": "p",
      "text": "Ohne Angabe einer E-Mail-Adresse kann eine Support- oder Feedbackanfrage über das dafür vorgesehene Fenster nicht übermittelt werden."
    },
    {
      "type": "p",
      "text": "Nutzer sollten innerhalb ihrer Nachricht nur diejenigen personenbezogenen Informationen angeben, die für die Bearbeitung ihrer Anfrage erforderlich sind. Insbesondere sollten keine unnötigen personenbezogenen Daten anderer Personen übermittelt werden."
    },
    {
      "type": "p",
      "text": "Die Verarbeitung erfolgt zum Zweck der:"
    },
    {
      "type": "ul",
      "items": [
        "Entgegennahme der Anfrage,",
        "Bearbeitung der Anfrage,",
        "Beantwortung der Anfrage,",
        "technischen Fehlerbehebung,",
        "gegebenenfalls Verbesserung der betroffenen App-Funktion auf Grundlage der erhaltenen Fehlermeldung oder Rückmeldung."
      ]
    },
    {
      "type": "p",
      "text": "Soweit die Anfrage im Zusammenhang mit der Nutzung der App, einem Kauf oder einem bestehenden beziehungsweise angebahnten Vertragsverhältnis steht, erfolgt die Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO."
    },
    {
      "type": "p",
      "text": "Bei allgemeinen Fragen, Feedback, Verbesserungsvorschlägen und sonstigen Supportanfragen erfolgt die Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO."
    },
    {
      "type": "p",
      "text": "Das berechtigte Interesse besteht in der Bearbeitung von Nutzeranfragen, der Bereitstellung eines funktionierenden Supports, der Behebung technischer Fehler sowie der Verbesserung der Stabilität und Funktionsfähigkeit der App."
    },
    {
      "type": "p",
      "text": "Die Supportnachricht wird nicht in der Base44-Datenbank gespeichert. Sie wird über Cloudflare Workers an Resend übertragen und per E-Mail an das Supportpostfach des Betreibers zugestellt."
    },
    {
      "type": "p",
      "text": "Der Betreiber speichert die E-Mail-Adresse und den Inhalt der Anfrage im Supportpostfach grundsätzlich nur so lange, wie dies für die Bearbeitung und Beantwortung der Anfrage erforderlich ist."
    },
    {
      "type": "p",
      "text": "Anschließend werden die im Einflussbereich des Betreibers gespeicherten Daten gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen oder eine weitere Speicherung zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist."
    },
    {
      "type": "p",
      "text": "Zur technischen Bereitstellung des Supportfensters werden Cloudflare Workers und Resend eingesetzt. Da die Nachricht an ein Gmail-Postfach zugestellt wird, kann auch Google die Supportdaten im Rahmen des E-Mail-Dienstes verarbeiten. Die beteiligten Dienstleister können außerdem technische Protokoll-, Sicherheits- und Versanddaten nach ihren jeweiligen datenschutzrechtlichen Bedingungen und Aufbewahrungsfristen verarbeiten."
    },
    {
      "type": "p",
      "text": "Eine darüber hinausgehende Weitergabe der Supportdaten erfolgt nur, wenn hierfür eine gesetzliche Grundlage besteht."
    },
    {
      "type": "h2",
      "text": "19. Kontakt"
    },
    {
      "type": "p",
      "text": "Bei Fragen zum Datenschutz, zur Verarbeitung personenbezogener Daten oder zur Ausübung der vorgenannten Rechte können sich Nutzer an den Verantwortlichen wenden:"
    },
    {
      "type": "p",
      "text": "Christian Raab"
    },
    {
      "type": "p",
      "text": "Tulpenweg 9"
    },
    {
      "type": "p",
      "text": "63579 Freigericht"
    },
    {
      "type": "p",
      "text": "Deutschland"
    },
    {
      "type": "p",
      "text": "E-Mail: crappsmil@gmail.com"
    }
  ]
};
