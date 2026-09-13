export const POINTS = ["1", "2", "3", "5", "8", "13", "?"] as const;
export type Point = (typeof POINTS)[number];

export const PHASES = [
  "lobby",
  "estimate1",
  "reveal1",
  "refine",
  "scope",
  "estimate2",
  "compare",
  "transfer",
  "done",
] as const;
export type Phase = (typeof PHASES)[number];

export const STEPS = [
  { title: "Ankommen", phases: ["lobby"] },
  { title: "Erste Schätzung", phases: ["estimate1", "reveal1"] },
  { title: "Gemeinsam klären", phases: ["refine", "scope"] },
  { title: "Neu einschätzen", phases: ["estimate2", "compare"] },
  { title: "In den Alltag", phases: ["transfer"] },
  { title: "Mitnehmen", phases: ["done"] },
] as const;

export const PHASE_COPY: Record<
  Phase,
  {
    eyebrow: string;
    title: string;
    description: string;
    action: string;
    cue: string;
  }
> = {
  lobby: {
    eyebrow: "Ein Experiment. Eure Erfahrung.",
    title: "Wie groß ist das wirklich?",
    description:
      "Eine Aufgabe, unterschiedliche Annahmen. Wir finden gemeinsam heraus, was hinter unseren Schätzungen steckt.",
    action: "Erste Runde starten",
    cue: "Begrüße die Runde. Alle öffnen den Teilnehmerlink. Erkläre: Wir suchen eine begründete Einschätzung; es gibt keine vorbereitete richtige Zahl.",
  },
  estimate1: {
    eyebrow: "Runde 01 · unabhängig schätzen",
    title: "Was sagt dein Bauchgefühl?",
    description:
      "Vergleiche die Aufgabe mit unseren Referenzen. Wähle eine Zahl und halte deine wichtigste Annahme fest.",
    action: "Schätzungen aufdecken",
    cue: "Lass allen Zeit. Stimmen und Annahmen bleiben bis zum Aufdecken verdeckt – auch für dich. Frage zunächst nach dem Verständnis, ohne eine eigene Zahl vorzuschlagen.",
  },
  reveal1: {
    eyebrow: "Runde 01 · gemeinsam entdecken",
    title: "Eine Zahl. Viele Annahmen.",
    description:
      "Welche Aufgaben habt ihr beim Schätzen eigentlich vor Augen gehabt? Schaut besonders auf unterschiedliche Begründungen.",
    action: "Refinement öffnen",
    cue: "Bitte zwei Personen mit unterschiedlichen Annahmen um ihre Sicht. Auch dieselbe Zahl kann für einen anderen Scope stehen. Die Verteilung ist ein Gesprächsanlass.",
  },
  refine: {
    eyebrow: "Menschen zuerst. KI ergänzt.",
    title: "Die beste Antwort ist eine Frage.",
    description:
      "Welche Information fehlt? Sammelt erst eure Fragen. Danach prüfen wir mit dem Coding-Agent den bestehenden Code.",
    action: "PO-Antworten freigeben",
    cue: "45 Sekunden still nachdenken, dann Fragen sammeln. Öffne den Coding-Agent und verwende den vorbereiteten Analyseauftrag. Übernimm nur gemeinsam geprüfte Erkenntnisse; kennzeichne Annahmen ausdrücklich.",
  },
  scope: {
    eyebrow: "Die Antworten aus dem Produktteam",
    title: "Jetzt bekommt die Aufgabe Konturen.",
    description:
      "Diese Antworten legen den Lieferumfang fest. Prüft gemeinsam, was damit geklärt ist und welche Unsicherheit bleibt.",
    action: "Zweite Runde starten",
    cue: "Gehe die vier Antworten durch. Die Performance-Abnahme ist weiterhin offen. Das Team schätzt die vollständige Definition of Done inklusive Tests, Review und Lieferung.",
  },
  estimate2: {
    eyebrow: "Runde 02 · mit gemeinsamem Verständnis",
    title: "Was schätzt du jetzt?",
    description:
      "Schätze erneut unabhängig. Was hat deine Einschätzung verändert – oder bestätigt? Welche Unsicherheit bleibt?",
    action: "Vorher & nachher vergleichen",
    cue: "Eine kleinere Zahl ist kein Ziel. Bitte um eine neue Begründung. Die erste Gruppenverteilung bleibt in dieser Phase ausgeblendet.",
  },
  compare: {
    eyebrow: "Runde 01 ↔ Runde 02",
    title: "Was hat sich wirklich verändert?",
    description:
      "Vergleicht eure Einschätzungen und die Annahmen dahinter. Mehr Klarheit kann eine Schätzung größer, kleiner oder gleich lassen.",
    action: "Transfer starten",
    cue: "Welche Frage hat den größten Unterschied gemacht? Der Vergleich umfasst eure Diskussion, die PO-Antworten und die KI-Analyse. Er misst keinen isolierten KI-Zeitgewinn.",
  },
  transfer: {
    eyebrow: "Eine Frage aus dem Projektalltag",
    title: "„Geht das bis Freitag? Ihr nutzt doch KI.“",
    description:
      "Wie würdest du antworten? Formuliere zwei Sätze und benenne, was du für eine belastbare Prognose noch wissen musst.",
    action: "Workshop abschließen",
    cue: "Lass alle unabhängig formulieren und decke danach gemeinsam auf. Unterscheide Ziel, Prognose und Zusage. Story Points werden hier nicht in Stunden umgerechnet.",
  },
  done: {
    eyebrow: "Euer nächstes Refinement",
    title: "Bessere Fragen. Bewusstere Schätzungen.",
    description:
      "Nehmt die Erkenntnisse mit und probiert den Ablauf an drei echten Aufgaben aus. Lernt anschließend an der abgeschlossenen Arbeit.",
    action: "Ergebnisse mitnehmen",
    cue: "Vereinbart einen kleinen nächsten Versuch. Aktualisiert Referenzen anhand abgeschlossener Arbeit und betrachtet Klärung, Umsetzung, Review und Wartezeiten gemeinsam.",
  },
};

export const STORY = {
  id: "ORD-42",
  title: "Bestellungen exportieren",
  description:
    "Als Kunde möchte ich meine Bestellungen als Excel-Datei exportieren, um sie intern auszuwerten.",
  context: [
    "B2B-Portal mit Bestellliste und Statusfilter",
    "Mehrere Mandanten und bestehende Rollen",
    "Ein Kunden-CSV-Export ist bereits vorhanden",
  ],
  done: "Integriert, getestet, reviewt und deployt.",
};

export const REFERENCES = [
  {
    points: "2",
    title: "Statusfilter",
    description: "Bestehende Liste + API, UI-Auswahl und Tests.",
  },
  {
    points: "3",
    title: "Kunden-CSV",
    description: "Bis 1.000 Zeilen, Admins, UI/API und CSV-Tests.",
  },
  {
    points: "8",
    title: "ERP-Anbindung",
    description: "Neue Schnittstelle, Jobs, Retries und Monitoring.",
  },
];

export const ANALYSIS_PROMPT = `Analysiere ausschließlich das vorbereitete B2B-Beispiel im Verzeichnis demo/ sowie dessen Anbindung in convex/demo.ts und src/components/demo-portal.tsx.
Lies demo/README.md, demo/ORD-42.md, demo/references.md und den dortigen Ist-Code.
Trenne Fakten, Annahmen und offene Fragen.
Belege Code-Aussagen mit Datei und Zeile.
Priorisiere die fünf wichtigsten Rückfragen und suche Wiederverwendung.
Keine Stunden. Keine Points. Keine Codeänderung.
Weitere Workshop-Dateien und vorbereitete PO-Antworten gehören noch nicht zum Analysekontext.`;

export function stepIndex(phase: Phase) {
  return STEPS.findIndex((step) =>
    (step.phases as readonly string[]).includes(phase),
  );
}
