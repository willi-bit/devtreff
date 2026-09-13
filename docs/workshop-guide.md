# Dein Workshop entlang der App

Die App führt durch die Session. Du moderierst Gespräche, gibst Phasen frei und
zeigst einmal die Codeanalyse im Coding-Agent. Vor dem Übungsticket führt ihr
gemeinsam durch neun Folien direkt in der Website. Das [Sprechskript](vortrags-skript.md) enthält Formulierungen
und Zeitreserven. Die App zeigt dir und den Kollegen die jeweiligen Aufträge.

## Vorschlag für 65 Minuten

Die Einführung ergänzt den bisherigen Ablauf um etwa zehn Minuten. Bei einem
festen 55-Minuten-Slot die Gesprächsimpulse der Folien nur punktuell aufgreifen
und den späteren Input zu KI und Lieferzeit auf einen kurzen Rückbezug begrenzen.

| Zeit  | In der App          | Dein Fokus                                                                                                                                                           |
| ----- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0–5   | Ankommen            | Raum öffnen, Link teilen, Namen wählen. „Was steckt für euch hinter einer Schätzung?“                                                                                |
| 5–15 | Schätzgrundlagen | Neun Folien gemeinsam durchgehen: Stories und Tasks, Scrum-Ablauf, Story Points, Planning Poker und Unsicherheit. |
| 15–21 | Erste Schätzung | ORD-42, Referenzen und Definition of Done kennenlernen. Alle geben Zahl und wichtigste Annahme verdeckt ab. |
| 21–27 | Eure Annahmen | Zwei unterschiedliche Vorstellungen besprechen. Daraus entstehen Fragen. |
| 27–31 | Welche Fragen sind offen? | Jede Person trägt eine Frage zu ihrer Annahme ein. Gemeinsam Schwerpunkte benennen. |
| 31–36 | KI hinzuziehen | Du kopierst den Auftrag mit den Fragen der Runde in deinen Coding-Agent. Alle verfolgen die Ausgabe und prüfen mindestens einen Beleg. |
| 36–39 | Ergebnisse prüfen | Zurück in der App: Antworten den Fragen zuordnen, Fakten und Annahmen festhalten. |
| 39–42 | Produkt klären | Du gibst als Product Owner die vorbereiteten Antworten. Restfragen gemeinsam benennen. |
| 42–49 | Neu einschätzen | Erneut unabhängig abstimmen und die Begründungen vergleichen. |
| 49–54 | Kurzer Input | Bei der Vergleichsansicht erklären: Wie verändert schnellere Implementierung die gesamte Lieferzeit? |
| 54–61 | In den Alltag | „Geht das bis Freitag? Ihr nutzt doch KI.“ Zwei Sätze pro Person, gemeinsam aufdecken und verbessern. |
| 61–65 | Mitnehmen | Einen Versuch an drei echten Aufgaben vereinbaren. Ergebnisprotokoll herunterladen. |

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

## Die gemeinsame Einführung

Mit **Einführung starten** beginnt der Folienteil. **Nächste Folie** und
**Vorherige Folie** steuern die Anzeige für die ganze Runde. Die Pfeiltasten
funktionieren ebenfalls, wenn der Fokus im Folieninhalt liegt. Eingabefelder,
Links, Buttons und offene Dialoge behalten ihre eigene Tastaturbedienung.
Teilnehmende folgen automatisch; auch ein späterer Beitritt oder Neuladen zeigt
die aktuelle Folie. Die letzte Folie führt mit **Zur ersten Schätzung** zu ORD-42.

| Folie | Kerngedanke | Späterer Bezug |
| --- | --- | --- |
| 1 | Dasselbe Ticket kann unterschiedliche Vorstellungen auslösen. | Hinter jeder Zahl stehen Arbeit und Annahmen. |
| 2 | Feature, User Story und Tasks an einem Beispiel unterscheiden. | Wir schätzen eine ganze Story und berücksichtigen ihre Umsetzungsschritte. |
| 3 | Refinement, Sprint Planning und ein beispielhaftes Sprintboard einordnen. | Schätzen unterstützt die Planung; das Board zeigt den Arbeitsstand. |
| 4 | Umfang, Akzeptanzkriterien und Definition of Done klären. | Alle betrachten dieselbe Aufgabe und denselben Qualitätsstandard. |
| 5 | Arbeitsmenge, Komplexität, Tests, Integration und Risiken berücksichtigen. | Der Aufwand reicht bis zum fertigen Ergebnis. |
| 6 | Story Points mit Referenz-Stories und einer gemeinsamen Skala nutzen. | Die fiktiven Teamreferenzen dienen gleich als Vergleichsbasis. |
| 7 | Planning Poker: unabhängig wählen, aufdecken, Unterschiede erklären, erneut wählen. | Die App bewahrt die Einzelstimmen für den Vergleich beider Runden. |
| 8 | Bei Unklarheit weiter klären, Stories schneiden oder einen Spike vereinbaren. | Aus einer Annahme entsteht eine konkrete Rückfrage. |
| 9 | Sprint-Ziel, Kapazität, bisherige Lieferung und Abhängigkeiten zusammen betrachten. | Übergang zur Übung und später zur Frage „Geht das bis Freitag?“. |

Pro Folie ungefähr eine Minute einplanen. Gesprächsimpulse sind Angebote;
für längere Erfahrungsberichte eine spätere Diskussion vormerken. Unter
**Moderationshinweis** steht jeweils ein passender Sprechhinweis. Die
Benachrichtigungs-Story und die Karten im Sprintboard sind eigene Beispiele.
Produktantworten und der Übungs-Scope werden weiterhin erst später freigegeben.

Fachlicher Hintergrund: Der [Scrum Guide](https://scrumguides.org/scrum-guide.html)
beschreibt Refinement, Sprint Planning und die Definition of Done. Die Developers
verantworten die Größenabschätzung. Story Points, Planning Poker, ein bestimmtes
Board und eine Feature–Story–Task-Hierarchie sind ergänzende Praktiken, die Scrum
nicht vorschreibt.

Die Schätzmethode erläutern Mike Cohns Texte zu
[Story Points](https://www.mountaingoatsoftware.com/agile/what-are-story-points)
und [Planning Poker](https://www.mountaingoatsoftware.com/agile/story-points/planning-poker).
Die Agile Alliance erklärt
[User Stories](https://agilealliance.org/glossary/user-stories/)
und [Story Splitting](https://agilealliance.org/glossary/story-splitting/).
Die konkreten Beispiele und Gesprächsimpulse sind für diesen Workshop erstellt.

## Die KI-Sequenz

Nach dem ersten Aufdecken sagst du: „Welche Information würde eure Einschätzung
verändern? Aus unseren Annahmen machen wir jetzt Fragen.“ Mit **Fragen sammeln**
beginnt die geführte Klärung. Jeder weitere Klick schaltet die ganze Runde in
denselben nächsten Schritt.

| Schritt | Du als Leiter | Die Kollegen | Danach klickst du |
| --- | --- | --- | --- |
| Fragen sammeln | 45 Sekunden Nachdenken geben, dann zwei oder drei Fragen vorlesen. | Aus der eigenen Annahme eine konkrete Frage machen und eintragen. | **Zum KI-Auftrag** |
| KI hinzuziehen | **Auftrag mit euren Fragen kopieren**, im Workshop-Projekt einen frischen Agent-Chat öffnen, einfügen und starten. Deinen Agent-Bildschirm teilen; zwei oder drei Aussagen und eine Belegstelle zeigen. | In der Workshop-App bleiben und auf dem geteilten Bildschirm verfolgen: Wird meine Frage beantwortet? Ist die Antwort belegt? | Nach der Rückkehr zur App: **Ergebnisse gemeinsam prüfen** |
| Gemeinsam prüfen | Gemeinsam geprüfte Fakten und Annahmen am Board festhalten. Beantwortete Fragen als geklärt markieren. | Erklären, welche Aussage die eigene Annahme verändert oder bestätigt; unbelegte Antworten und Restfragen benennen. | **Produktantworten aufdecken** |
| Produkt klären | Die Rolle des Product Owners übernehmen und die vier vorbereiteten Antworten vorlesen. | Antworten den offenen Fragen zuordnen und die verbleibende Unsicherheit benennen. | **Zweite Runde starten** |

Nur du brauchst den Coding-Agent. Die App stellt den Auftrag mit den aktuell
offenen Fragen zum Kopieren bereit; starten musst du ihn in deinem Coding-Tool.
Die Kollegen benötigen weder das Repository noch einen eigenen KI-Zugang.

Der Auftrag begrenzt den Kontext auf `demo/`, `convex/demo.ts` und
`src/components/demo-portal.tsx`. Ticket, Systemkontext und Referenzen liegen im
Demo-Verzeichnis. Nutze einen **frischen Agent-Chat**, der die vorbereiteten
Produktantworten noch nicht kennt. Erwartet werden höchstens drei technische
Erkenntnisse mit Belegen, Antworten auf eure Fragen und priorisierte Rückfragen.
Eine Schätzzahl und Codeänderungen gehören nicht zum Auftrag.

Die Ergebnisse werden durch dich nach gemeinsamer Prüfung ins Board übernommen.
Produktfragen beantwortest du erst im nächsten Schritt mit den vorbereiteten
PO-Antworten. Die konkrete Benennung der fünf Spalten und die messbare
Performance-Abnahme bleiben als Restfragen sichtbar.

Beispiel: Aus „Ich gehe von einer XLSX-Datei aus“ wird „Reicht CSV?“. Die KI kann
zeigen, welche Exportfunktionen bereits vorhanden sind. Dass CSV für die neue
Aufgabe genügt, entscheidet anschließend der Product Owner. Mit dieser Antwort
prüft die Person ihre ursprüngliche Einschätzung erneut.

## Moderationsregeln

- Mit **Einen Schritt zurück** wechselst du mit der ganzen Runde in den vorherigen
  Schritt, auch vom Abschluss aus. Gespeicherte Schätzungen, Board-Einträge und
  Terminantworten bleiben erhalten. Zurück in einer Schätzrunde sind die Stimmen
  wieder verdeckt und änderbar. Gehst du vor die Transferrunde zurück, werden auch
  die Terminantworten beim erneuten Betreten wieder verdeckt gesammelt.
- Aus der ersten Schätzrunde führt der Rückweg zur letzten Einstiegsfolie.
  Von der ersten Folie geht es mit **Zum Ankommen** zurück in die Lobby.
  Ein erneuter Start der Einführung und ein Workshop-Neustart beginnen bei Folie 1.
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
