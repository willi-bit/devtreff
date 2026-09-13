import type { FunctionReturnType } from "convex/server";
import type { api } from "@convex/_generated/api";

export type Room = Extract<
  NonNullable<FunctionReturnType<typeof api.rooms.get>>,
  { access: "joined" }
>;
export type Vote = Room["firstVotes"][number];

export function report(room: Room) {
  const lines = [
    "# Wie groß ist das wirklich?",
    "",
    `Workshop ${room.code}`,
    "",
    "## Erste Schätzung",
    ...room.firstVotes.map((v) => `- ${v.name}: ${v.point} – ${v.reason}`),
    "",
    "## Erkenntnisse",
    ...room.insights.map(
      (i) =>
        `- [${i.kind}] ${i.text}${i.source ? ` (${i.source})` : ""}${i.resolved ? " · geklärt" : ""}`,
    ),
    "",
    "## Vereinbarter Scope",
    ...room.answers.map((a) => `- ${a.title}: ${a.text}`),
    "- Noch offen: messbare Performance-Abnahme mit 1.000 Testdatensätzen.",
    "",
    "## Zweite Schätzung",
    ...room.secondVotes.map((v) => `- ${v.name}: ${v.point} – ${v.reason}`),
    "",
    "## Antworten auf die Terminfrage",
    ...room.reflections.map((r) => `- ${r.name}: ${r.text}`),
    "",
    "Der Vergleich umfasst Teamdiskussion, PO-Antworten und KI-Analyse. Er misst keinen isolierten KI-Zeitgewinn. Die Story-Point-Referenzen sind fiktive Beispiele.",
  ];
  const url = URL.createObjectURL(
    new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `devtreff-${room.code}.md`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
