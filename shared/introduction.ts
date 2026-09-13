export type IntroSlide = {
  section: string;
  title: string;
  lead: string;
  cards: readonly { title: string; text: string }[];
  takeaway: string;
  prompt: string;
  cue: string;
  quote?: { label: string; text: string };
  numbered?: boolean;
  source?: { label: string; href: string };
};

const estimationSource = {
  label: "GAO · Grundlagen einer Schätzung",
  href: "https://www.gao.gov/products/gao-20-195g",
};

export const INTRO_SLIDES: readonly IntroSlide[] = [
  {
    section: "Warum wir schätzen",
    title: "„Was kostet das – und wann ist es fertig?“",
    lead: "Im Consulting beginnt diese Frage oft, bevor wir das Projekt richtig kennen. Zuerst klären wir, welche Entscheidung die Schätzung unterstützen soll.",
    cards: [
      { title: "Priorisieren", text: "Welche Idee lohnt sich im Verhältnis zu ihrem erwarteten Nutzen und Aufwand?" },
      { title: "Einen Rahmen finden", text: "Welcher Umfang passt zum verfügbaren Budget? Was gehört in eine erste Version?" },
      { title: "Lieferung planen", text: "Welches Team brauchen wir, welche Abhängigkeiten gibt es und wann ist ein Ergebnis realistisch?" },
    ],
    takeaway: "Eine brauchbare Schätzung beschreibt ihren Umfang, ihre Grundlage und ihre Unsicherheit.",
    prompt: "Für welche dieser Entscheidungen schätzt ihr im Kundenalltag am häufigsten?",
    cue: "Hole ein kurzes Beispiel aus der Runde ab. Unterscheide eine erste Orientierung im Vertrieb von der Planung einer bereits geklärten Aufgabe. Noch keine Zahl für die spätere Übung nennen.",
    source: estimationSource,
  },
  {
    section: "Begriffe auseinanderhalten",
    title: "Aufwand, Dauer und Preis beantworten verschiedene Fragen.",
    lead: "Vor jeder Zahl gehören die Einheit und die Perspektive geklärt: Wie viel Arbeit, wie viel Kalenderzeit oder welches Angebot?",
    cards: [
      { title: "Aufwand", text: "Die insgesamt erforderliche Arbeit, zum Beispiel in Personenstunden oder Personentagen. Klärung, Tests und Review zählen mit." },
      { title: "Dauer", text: "Die Zeit bis zur Lieferung. Sie hängt auch von verfügbarer Kapazität, Reihenfolge, Wartezeiten und Freigaben ab." },
      { title: "Preis", text: "Die kaufmännische Kalkulation: Aufwand, vereinbarte Sätze, weitere Kosten und der Umgang mit Risiken fließen ein." },
    ],
    takeaway: "Mehr Personen verkürzen die Dauer nur, soweit sich Arbeit sinnvoll parallel erledigen lässt.",
    prompt: "Was könnte einen Termin verschieben, obwohl sich der Entwicklungsaufwand kaum ändert?",
    cue: "Nenne als Beispiel eine ausstehende Kundenfreigabe: wenig zusätzliche Arbeit, aber verstrichene Kalenderzeit. Ein Personentag ist eine vereinbarte Aufwandseinheit; die verfügbaren Personentage des Teams müssen separat geklärt werden.",
  },
  {
    section: "Die Grundlage klären",
    title: "Was genau soll am Ende fertig sein?",
    lead: "Derselbe kurze Kundenwunsch kann sehr verschiedene Lieferumfänge meinen. Diese Fragen gehören vor die Schätzung.",
    cards: [
      { title: "Ergebnis & Grenzen", text: "Wer braucht welchen Nutzen? Welche Funktionen und Sonderfälle sind enthalten, welche ausdrücklich ausgenommen?" },
      { title: "Abnahme & Qualität", text: "Woran erkennen wir die Erfüllung? Welche Anforderungen gelten für Sicherheit, Datenschutz, Performance und Barrierefreiheit?" },
      { title: "Umfeld & Mitwirkung", text: "Welche Systeme, Daten und Zugänge gibt es? Wer entscheidet beim Kunden und wer nimmt das Ergebnis ab?" },
    ],
    takeaway: "Akzeptanzkriterien beschreiben die konkrete Aufgabe. Die Definition of Done beschreibt den gemeinsamen Qualitätsstandard.",
    prompt: "Bedeutet „fertig“ bei euch implementiert, abgenommen oder bereits nutzbar?",
    cue: "Lass die Runde den eigenen Fertigbegriff prüfen. In unserer späteren Übung gilt: integriert, getestet, reviewt und deployt. Die fachlichen Antworten zum Übungsticket kommen erst in der Klärungsphase.",
    source: { label: "Scrum Guide · Definition of Done", href: "https://scrumguides.org/scrum-guide.html#commitment-definition-of-done" },
  },
  {
    section: "Den ganzen Lieferweg betrachten",
    title: "Bis zur Lieferung gehört mehr als Code dazu.",
    lead: "Je nach Auftrag müssen diese Arbeitsanteile in die Schätzung – mit klarer Zuständigkeit bei uns oder beim Kunden.",
    cards: [
      { title: "Klärung & Gestaltung", text: "Fachliche Rückfragen, Akzeptanzkriterien, UX und Lösungsentwurf." },
      { title: "Einarbeitung & Technik", text: "Domänenwissen, bestehender Code, technische Schulden, Zugänge und Umgebungen." },
      { title: "Umsetzung & Integration", text: "UI, Backend, Datenmigration, Schnittstellen und Fehlerfälle." },
      { title: "Tests & Review", text: "Testdaten, automatisierte und manuelle Prüfungen, Review und Nacharbeit." },
      { title: "Auslieferung & Übergabe", text: "Deployment, Monitoring, Dokumentation, Schulung und Betriebsübergabe." },
      { title: "Zusammenarbeit", text: "Abstimmung, Koordination, Kundenabnahme und Arbeit anderer Teams." },
    ],
    takeaway: "Für einen Termin zusätzlich echte Verfügbarkeit, Urlaub, Parallelprojekte und externe Wartezeiten berücksichtigen.",
    prompt: "Welcher dieser Anteile wird bei euren ersten Schätzungen am häufigsten vergessen?",
    cue: "Hole höchstens zwei Beispiele ab. Trenne aktive Abstimmungsarbeit von reinem Warten. Wenn KI die Implementierung beschleunigt, müssen die übrigen Anteile weiterhin betrachtet werden.",
  },
  {
    section: "Unsicherheit sichtbar machen",
    title: "Was wissen wir – und was setzen wir voraus?",
    lead: "Beispiel: Eine neue Anbindung an ein Kundensystem. Drei unterschiedliche Aussagen brauchen drei unterschiedliche Behandlungen.",
    cards: [
      { title: "Fakt", text: "„Die API-Dokumentation liegt vor.“ Quelle festhalten und prüfen, was sie tatsächlich belegt." },
      { title: "Annahme", text: "„Die Testumgebung steht zum Projektstart bereit.“ Vom Kunden bestätigen lassen und eine verantwortliche Person benennen." },
      { title: "Risiko", text: "„Ein knappes API-Limit könnte zusätzliche Verarbeitung erfordern.“ Eintritt, Auswirkung und mögliche Maßnahmen betrachten." },
    ],
    takeaway: "Unsicherheit durch Fragen oder einen begrenzten technischen Versuch verringern; verbleibende Risiken mit der Spanne erklären.",
    prompt: "Welche ungeprüfte Annahme würde eure Schätzung am stärksten verändern?",
    cue: "Ein Spike ist ein zeitlich begrenzter Versuch mit einer konkreten Frage und einem Ergebnis. Reserven anhand von Risiken erläutern und nicht mehrfach versteckt einrechnen. Mehr Wissen kann eine Schätzung auch erhöhen.",
    source: estimationSource,
  },
  {
    section: "Ein neues Kundenprojekt schätzen",
    title: "Vom groben Bild zur begründeten Spanne.",
    lead: "Bei wenig Projektwissen passt eine erste Orientierung mit offenen Fragen. Mehr Verbindlichkeit braucht bessere Grundlagen.",
    numbered: true,
    cards: [
      { title: "Auftrag eingrenzen", text: "Ziel, erste Version, Ausschlüsse, Qualitätsanspruch und Kundenmitwirkung gemeinsam festhalten." },
      { title: "Mit dem Lieferteam zerlegen", text: "Überschaubare Ergebnisse und Arbeitspakete bilden. Entwicklung, Test und Betrieb früh einbeziehen." },
      { title: "Vergleichen & prüfen", text: "Ähnliche abgeschlossene Projekte heranziehen. Unterschiede erklären; große Unbekannte in Discovery oder Spikes untersuchen." },
      { title: "Spanne & nächsten Stand nennen", text: "Annahmen und Risiken dokumentieren. Für Termine Kapazität und Abhängigkeiten ergänzen; nach neuen Erkenntnissen aktualisieren." },
    ],
    takeaway: "Ohne eigene Vergleichsdaten zunächst breiter schätzen und mit realer Lieferung nachkalibrieren.",
    prompt: "Welche Information würdet ihr bei einem unbekannten Projekt zuerst beschaffen?",
    cue: "Eine erste Größenordnung kann für eine Investitionsentscheidung genügen. Für eine belastbarere Planung braucht es mehr Klärung. Vergleichsprojekte hinsichtlich Team, Technologie, Umfang und Qualität einordnen; keine fremde Teamgeschwindigkeit übernehmen.",
    source: estimationSource,
  },
  {
    section: "Im Kundengespräch",
    title: "Eine Zahl braucht Bedingungen und einen nächsten Schritt.",
    lead: "Ziel, Prognose und Zusage sollten im Gespräch ausdrücklich benannt werden.",
    quote: {
      label: "Fiktives Gespräch · erste Version eines Mitarbeitendenportals",
      text: "„Für die vereinbarte erste Version rechnen wir aktuell mit drei bis fünf Wochen. Das setzt das besprochene Team, nutzbare Testzugänge und zeitnahe Freigaben voraus. Nach dem Schnittstellen-Workshop am Dienstag aktualisieren wir die Prognose und klären, welchen Liefertermin wir zusagen können.“",
    },
    cards: [
      { title: "Ziel", text: "Der gewünschte Termin oder Budgetrahmen des Kunden." },
      { title: "Prognose", text: "Unsere aktuelle Einschätzung mit Spanne, Umfang und Voraussetzungen." },
      { title: "Zusage", text: "Eine bewusst vereinbarte Verpflichtung nach Prüfung von Umfang, Kapazität und Risiken." },
    ],
    takeaway: "Bei Termindruck gemeinsam über Umfang, Reihenfolge und Abhängigkeiten sprechen. Neue Anforderungen lösen eine neue Bewertung aus.",
    prompt: "Was müsste geklärt sein, bevor ihr aus dieser Prognose eine Zusage macht?",
    cue: "Das Beispiel ist keine Prognose für ORD-42. Spannen müssen aus Daten und Risiken begründet werden; die Beispielwerte sind frei gewählt. Unterscheide auch Aufwandsschätzung und Angebot: Risikotragung und Änderungsprozess gehören ins kaufmännische Gespräch.",
  },
  {
    section: "Unsere Methode für die Übung",
    title: "Story Points machen Arbeit im Team vergleichbar.",
    lead: "Wir schätzen den relativen Gesamtaufwand bis „fertig“. Arbeitsmenge, Komplexität und Unsicherheit beeinflussen die Einschätzung.",
    cards: [
      { title: "Mit Referenzen vergleichen", text: "Wie groß ist die Aufgabe gegenüber bekannter, abgeschlossener Arbeit bei gleichem Qualitätsstandard?" },
      { title: "Unabhängig beginnen", text: "Erst selbst schätzen, dann gemeinsam aufdecken. Unterschiede in den Begründungen besprechen." },
      { title: "Unklarheit benennen", text: "„?“ ist erlaubt. Die wichtigste Annahme gehört zur Zahl – und wird anschließend zur Rückfrage." },
    ],
    takeaway: "Story Points sind teambezogen. Sie haben keinen festen Stundenfaktor und liefern allein keinen Kundentermin.",
    prompt: "Was könnte hinter zwei sehr unterschiedlichen Zahlen zur selben Aufgabe stecken?",
    cue: "Das ist die gewählte Methode dieses Workshops; Scrum schreibt Story Points nicht vor. Die Übung zeigt gleich fiktive Teamreferenzen. Nicht auf eine gemeinsame Zahl drängen: Die Unterschiede eröffnen die Klärung.",
    source: { label: "Mike Cohn · Story Points", href: "https://www.mountaingoatsoftware.com/agile/what-are-story-points" },
  },
  {
    section: "Jetzt wenden wir es an",
    title: "Wie verändert besseres Verständnis unsere Schätzung?",
    lead: "Gleich bekommt ihr einen kurzen Kundenwunsch. Achtet darauf, welche Arbeit ihr einschließt und welche Annahme eure Zahl trägt.",
    numbered: true,
    cards: [
      { title: "Erst einschätzen", text: "Aufgabe und Referenzen lesen. Zahl und wichtigste Annahme unabhängig abgeben." },
      { title: "Gemeinsam klären", text: "Fragen sammeln, mit KI den vorhandenen Code untersuchen und Produktentscheidungen einholen." },
      { title: "Erneut einschätzen", text: "Mit dem neuen Wissen schätzen und die Begründungen vergleichen. Danach folgt das Kundengespräch." },
    ],
    takeaway: "KI kann bei der Klärung helfen. Belege prüfen, Produktentscheidungen treffen und Zusagen verantworten bleibt unsere Aufgabe.",
    prompt: "Behaltet im Kopf: Welche Information könnte meine Einschätzung verändern?",
    cue: "Mit „Zur ersten Schätzung“ erscheint das Ticket. Es gibt keine vorbereitete richtige Zahl. Größer, kleiner oder unverändert sind mögliche Ergebnisse; wir untersuchen begründete Änderungen, keinen isolierten KI-Zeitgewinn.",
  },
];
