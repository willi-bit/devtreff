"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { buildEstimationPrompt } from "../../shared/workshop";
import { useTask } from "@/lib/browser";
import type { Room } from "@/lib/room";
import { Button, ErrorNote } from "./ui";
import { Distribution } from "./workshop-panels";

export function AiEstimationExperiment({ room }: { room: Room }) {
  const prompt = buildEstimationPrompt(room);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const task = useTask();
  const copied = copiedPrompt === prompt;

  return (
    <section className="panel analysis-panel" aria-labelledby="ai-estimate-heading">
      <div className="panel-top">
        <span className="eyebrow">Optionales Experiment</span>
        <span className="subtle-label">ca. 4 Min.</span>
      </div>
      <h2 id="ai-estimate-heading">Wie schätzt die KI mit unseren Referenzen?</h2>
      <p>
        Die KI bekommt dieselben Referenzen mit 2, 3 und 8 Points, das Ticket,
        die Produktantworten und eure Board-Erkenntnisse. Eure Schätzungen werden
        nicht mitkopiert. Danach vergleicht ihr Zahl und Begründung mit Runde zwei.
      </p>
      {room.isHost ? (
        <>
          <ol className="guidance-tasks">
            <li>Kopiere den Prompt und starte damit einen frischen KI-Chat. Der benötigte Kontext ist vollständig enthalten.</li>
            <li>Teile die KI-Antwort auf deinem Bildschirm. Öffnet hier eure zweite Schätzrunde zum Vergleich.</li>
            <li>Besprecht: Welche Referenz trägt die Zahl? Wo unterscheiden sich die Annahmen? Welche Rückfrage hilft euch weiter?</li>
          </ol>
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
              {copied ? "Schätzprompt kopiert" : "Schätzprompt mit Referenzen kopieren"}
            </Button>
          </div>
          <ErrorNote error={task.error} />
          <details>
            <summary>Vollständigen Schätzprompt ansehen</summary>
            <pre>{prompt}</pre>
          </details>
        </>
      ) : (
        <p>
          Bleib in der Workshop-App. Die Moderation zeigt die KI-Antwort.
          Vergleiche sie mit deiner zweiten Schätzung: Welche Annahme teilt ihr,
          welche zusätzliche Arbeit oder Unsicherheit nennt die KI?
        </p>
      )}
      <details>
        <summary>Eure zweite Schätzrunde zum Vergleich</summary>
        <Distribution votes={room.secondVotes} title="Runde 2" accent />
        {room.secondVotes.map((vote) => (
          <p key={vote.memberId}>
            <b>{vote.name} · {vote.point === "?" ? "Noch nicht schätzbar" : `${vote.point} Points`}</b>
            <br />
            {vote.reason}
          </p>
        ))}
      </details>
      <p>
        Drei fiktive Referenzen und ein Ticket: Wir erkunden, wie die KI ihre
        Schätzung begründet. Eine ähnliche Zahl allein zeigt noch keine
        Schätzgenauigkeit. Haltet eine hilfreiche Erkenntnis oder Rückfrage fest.
      </p>
    </section>
  );
}
