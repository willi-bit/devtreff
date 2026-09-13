# Backend

`rooms.ts` implementiert den Workshop mit serverseitiger Prüfung von Raum,
Zugang und Phase. `schema.ts` definiert seine Tabellen. `lib/answers.ts` enthält
das vorbereitete Material, das Teilnehmende erst nach Freigabe erhalten.

`demo.ts` bindet das fiktive B2B-Beispiel aus `../demo/` an. Diese Daten sind
reproduzierbare Lehrdaten. Die Demo-Personas sind keine echte Anmeldung.

`npm run dev` synchronisiert Änderungen; `npm run convex:check` führt einen
einzelnen Sync mit Typprüfung aus. Die Tests liegen in `../tests/` und werden
mit `npm test` ausgeführt.

`_generated/` wird vom CLI erzeugt. Diese Dateien einchecken und nicht manuell
bearbeiten.

Projekt: <https://dashboard.convex.dev/t/willi/devtreff>

Dokumentation: <https://docs.convex.dev/quickstart/nextjs>
