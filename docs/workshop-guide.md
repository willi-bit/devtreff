# Dein Workshop entlang der App

Die App führt durch die Session. Du moderierst Gespräche, gibst Phasen frei und
zeigst einmal die Codeanalyse im Coding-Agent. Das vorhandene Foliendeck ist
dein inhaltliches Drehbuch und die Reserve, falls du darauf zurückgreifen möchtest.

## Vorschlag für 55 Minuten

| Zeit  | In der App          | Dein Fokus                                                                                                                                                           |
| ----- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0–5   | Ankommen            | Raum öffnen, Link teilen, Namen wählen. „Was steckt für euch hinter einer Schätzung?“                                                                                |
| 5–12  | Erste Schätzung     | ORD-42, Referenzen und Definition of Done kennenlernen. Alle geben Zahl und wichtigste Annahme verdeckt ab.                                                          |
| 12–20 | Gemeinsam aufdecken | Zwei unterschiedliche Annahmen besprechen. Auch dieselbe Zahl kann für verschiedene Aufgaben stehen.                                                                 |
| 20–32 | Gemeinsam klären    | Erst 45 Sekunden selbst nachdenken und Fragen sammeln. Danach Codeanalyse im Agenten; Aussagen und Belege gemeinsam prüfen. Anschließend die PO-Antworten freigeben. |
| 32–40 | Neu einschätzen     | Erneut unabhängig abstimmen. Im Vergleich besprechen, welche Annahmen sich verändert oder bestätigt haben.                                                           |
| 40–50 | In den Alltag       | „Geht das bis Freitag? Ihr nutzt doch KI.“ Zwei Sätze pro Person, gemeinsam aufdecken. Ziel, Prognose und Zusage unterscheiden.                                      |
| 50–55 | Mitnehmen           | Einen Versuch an drei echten Aufgaben vereinbaren. Ergebnisprotokoll herunterladen.                                                                                  |

## Vorbereiten

1. `npm run dev` starten und die Startseite öffnen. **Workshop starten** legt
   einen neuen Raum an und öffnet deine Moderation.
2. Über **Einladen** den Teilnehmerlink oder QR-Code teilen. Für Remote-Teilnahme
   muss die App unter einer erreichbaren Adresse laufen, beispielsweise nach
   deinem Vercel-Deployment. `localhost` funktioniert auf deinem eigenen Rechner.
3. Die Moderation bleibt in diesem Browser gespeichert. Den `/host/…`-Link allein
   zu kennen verleiht keine Moderationsrechte. Zum Wechseln auf einen anderen
   Browser vor der Session einen neuen Workshop anlegen und dessen Link teilen.
4. Für eine Generalprobe den Teilnehmerlink in einem zweiten Tab öffnen. Beide
   Rollen verwenden getrennte Zugänge. In verschiedenen Browsern können weitere
   Teilnehmende unabhängig beitreten.
5. Das B2B-Beispiel unter `/demo` anschauen: Statusfilter, Pagination, Kunden-CSV
   sowie Admin-, Mitglied- und Mandantenwechsel sind vorbereitet. Alle Daten und
   Personas sind fiktiv. Der Bestellexport ist absichtlich eine offene Story.

## Die KI-Sequenz

Einen **frischen Agent-Chat** öffnen, damit die vorbereiteten PO-Antworten aus der
Workshop-Planung dort noch nicht bekannt sind. Während der Phase „Gemeinsam
klären“ liegt rechts der kopierbare **Analyseauftrag** bereit.

Der Auftrag begrenzt den Kontext auf `demo/`, `convex/demo.ts` und
`src/components/demo-portal.tsx`. Ticket, Systemkontext und Referenzen befinden
sich im Demo-Verzeichnis. Die Moderationsmaterialien werden erst später
hinzugezogen. Die KI soll Fakten, Annahmen und Rückfragen mit Codebelegen liefern;
eine Zahl oder eine Implementierung gehören nicht zu diesem Auftrag.

Teilnehmende tragen offene Fragen zum Board bei. Du kannst zusätzlich geprüfte
Fakten und ausdrücklich gekennzeichnete Annahmen festhalten, eine Belegstelle
angeben und Fragen als geklärt markieren. **PO-Antworten freigeben** öffnet den
vorbereiteten Scope für alle. Die messbare Performance-Abnahme bleibt dabei offen.

## Moderationsregeln

- Die erste eigene Zahl nicht vorab nennen. Auch du kannst verdeckte Stimmen
  anderer Teilnehmender nicht über die App abrufen.
- Erst aufdecken, wenn die Runde bereit ist. Der Zähler zeigt abgegebene Stimmen,
  keine Anwesenheitsmessung. Nach mindestens einer Stimme kannst du aufdecken.
- „?“ ist eine erlaubte Einschätzung und lädt zur Klärung ein.
- Eine größere, kleinere oder unveränderte zweite Schätzung kann sinnvoll sein.
  Entscheidend sind die Annahmen. Die Verteilung liefert keinen richtigen Wert.
- Runde zwei berücksichtigt Teamdiskussion, neue Produktantworten und KI-Analyse
  gemeinsam. Sie ist kein Benchmark eines isolierten KI-Zeitgewinns.
- Die Referenzen 2/3/8 sind als fiktive Teamreferenzen gekennzeichnet. Reale
  Durchlaufzeiten und Produktionsperformance sind nicht gemessen.
- Für einen Termin zusätzlich Kapazität, Abhängigkeiten, Vergleichsdaten und
  Unsicherheit betrachten. Story Points werden nicht in Stunden umgerechnet.

## Abschluss und erneuter Durchlauf

Im Vergleich und am Ende können alle das Ergebnis als Markdown herunterladen.
Für vollständige Terminantworten erst nach deren Aufdecken herunterladen.

**Workshop verwalten → Workshop neu beginnen** löscht nach einer Bestätigung die
Stimmen, Board-Einträge und Terminantworten dieser Session. Namen, Zugänge und
Raumcode bleiben erhalten. Für eine neue Gruppe einen neuen Workshop starten.
