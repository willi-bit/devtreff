# devtreff · Gemeinsam besser schätzen

Eine App für einen moderierten Schätzworkshop: zehn Entwickler:innen, eine
konkrete Story und zwei unabhängige Schätzrunden. Das Publikum nimmt über die App
teil; die Moderation führt den gemeinsamen Ablauf. Die KI-Codeanalyse findet im
Coding-Agent neben der App statt.

## Enthalten

- Räume mit Teilnehmerlink, QR-Code und getrennten Moderationszugängen
- Neun synchron moderierte Einstiegsfolien zu Schätzgrundlagen und Consulting, vor dem Übungsticket
- Verdeckte Schätzung mit Story Points und einer persönlichen Begründung
- Gemeinsames Aufdecken und Vergleich beider Runden
- Fragenboard mit geprüften Fakten, Annahmen und Belegstellen
- Vier geführte Klärungsschritte mit getrennten Aufträgen für Moderation und Teilnehmende; offene Fragen werden in den KI-Auftrag übernommen
- Von der Moderation freigegebene PO-Antworten für ORD-42
- Verdeckte Antworten auf die Terminfrage, Abschluss und Markdown-Protokoll
- Session-Neustart für Generalproben
- Ein ausführbares, fiktives B2B-Beispiel mit Statusfilter, Pagination und Kunden-CSV

**Den Vortrag vorbereiten:** [Moderationsleitfaden für 65 Minuten](docs/workshop-guide.md).

## Lokal starten

Node.js 22 verwenden. In diesem bereits konfigurierten Checkout:

```sh
npm run dev
```

[localhost:3000](http://localhost:3000) öffnen. Das Kommando synchronisiert zuerst
Convex und startet anschließend Next.js. Beide Dienste bleiben aktiv.

Für einen frischen Clone mit Zugang zum Convex-Projekt:

```sh
npm ci
npx convex dev --configure existing --team willi --project devtreff --dev-deployment cloud --once
npm run dev
```

Convex schreibt die Entwicklungsumgebung in `.env.local`. `.env.example`
beschreibt die Variablen. Umgebungsdateien und Deploy-Keys bleiben außerhalb von Git.

## Passwortschutz

Die Website ist über `/login` mit einem gemeinsamen Veranstaltungspasswort
geschützt. Das gleiche `DEMO_PASSWORD` muss in Next.js (`.env.local` bzw.
Vercel-Umgebungsvariablen) und im passenden Convex-Deployment gesetzt sein.
Verwende ein zufälliges Passwort mit mindestens 16 und höchstens 256 Zeichen.
Fehlt die Konfiguration, bleibt der Zugang gesperrt.

Im Convex-Dashboard unter **Settings → Environment Variables** setzen oder lokal:

```sh
npx convex env set DEMO_PASSWORD
```

Die CLI fragt das Passwort ab. Beim öffentlichen Deployment dasselbe Passwort
in Vercel und Convex **Production** hinterlegen; Previews entsprechend separat.
Das Passwort niemals als `NEXT_PUBLIC_`-Variable, im Code oder im Einladungslink
hinterlegen.

Nach der Eingabe merkt sich ein HttpOnly-Cookie den Zugang für die Browsersitzung.
Convex prüft die daraus abgeleitete Freigabe zusätzlich vor jedem Datenzugriff.
Raumcodes und Moderationstokens funktionieren wie bisher. Die Freigabe ist bewusst
gemeinsam und bleibt bis zum Passwortwechsel gültig: Zum Widerrufen das Passwort
in **beiden** Diensten ändern und Next.js neu starten bzw. auf Vercel neu deployen.
Nach der Veranstaltung sowohl das Frontend als auch das Convex-Backend entfernen.

Die Passwortabfrage erlaubt 30 Versuche pro Minute und IP **je Serverinstanz**.
Für die öffentliche Demo in Vercel zusätzlich **Bot Protection → Challenge** und
**AI Bots → Deny** aktivieren. Bei Bedarf eine WAF-Rate-Limit-Regel für
`POST /api/access` ergänzen; das Limit an die Gruppengröße im gemeinsamen WLAN
anpassen. Die kleine lokale Bremse ersetzt kein verteiltes Firewall-Limit und
Vercels Regeln decken keine direkten Convex-Anfragen ab.

## Ansichten

| Route          | Zweck                                            |
| -------------- | ------------------------------------------------ |
| `/`            | Workshop starten oder per Raumcode beitreten     |
| `/host/[code]` | Moderation im Browser, der den Raum erstellt hat |
| `/room/[code]` | Mit einem Namen teilnehmen                       |
| `/demo`        | B2B-Ausgangsbasis für die Codeanalyse            |

Host- und Teilnehmerzugänge sind zufällige Browser-Tokens. Der Host-Token wird
nicht in Einladungslinks oder öffentlichen Abfragen ausgegeben. Die Convex-
Funktionen prüfen die Rolle, den Raum und die aktuelle Phase. Verdeckte Stimmen
und Antworten werden serverseitig zurückgehalten, auch gegenüber der Moderation.
Die zweite Schätzphase blendet die erste Gruppenverteilung erneut aus.

Wer den lokalen Browserspeicher löscht, verliert den dort gespeicherten Zugang.
Es gibt bewusst keine Konten oder Zugangswiederherstellung in dieser ersten Version.

## Entwicklung und Prüfung

| Kommando               | Zweck                                                                   |
| ---------------------- | ----------------------------------------------------------------------- |
| `npm run dev`          | Convex und Next.js gemeinsam starten                                    |
| `npm run dev:frontend` | Nur Next.js                                                             |
| `npm run dev:backend`  | Nur der Convex-Watcher                                                  |
| `npm run check`        | ESLint, TypeScript und Tests                                            |
| `npm test`             | Verhaltenstests mit Vitest und convex-test                              |
| `npm run test:watch`   | Tests bei Änderungen erneut ausführen                                   |
| `npm run convex:check` | Typen generieren, prüfen und Entwicklungsbackend einmal synchronisieren |
| `npm run build`        | Next.js-Produktionsbuild mit konfigurierter Convex-URL                  |
| `npm start`            | Produktionsbuild lokal starten                                          |
| `npm run build:vercel` | Convex deployen und Next.js mit passender Backend-URL bauen             |

Die Tests prüfen verdeckte Stimmen und Antworten, Moderationsrechte,
Raumtrennung, zulässige Phasen, Stimmenänderungen, Scope-Freigabe und Reset.
Das B2B-Beispiel prüft zusätzlich Rollen, Mandanten, Pagination und CSV-Randfälle.
`convex-test` ist ein Backend-Testdouble; zusätzlich den Leitfaden mit zwei
Browseransichten gegen das echte Entwicklungsbackend durchspielen.

## Projektstruktur

- `src/app/`: Next.js App Router und Styles
- `src/components/`: Startseite, Workshop-Ansichten und B2B-Oberfläche
- `shared/workshop.ts`: Phasen, Texte, Startticket, Referenzen und Analyseauftrag
- `shared/introduction.ts`: Einstiegsfolien, Gesprächsimpulse, Moderationshinweise und Quellen
- `convex/rooms.ts`: gemeinsame Session mit serverseitigen Freigaben
- `convex/schema.ts`: Räume, Teilnehmende, Stimmen, Erkenntnisse und Terminantworten
- `convex/lib/answers.ts`: vorbereitetes Moderationsmaterial
- `convex/demo.ts`: Backend-Anbindung des B2B-Beispiels
- `demo/`: isolierter Analysekontext, ausführbare Ausgangsbasis und fiktive Daten
- `tests/`: Tests des Workshop-Ablaufs
- `convex/_generated/`: generierte API und Typen; einchecken, nicht manuell bearbeiten

Next.js 16, React 19, TypeScript, Tailwind CSS 4, Convex, Lucide und qrcode.react.
Frontend-Imports nutzen `@/`, die generierte Backend-API `@convex/`.

## Später auf Vercel deployen

1. [willi-bit/devtreff](https://github.com/willi-bit/devtreff) auf Vercel importieren.
   Repository-Wurzel und Node.js 22.x verwenden.
2. Im [Convex-Dashboard](https://dashboard.convex.dev/t/willi/devtreff) eine
   Produktionsumgebung anlegen und einen Production Deploy Key mit
   `deployment:deploy`-Berechtigung erzeugen.
3. Den Key in Vercel als `CONVEX_DEPLOY_KEY` für **Production** hinterlegen.
4. `DEMO_PASSWORD` in Vercel und im Convex-Produktionsdeployment identisch setzen
   (siehe [Passwortschutz](#passwortschutz)).
5. Deployen. `vercel.json` verwendet `npm run build:vercel` und übergibt die
   passende `NEXT_PUBLIC_CONVEX_URL` automatisch an den Frontend-Build.

Für Preview-Deployments einen separaten Preview Deploy Key in Convex erzeugen
und in Vercel als `CONVEX_DEPLOY_KEY` ausschließlich für **Preview** setzen.
Preview-Builds benötigen diesen Key und bekommen einen eigenen Backend-Kontext.

Vercel ist noch nicht eingerichtet. Grundlage ist der
[offizielle Convex-Vercel-Ablauf](https://docs.convex.dev/production/hosting/vercel).
