export type IntroSlide = {
  section: string;
  title: string;
  lead: string;
  cards: readonly { title: string; text: string }[];
  takeaway: string;
  prompt: string;
  cue: string;
  board?: readonly { title: string; item: string }[];
  numbered?: boolean;
  source?: { label: string; href: string };
};

export const INTRO_SLIDES: readonly IntroSlide[] = [
  {
    section: "Schätzen in der Softwareentwicklung",
    title: "Gleiches Ticket. Unterschiedliche Vorstellungen.",
    lead: "„Das ist doch nur ein kleiner Button.“ Beim Entwickeln hängen am sichtbaren Feature oft Fragen, Sonderfälle und technische Arbeit, die im Ticket noch fehlen.",
    cards: [
      { title: "Unterschiedliches Verständnis", text: "Eine Person denkt an den Standardfall. Eine andere berücksichtigt Berechtigungen, Fehlerzustände und bestehende Daten." },
      { title: "Unterschiedliche Erfahrung", text: "Wer den Code kennt, sieht Wiederverwendung. Wer eine ähnliche Änderung erlebt hat, erinnert sich an deren Stolperstellen." },
      { title: "Unvollständiges Wissen", text: "Manche Anforderungen und technischen Grenzen entdecken wir erst beim Untersuchen oder Umsetzen der Aufgabe." },
    ],
    takeaway: "Beim Schätzen machen wir sichtbar, welche Arbeit und welche Annahmen hinter einer Zahl stecken.",
    prompt: "Welche vermeintlich kleine Story ist bei euch zuletzt überraschend groß geworden?",
    cue: "Hole ein kurzes Beispiel aus einem Sprint ab. Es geht um das gemeinsame Verständnis einer Entwicklungsaufgabe. Die Zahl hilft beim Vergleichen und Planen; sie ist eine Einschätzung mit dem heutigen Wissen.",
  },
  {
    section: "Was liegt da eigentlich im Backlog?",
    title: "Feature → User Story → Tasks",
    lead: "Eine typische Aufteilung am Beispiel Benachrichtigungen. Vor dem Schätzen klären wir, auf welcher Ebene wir gerade sprechen.",
    cards: [
      { title: "Feature · die Fähigkeit", text: "„Benachrichtigungen steuern.“ Kann mehrere Kanäle, Einstellungen und einzelne Stories umfassen." },
      { title: "User Story · der Nutzen", text: "„Als Nutzer möchte ich E-Mail-Benachrichtigungen pausieren, damit ich ungestört arbeiten kann.“ Ein abgrenzbares, prüfbares Ergebnis." },
      { title: "Tasks · die Umsetzung", text: "Zum Beispiel UI-Schalter bauen, Einstellung über die API speichern und Tests ergänzen. Zusammen liefern sie die Story." },
    ],
    takeaway: "Hier schätzen wir die ganze Story. Ihre Tasks helfen, die Arbeit zu verstehen; dieselbe Arbeit wird nicht doppelt gezählt.",
    prompt: "Besprechen wir gerade einen technischen Arbeitsschritt oder schon einen nutzbaren Funktionsumfang?",
    cue: "Features, User Stories und Tasks sind gängige Teambegriffe. Scrum spricht von Product Backlog Items und schreibt diese Hierarchie nicht vor. Auch Bugs und technische Verbesserungen können Backlog Items sein. Tasks können Teams zusätzlich nach ihrer eigenen Konvention planen oder schätzen.",
    source: { label: "Agile Alliance · User Stories", href: "https://agilealliance.org/glossary/user-stories/" },
  },
  {
    section: "Der Ablauf im Scrum-Team",
    title: "Vom Product Backlog aufs Sprintboard.",
    lead: "Die Schätzung unterstützt die Vorbereitung und Planung. Während der Umsetzung macht das Board den tatsächlichen Arbeitsstand sichtbar.",
    cards: [
      { title: "Im Refinement", text: "Stories besprechen, offene Fragen klären, große Einträge teilen und ihre Größe einschätzen." },
      { title: "Im Sprint Planning", text: "Sprint-Ziel vereinbaren. Die Developers wählen passende Arbeit und planen deren Umsetzung." },
      { title: "Im laufenden Sprint", text: "Fortschritt und Hindernisse prüfen, etwa im Daily Scrum. Den Plan bei neuen Erkenntnissen anpassen." },
    ],
    board: [
      { title: "Zu tun", item: "Profilbild ändern" },
      { title: "In Arbeit", item: "Zeitzone speichern" },
      { title: "Code-Review / Test", item: "Passwort ändern" },
      { title: "Done", item: "Suchfilter merken" },
    ],
    takeaway: "Eine geschätzte Story ist noch keine fertige Story. „Done“ richtet sich nach dem vereinbarten Qualitätsstandard.",
    prompt: "Welche Arbeit fehlt bei euch häufig noch, wenn die Implementierung schon fertig aussieht?",
    cue: "Das Board ist ein Beispiel mit verschiedenen Stories; Spalten sind Teamkonvention. Refinement ist eine laufende Aktivität, kein zusätzliches vorgeschriebenes Scrum-Event. Review und Retrospektive liefern Feedback zu Produkt und Zusammenarbeit. Der Scrum Master unterstützt den Prozess; der PO klärt Ziel und Priorität.",
    source: { label: "Scrum Guide · Product Backlog", href: "https://scrumguides.org/scrum-guide.html#product-backlog" },
  },
  {
    section: "Die Story gemeinsam verstehen",
    title: "Was muss für diese Story wahr sein, damit sie fertig ist?",
    lead: "Vor der Zahl braucht das Team eine gemeinsame Vorstellung von Verhalten, Grenzen und Qualität. Der Titel allein reicht dafür selten aus.",
    cards: [
      { title: "Nutzen & Umfang", text: "Für wen bauen wir was? Welche Fälle gehören dazu, welche bewusst noch nicht? Welche Abhängigkeiten gibt es?" },
      { title: "Akzeptanzkriterien", text: "Prüfbare Erwartungen an diese Story: zum Beispiel, dass eine pausierte Benachrichtigung tatsächlich nicht versendet wird." },
      { title: "Definition of Done", text: "Der gemeinsame Qualitätsstandard: zum Beispiel integriert, getestet, reviewt und nutzbar. Für unsere Übung zählt auch das Deployment dazu." },
    ],
    takeaway: "Offene Fragen zum Verhalten klären wir mit dem Product Owner. Technische Annahmen prüfen wir am System.",
    prompt: "Welche fehlende Antwort könnte den Umfang dieser Story deutlich verändern?",
    cue: "Akzeptanzkriterien sind storybezogen, die Definition of Done gilt über einzelne Stories hinweg. Eine zusätzliche Definition of Ready kann eine Teamvereinbarung sein; Scrum verlangt sie nicht. Für die Übung keine späteren Produktantworten vorwegnehmen.",
    source: { label: "Scrum Guide · Definition of Done", href: "https://scrumguides.org/scrum-guide.html#commitment-definition-of-done" },
  },
  {
    section: "Was fließt in die Schätzung ein?",
    title: "Die ganze Arbeit bis „Done“ betrachten.",
    lead: "Arbeitsmenge, Komplexität und Unsicherheit beeinflussen den Aufwand. Geht die Story gedanklich durch – vom bestehenden Code bis zum geprüften Ergebnis.",
    cards: [
      { title: "Umfang & Sonderfälle", text: "Standardfall, Validierung, leere Daten, Fehlermeldungen und unterschiedliche Rollen." },
      { title: "Technische Komplexität", text: "Datenmodell, Schnittstellen, Migrationen, Nebenläufigkeit und bestehende Kopplungen." },
      { title: "Vorwissen & Wiederverwendung", text: "Wie gut kennen wir den Bereich? Was ist vorhanden und tatsächlich wiederverwendbar?" },
      { title: "Tests & Qualität", text: "Testdaten, Regressionen, Sicherheit, Performance und Barrierefreiheit passend zur Story." },
      { title: "Integration & Fertigstellen", text: "Code-Review, Nacharbeit, Dokumentation und notwendige Deployment-Schritte." },
      { title: "Risiken & Abhängigkeiten", text: "Ungeklärte Anforderungen, fremde APIs und notwendige Änderungen anderer Teams." },
    ],
    takeaway: "Die Kalenderdauer hängt zusätzlich von Kapazität und Wartezeiten ab. Eine kleinere Implementierung allein garantiert keinen früheren Abschluss.",
    prompt: "Welchen dieser Anteile vergesst ihr beim ersten Blick auf ein Ticket am ehesten?",
    cue: "Die Liste ist eine Denkstütze, keine Formel mit sechs Punktwerten. Reine Wartezeit und aktive Arbeit unterscheiden. Betrachtet den Aufwand des Teams unter seinen Arbeitsbedingungen, einschließlich der vereinbarten Qualität. KI kann einzelne Arbeitsanteile verändern; das wird später untersucht.",
  },
  {
    section: "Relativ schätzen mit Story Points",
    title: "Wie groß ist diese Story im Vergleich zu bekannten Stories?",
    lead: "Story Points drücken relativen Gesamtaufwand aus. Wir vergleichen mit abgeschlossener Arbeit des eigenen Teams, die dieselbe Definition of Done erfüllt.",
    cards: [
      { title: "Referenzen wählen", text: "Einige bekannte kleine und größere Stories bilden eure Vergleichsbasis. Zu Beginn Beispiele gemeinsam einordnen und später an realer Arbeit prüfen." },
      { title: "Größenordnungen nutzen", text: "Unsere Fibonacci-Skala: 1, 2, 3, 5, 8, 13 und „?“. Die Abstände helfen, über Größenordnungen statt über vermeintlich exakte Zwischenwerte zu sprechen." },
      { title: "Den Maßstab beibehalten", text: "Arbeitsmenge, Schwierigkeit und Unsicherheit zusammen betrachten. Points haben keinen festen Stundenfaktor und eignen sich nicht zum Vergleich von Teams oder Personen." },
    ],
    takeaway: "Scrum schreibt Story Points nicht vor. Sie sind die Schätzmethode, die wir in diesem Workshop ausprobieren.",
    prompt: "Welche abgeschlossene Story würdet ihr in eurem Team als Referenz verwenden?",
    cue: "Points beschreiben relativen Aufwand, nicht nur Komplexität. Eine größere Arbeitsmenge kann bei gleicher Schwierigkeit mehr Aufwand bedeuten. Der Maßstab gehört zum Team; die Points einer Story hängen nicht davon ab, welcher Person sie zugewiesen wird. Unsere konkreten Referenzen erscheinen erst beim Übungsticket.",
    source: { label: "Mike Cohn · Story Points", href: "https://www.mountaingoatsoftware.com/agile/what-are-story-points" },
  },
  {
    section: "So funktioniert Planning Poker",
    title: "Erst selbst denken. Dann gemeinsam aufdecken.",
    lead: "Die Menschen, die die Story umsetzen, schätzen. Der Product Owner erläutert das gewünschte Ergebnis und beantwortet fachliche Fragen.",
    numbered: true,
    cards: [
      { title: "Story klären", text: "Umfang, Akzeptanzkriterien und offene Fragen besprechen. Dieselbe Aufgabe vor Augen haben." },
      { title: "Verdeckt wählen", text: "Alle wählen unabhängig eine Karte und halten ihre wichtigste Annahme fest. Noch keine Zahl vorsagen." },
      { title: "Gemeinsam aufdecken", text: "Bei deutlichen Unterschieden erklären zuerst die Personen mit niedriger und hoher Schätzung ihre Sicht." },
      { title: "Klären & erneut wählen", text: "Annahmen vergleichen und mit dem neuen Verständnis schätzen. Bleibt zu viel offen, die Klärung als nächsten Schritt festhalten." },
    ],
    takeaway: "Ein Mittelwert erklärt keine Meinungsverschiedenheit. Interessant ist, welche Arbeit die anderen mitgedacht haben.",
    prompt: "Welche Information könnte erklären, warum dieselbe Story so unterschiedlich eingeschätzt wird?",
    cue: "Alle zur Umsetzung nötigen Perspektiven einbeziehen, auch Test und UX. Die Moderation hilft, ohne eine Zielzahl vorzugeben. Die erste genannte Zahl kann andere beeinflussen; deshalb verdeckt beginnen. Im echten Planning Poker kann das Team eine gemeinsame Schätzung festhalten. Unsere Übung bewahrt bewusst die Einzelstimmen zum Vergleich.",
    source: { label: "Mike Cohn · Planning Poker", href: "https://www.mountaingoatsoftware.com/agile/story-points/planning-poker" },
  },
  {
    section: "Wenn die Story zu groß oder zu unklar ist",
    title: "Klären, kleiner schneiden oder gezielt untersuchen.",
    lead: "„?“ ist eine sinnvolle Antwort, wenn eine entscheidende Grundlage fehlt. Benennt, welches Wissen ihr für eine begründete Schätzung braucht.",
    cards: [
      { title: "Im Refinement klären", text: "Fakt und Annahme trennen: Was belegen Code oder Tests? Welches Verhalten muss der PO entscheiden? Die konkrete Rückfrage festhalten." },
      { title: "Die Story schneiden", text: "Ein kleineres nutzbares Ergebnis wählen, etwa Benachrichtigungen zunächst für eine Ereignisart. Auch dieser Schnitt umfasst UI, Logik und Tests." },
      { title: "Einen Spike vereinbaren", text: "Eine technische Unbekannte in einem begrenzten Versuch untersuchen: klare Frage, Zeitbox und Ergebnis. Danach die Umsetzung neu einschätzen." },
    ],
    takeaway: "Eine große Zahl löst keine Unklarheit. Mehr Wissen kann die nächste Schätzung kleiner, größer oder unverändert ausfallen lassen.",
    prompt: "Ist die Aufgabe wirklich groß – oder wissen wir noch zu wenig über sie?",
    cue: "Beim Schneiden auf ein prüfbares Ergebnis achten. UI, Backend und Tests sind oft Tasks innerhalb desselben Schnitts. Für einen Spike vorher das Erkenntnisziel vereinbaren, etwa die Eignung einer Bibliothek. Die konkreten offenen Fragen zum Übungsticket entstehen erst aus den Annahmen der Runde.",
    source: { label: "Agile Alliance · Story Splitting", href: "https://agilealliance.org/glossary/story-splitting/" },
  },
  {
    section: "Von der Schätzung zur Sprintplanung",
    title: "Was passt in den Sprint – und was lernen wir daraus?",
    lead: "Für die Planung braucht es neben der Größe der Stories auch ein Sprint-Ziel, tatsächliche Verfügbarkeit, Abhängigkeiten und Erfahrung aus bisheriger Arbeit.",
    cards: [
      { title: "Mit Erfahrung planen", text: "Abgeschlossene Arbeit mehrerer Sprints betrachten. Bei Story Points beschreibt Velocity die pro Sprint fertiggestellten Points; sie kann schwanken." },
      { title: "Aktuelle Bedingungen prüfen", text: "Urlaub, Support, fehlende Expertise und Blockaden berücksichtigen. Bei einem neuen Team fehlen Vergleichsdaten: vorsichtig beginnen und daraus lernen." },
      { title: "Annahmen überprüfen", text: "Nach der Umsetzung besprechen, welche Arbeit hinzukam. Referenzen und Vorgehen verbessern. Velocity ist kein Leistungsziel für Personen oder Teams." },
    ],
    takeaway: "Jetzt schätzt ihr eine Story, klärt gemeinsam eure Fragen und schätzt erneut. Die KI unterstützt uns dabei, den vorhandenen Code zu verstehen.",
    prompt: "Behaltet für die Übung im Kopf: Welche Annahme trägt meine Schätzung?",
    cue: "Die Developers treffen die Auswahl für den Sprint in Abstimmung mit dem PO; die Vergangenheit allein ist keine Zusage. Im Workshop gibt es keine richtige vorbereitete Zahl. Belege der KI werden geprüft, Produktfragen entscheidet der PO. Mit „Zur ersten Schätzung“ beginnt ORD-42.",
    source: { label: "Scrum Guide · Sprint Planning", href: "https://scrumguides.org/scrum-guide.html#sprint-planning" },
  },
];
