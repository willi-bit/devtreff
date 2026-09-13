# Nordlicht – B2B-Ausgangsbasis für ORD-42

Diese kleine, ausführbare Lehranwendung ist der Gegenstand der Schätzung.
Die Oberfläche liegt unter `/demo`, ihre Convex-Anbindung in `convex/demo.ts`
und `src/components/demo-portal.tsx`.

## Vorhanden

- Bestellliste mit Statusfilter und paginierter API (`orders.ts`)
- Bestehender Kundenexport (`customer-export.ts`) mit CSV-Hilfsfunktionen (`csv.ts`)
- Zwei Mandanten und drei explizit auswählbare Demo-Personas (`access.ts`)
- Synthetische, reproduzierbare Daten (`data.ts`)
- Tests für Mandantentrennung, Rollen, Pagination und CSV unter `demo/*.test.ts`

Die auswählbaren Personas simulieren Rollen auf ausschließlich fiktiven Daten.
Sie sind keine Benutzeranmeldung und dürfen nicht für echte Kundendaten verwendet
werden. Das Beispiel liest einen festen Datensatz im Backend; die Live-Workshops
selbst werden in der Convex-Datenbank gespeichert.

Der Bestellexport ist noch nicht implementiert. Lies `ORD-42.md` und
`references.md` für den initialen Analyseauftrag. Produktionsperformance und
reale Durchlaufzeiten wurden nicht gemessen.

Tests: `npm test -- demo`
