"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Room } from "@/lib/room";
import { useTask } from "@/lib/browser";
import {
  buildAnalysisPrompt,
  isRefinementPhase,
  type RefinementPhase,
} from "../../shared/workshop";
import { Button, DemoLink, ErrorNote } from "./ui";

const clarificationSteps = [
  { phase: "refine", label: "Fragen sammeln" },
  { phase: "analyze", label: "KI hinzuziehen" },
  { phase: "review", label: "Gemeinsam prüfen" },
  { phase: "scope", label: "Produkt klären" },
] as const;

const guidance: Record<
  "reveal1" | RefinementPhase,
  {
    title: string;
    time: string;
    host: string[];
    participants: string[];
    team: string;
    say: string;
    next: string;
  }
> = {
  reveal1: {
    title: "Aus euren Annahmen werden Fragen",
    time: "ca. 6 Min.",
    host: [
      "Bitte zwei Kollegen mit unterschiedlichen Annahmen, ihre Sicht zu erklären.",
      "Frage nach: Welche konkrete Information würde deine Einschätzung verändern?",
    ],
    participants: [
      "Vergleiche die Begründungen. Welche Arbeit haben die anderen eingeschlossen?",
      "Überlege, welche Antwort dir für deine eigene Einschätzung noch fehlt.",
    ],
    team: "Alle vergleichen die Begründungen und überlegen, welche Information ihnen noch fehlt.",
    say: "Ihr habt bei derselben Aufgabe unterschiedliche Dinge vorausgesetzt. Diese Annahmen machen wir jetzt zu Fragen – zum Beispiel: Reicht eine CSV-Datei für Excel?",
    next: "Weiter zu „Fragen sammeln“, wenn zwei Sichtweisen besprochen sind.",
  },
  refine: {
    title: "Jede Person trägt eine Frage ein",
    time: "ca. 4 Min.",
    host: [
      "Gib allen 45 Sekunden zum Nachdenken und Zeit zum Eintragen.",
      "Lies zwei oder drei Fragen vom Board vor. Welche davon beeinflussen eure Einschätzung besonders?",
    ],
    participants: [
      "Nimm deine Annahme aus Runde eins. Was müsstest du wissen, um sie zu prüfen?",
      "Trage eine konkrete Frage ein, zum Beispiel: Reicht CSV, oder brauchen wir eine XLSX-Datei?",
    ],
    team: "Jede Person formuliert eine Frage zu ihrer ersten Annahme und trägt sie ein.",
    say: "Aus „Ich gehe davon aus, dass …“ wird jetzt „Wir müssten wissen, ob …“. Eure Fragen nehmen wir gleich mit in die KI-Analyse.",
    next: "Weiter zu „Zum KI-Auftrag“, wenn eure wichtigsten Fragen auf dem Board stehen.",
  },
  analyze: {
    title: "Eure Fragen im vorhandenen Projekt prüfen",
    time: "ca. 5 Min.",
    host: [
      "Öffne dein Coding-Tool im Workshop-Projekt und starte einen frischen Agent-Chat.",
      "Kopiere den Auftrag unten und füge ihn dort ein. Eure offenen Fragen werden mitkopiert.",
      "Starte die Analyse und teile den Bildschirm. Zeige zwei oder drei Aussagen der KI und prüft mindestens eine Belegstelle im Beispielcode.",
    ],
    participants: [
      "Bleib in der Workshop-App. Die Moderation zeigt die gemeinsame KI-Analyse auf dem geteilten Bildschirm.",
      "Achte auf deine Frage: Wird sie beantwortet? Womit wird die Antwort belegt? Was bleibt offen?",
      "Du brauchst keinen eigenen KI-Chat. Neue Rückfragen kannst du unten ergänzen.",
    ],
    team: "Alle verfolgen die gemeinsame Analyse und prüfen, ob ihre Frage beantwortet wird. Ein eigener KI-Chat ist nicht nötig.",
    say: "Wir lassen die KI unsere Fragen am vorhandenen Projekt prüfen. Achtet darauf, was sie belegen kann und wo sie weiterhin eine Antwort vom Produktteam braucht.",
    next: "Kehre nach der Analyse zur App zurück und wähle „Ergebnisse gemeinsam prüfen“.",
  },
  review: {
    title: "Die Antworten mit euren Fragen verbinden",
    time: "ca. 3 Min.",
    host: [
      "Wähle zwei oder drei Aussagen der KI. Frage jeweils: Welche unserer Fragen beantwortet das?",
      "Unterscheidet gemeinsam: Was ist belegt, was vermutet die KI und was muss das Produktteam entscheiden?",
      "Trage geprüfte Fakten oder Annahmen unten ein. Hake eine Frage erst ab, wenn ihre Antwort gemeinsam geklärt ist.",
    ],
    participants: [
      "Vergleiche die Aussagen der KI mit den Fragen auf dem Board.",
      "Sage, welche Aussage deine Annahme verändert oder bestätigt. Weise auf unbelegte Antworten und offene Produktfragen hin.",
    ],
    team: "Alle ordnen die Aussagen ihren Fragen zu und benennen Restfragen.",
    say: "Was wissen wir jetzt zusätzlich, und woran können wir das erkennen? Eine Aussage wie „das lässt sich bestimmt wiederverwenden“ bleibt bis zur Prüfung eine Annahme.",
    next: "Weiter zu „Produktantworten aufdecken“, wenn technische Erkenntnisse und offene Produktfragen benannt sind.",
  },
  scope: {
    title: "Jetzt kommen die Entscheidungen zum Produkt",
    time: "ca. 3 Min.",
    host: [
      "Übernimm für diesen Schritt die Rolle des Product Owners. Lies die vier vorbereiteten Antworten vor.",
      "Ordnet die Antworten euren Fragen zu und markiert beantwortete Fragen als geklärt.",
      "Benenne die Restfragen. Danach startet die zweite Schätzung mit dem gemeinsamen Wissensstand.",
    ],
    participants: [
      "Lies die vier Produktantworten. Welche davon verändert oder bestätigt deine bisherige Vorstellung?",
      "Prüfe deine offene Frage auf dem Board. Was fehlt dir noch für die zweite Einschätzung?",
    ],
    team: "Alle vergleichen den vereinbarten Lieferumfang mit ihrer bisherigen Annahme.",
    say: "Die KI hat den vorhandenen Stand untersucht. Für unser Beispiel gebe ich jetzt die vorbereiteten Produktentscheidungen dazu: Was genau soll der Export leisten?",
    next: "Weiter zu „Zweite Runde starten“, wenn Lieferumfang und verbleibende Unsicherheit gemeinsam besprochen sind.",
  },
};

export function WorkshopGuidance({ room }: { room: Room }) {
  if (room.phase !== "reveal1" && !isRefinementPhase(room.phase)) return null;
  const content = guidance[room.phase];
  const current = clarificationSteps.findIndex((step) => step.phase === room.phase);
  const firstVote = room.ownVotes.find((vote) => vote.round === 1);
  if (room.phase === "reveal1") {
    return (
      <section className="insight-callout" aria-label="Von Annahmen zu Fragen">
        <p>
          <b>{content.title}</b>
          <br />
          {(room.isHost ? content.host : content.participants).join(" ")}
        </p>
      </section>
    );
  }
  return (
    <>
      {current >= 0 && (
        <ol className="refinement-steps" aria-label="Klärung in vier Schritten">
          {clarificationSteps.map((step, index) => (
            <li
              key={step.phase}
              className={index === current ? "is-current" : index < current ? "is-complete" : ""}
              aria-current={index === current ? "step" : undefined}
            >
              <span aria-hidden="true">{index < current ? <Check size={14} /> : index + 1}</span>
              {step.label}
            </li>
          ))}
        </ol>
      )}
      <section className="panel workshop-guidance" aria-labelledby="guidance-heading">
        <div className="panel-top">
          <span className="eyebrow">{room.isHost ? "Du moderierst" : "Dein Auftrag"}</span>
          <span className="subtle-label">{content.time}</span>
        </div>
        <h2 id="guidance-heading">{content.title}</h2>
        <ol className="guidance-tasks">
          {(room.isHost ? content.host : content.participants).map((task) => (
            <li key={task}>{task}</li>
          ))}
        </ol>
        {room.isHost ? (
          <>
            <blockquote>
              <span>So kannst du es sagen</span>
              {content.say}
            </blockquote>
            <p className="guidance-counterpart"><b>Die Kollegen:</b> {content.team}</p>
            <p className="guidance-next">{content.next}</p>
          </>
        ) : (
          <>
            {room.phase === "refine" && firstVote && (
              <blockquote><span>Deine Annahme aus Runde eins</span>{firstVote.reason}</blockquote>
            )}
            <p className="guidance-next">Die Moderation führt euch gemeinsam zum nächsten Schritt.</p>
          </>
        )}
      </section>
    </>
  );
}

export function AnalysisPanel({ room }: { room: Room }) {
  const questions = room.insights.filter((item) => item.kind === "question" && !item.resolved);
  const prompt = buildAnalysisPrompt(questions.map((item) => item.text));
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const task = useTask();
  const copied = copiedPrompt === prompt;
  if (!room.isHost) return null;
  return (
    <section className="panel analysis-panel" aria-labelledby="analysis-heading">
      <h2 id="analysis-heading">Der Auftrag für deinen Coding-Agent</h2>
      <p>
        {questions.length > 0
          ? `${questions.length} offene ${questions.length === 1 ? "Frage aus eurer Runde ist" : "Fragen aus eurer Runde sind"} enthalten. Die Analyse läuft in deinem Coding-Tool; geprüfte Erkenntnisse hältst du anschließend hier fest.`
          : "Der Auftrag untersucht das Beispielprojekt. Wenn ihr Fragen mündlich gesammelt habt, trage sie vor dem Kopieren unten ein."}
      </p>
      <div className="analysis-actions">
        <Button
          variant="secondary"
          busy={task.busy}
          onClick={() => void task.run(async () => {
            await navigator.clipboard.writeText(prompt);
            setCopiedPrompt(prompt);
          })}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Auftrag kopiert" : "Auftrag mit euren Fragen kopieren"}
        </Button>
        <DemoLink />
      </div>
      <ErrorNote error={task.error} />
      <details>
        <summary>Vollständigen Auftrag ansehen</summary>
        <pre>{prompt}</pre>
      </details>
      <details>
        <summary>Wenn die Live-Analyse länger dauert</summary>
        <p>Nutze nach etwa 90 Sekunden eine vorher geprüfte Ausgabe und benenne sie als vorbereitet. Liegt keine vor, besprecht eure Fragen gemeinsam und haltet fest, dass die KI-Analyse noch aussteht.</p>
      </details>
    </section>
  );
}
