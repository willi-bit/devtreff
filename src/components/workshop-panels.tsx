"use client";

import { useState, type FormEvent } from "react";
import { useMutation } from "convex/react";
import { useDemoAccess } from "./convex-client-provider";
import {
  ArrowRight,
  Check,
  CheckCheck,
  ChevronDown,
  CircleHelp,
  Clock3,
  Eye,
  Lightbulb,
  LockKeyhole,
  Plus,
  Target,
} from "lucide-react";
import { api } from "@convex/_generated/api";
import { POINTS, REFERENCES, STORY, type Point } from "../../shared/workshop";
import { useTask } from "@/lib/browser";
import type { Room, Vote } from "@/lib/room";
import { Avatar, Button, DemoLink, ErrorNote } from "./ui";

export function StoryPanel({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={`panel story-panel ${compact ? "story-compact" : ""}`}
      aria-labelledby="story-heading"
    >
      <div className="panel-top">
        <h2 id="story-heading">{STORY.title}</h2>
        <span className="ticket-tag">{STORY.id}</span>
      </div>
      <blockquote>„{STORY.description}“</blockquote>
      <details className="context-details" open={!compact}>
        <summary>
          Kontext & Definition of Done <ChevronDown size={16} />
        </summary>
        <ul>
          {STORY.context.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="done-line">
          <p>
            <b>Definition of Done</b>
            <br />
            {STORY.done}
          </p>
        </div>
        <DemoLink />
      </details>
    </section>
  );
}
export function ReferencePanel({
  collapsible = false,
}: {
  collapsible?: boolean;
}) {
  const content = (
    <>
      <div className="reference-grid">
        {REFERENCES.map((r) => (
          <article className="reference-item" key={r.points}>
            <strong>{r.points}</strong>
            <div>
              <h4>{r.title}</h4>
              <p>{r.description}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="fine-print">
        Fiktive Team-Referenzen · gleiche Definition of Done · KI mitgedacht
      </p>
    </>
  );
  return collapsible ? (
    <details className="panel reference-panel reference-details">
      <summary>
        Referenzen <ChevronDown size={16} />
      </summary>
      {content}
    </details>
  ) : (
    <section className="panel reference-panel">
      <div className="panel-top">
        <h3>Referenzen</h3>
        <span className="subtle-label">Story Points</span>
      </div>
      {content}
    </section>
  );
}
export function LobbyPanel({ room }: { room: Room }) {
  return (
    <>
      {!room.isHost && (
        <p className="lobby-status" role="status">
          <span className="live-dot" /> Warten auf den Start
        </p>
      )}
      <StoryPanel />
      <ReferencePanel collapsible />
    </>
  );
}

export function VotePanel({
  room,
  token,
  round,
}: {
  room: Room;
  token: string;
  round: 1 | 2;
}) {
  const existing = room.ownVotes.find((vote) => vote.round === round);
  const [point, setPoint] = useState<Point | null>(
    (existing?.point as Point) ?? null,
  );
  const [reason, setReason] = useState(existing?.reason ?? "");
  const task = useTask();
  const vote = useMutation(api.rooms.vote);
  const access = useDemoAccess();
  const changed = point !== existing?.point || reason !== existing?.reason;
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!point) return;
    void task.run(() =>
      vote({ access, code: room.code, token, round, point, reason }),
    );
  }
  return (
    <>
      <StoryPanel compact />
      {round === 2 && <ScopePanel room={room} compact />}
      <ReferencePanel />
      {room.isHost ? (
        <section className="panel voting-panel">
          <div className="panel-top">
            <h2>Schätzungen</h2>
            <span className="badge">
              <LockKeyhole size={13} /> Verdeckt
            </span>
          </div>
          <div className="sealed-grid">
            {room.members.map((m, index) => (
              <div
                className={`sealed-card ${m.voted ? "sealed-ready" : ""}`}
                key={m.id}
              >
                <span>
                  {m.voted ? <Check size={16} /> : <Clock3 size={15} />}
                </span>
                <strong>{m.voted ? <LayersSymbol /> : "·"}</strong>
                <Avatar name={m.name} index={index} />
                <small>{m.name}</small>
              </div>
            ))}
          </div>
          {room.members.length === 0 && (
            <p className="empty-inline">
              Noch ist niemand beigetreten. Teile den Teilnehmerlink.
            </p>
          )}
        </section>
      ) : (
        <form className="panel voting-panel" onSubmit={submit}>
          <div className="panel-top">
            <h2>Deine Schätzung</h2>
            <span
              className="badge"
              title="Bis zum Aufdecken nur für dich sichtbar"
            >
              <LockKeyhole size={13} /> Verdeckt
            </span>
          </div>
          <fieldset className="estimate-fieldset">
            <legend>Story Points</legend>
            <div className="estimate-cards">
              {POINTS.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`estimate-card ${point === value ? "selected" : ""}`}
                  aria-label={
                    value === "?" ? "Noch unsicher" : `${value} Story Points`
                  }
                  aria-pressed={point === value}
                  onClick={() => setPoint(value)}
                >
                  <strong>{value}</strong>
                  {point === value && (
                    <Check className="estimate-selected" size={14} />
                  )}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="field-label" htmlFor={`reason-${round}`}>
            {round === 1
              ? "Welche Annahme steckt hinter deiner Zahl?"
              : "Was hat sich geklärt? Was bleibt unsicher?"}
          </label>
          <textarea
            id={`reason-${round}`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={
              round === 1
                ? "Ich gehe davon aus, dass …"
                : "Meine Einschätzung hat sich verändert / bestätigt, weil …"
            }
            maxLength={500}
            minLength={3}
            required
            rows={3}
          />
          <div className="form-footer">
            <span className="fine-print">{reason.length}/500</span>
            <Button
              type="submit"
              disabled={
                !point || reason.trim().length < 3 || (!changed && !!existing)
              }
              busy={task.busy}
            >
              {existing ? "Schätzung aktualisieren" : "Schätzung abgeben"}
              <ArrowRight size={16} />
            </Button>
          </div>
          <ErrorNote error={task.error} />
          {existing && !changed && (
            <p className="success-note" role="status">
              <CheckCheck size={17} />
              Gespeichert. Bis zum Aufdecken änderbar.
            </p>
          )}
        </form>
      )}
    </>
  );
}
function LayersSymbol() {
  return <span className="card-back">✳</span>;
}

export function Distribution({
  votes,
  title,
  accent = false,
}: {
  votes: Vote[];
  title: string;
  accent?: boolean;
}) {
  const maximum = Math.max(
    1,
    ...POINTS.map((p) => votes.filter((v) => v.point === p).length),
  );
  return (
    <section
      className={`panel distribution ${accent ? "distribution-accent" : ""}`}
    >
      <div className="panel-top">
        <h3>{title}</h3>
        <span className="subtle-label">{votes.length} Stimmen</span>
      </div>
      <div
        className="chart"
        aria-label={`Verteilung: ${POINTS.map((p) => `${p} Points: ${votes.filter((v) => v.point === p).length} Stimmen`).join(", ")}`}
      >
        {POINTS.map((point) => {
          const count = votes.filter((v) => v.point === point).length;
          return (
            <div className="chart-column" key={point}>
              <span className="chart-count">{count || "–"}</span>
              <div className="bar-track">
                <div
                  className={`bar ${point === "?" ? "bar-unknown" : ""}`}
                  style={{
                    height: `${count ? Math.max(8, (count / maximum) * 100) : 3}%`,
                  }}
                />
              </div>
              <b>{point}</b>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ResultsPanel({
  room,
  compare = false,
}: {
  room: Room;
  compare?: boolean;
}) {
  const members = room.members.filter(
    (m) =>
      room.firstVotes.some((v) => v.memberId === m.id) ||
      room.secondVotes.some((v) => v.memberId === m.id),
  );
  return (
    <>
      <div className={compare ? "comparison-grid" : ""}>
        <Distribution votes={room.firstVotes} title="Runde 1" />
        {compare && (
          <Distribution votes={room.secondVotes} title="Runde 2" accent />
        )}
      </div>
      <div className="section-title">
        <h2>Begründungen</h2>
        <span>{members.length} Perspektiven</span>
      </div>
      <div className="perspective-list">
        {members.map((m, index) => {
          const first = room.firstVotes.find((v) => v.memberId === m.id);
          const second = room.secondVotes.find((v) => v.memberId === m.id);
          return (
            <article className="panel perspective" key={m.id}>
              <div className="perspective-heading">
                <span className="person-name">
                  <Avatar name={m.name} index={index} />
                  {m.name}
                </span>
                <div className="point-comparison">
                  <span className="point-badge">{first?.point ?? "–"}</span>
                  {compare && (
                    <>
                      <ArrowRight size={16} />
                      <span className="point-badge point-new">
                        {second?.point ?? "–"}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className={compare ? "reason-comparison" : ""}>
                <div>
                  {compare && <span className="eyebrow">Vorher</span>}
                  <p>{first?.reason ?? "Keine Schätzung in dieser Runde."}</p>
                </div>
                {compare && (
                  <div>
                    <span className="eyebrow">Jetzt</span>
                    <p>
                      {second?.reason ?? "Keine Schätzung in dieser Runde."}
                    </p>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {compare && (
        <div className="insight-callout">
          <Lightbulb size={22} />
          <p>
            <b>Mehr Klarheit ist das Ergebnis.</b>
            <br />
            Die Veränderung entsteht aus euren Fragen, der Diskussion, den
            PO-Antworten und der KI-Analyse. Daraus lässt sich kein isolierter
            KI-Zeitgewinn ablesen.
          </p>
        </div>
      )}
    </>
  );
}

export function ScopePanel({
  room,
  compact = false,
}: {
  room: Room;
  compact?: boolean;
}) {
  return (
    <section
      className={`scope-section ${compact ? "scope-compact panel" : ""}`}
    >
      {compact && <h3>Der geklärte Scope</h3>}
      <div className="scope-grid">
        {room.answers.map((a, index) => (
          <article className="panel scope-card" key={a.title}>
            <span className="scope-index">
              0{index + 1}
              <Check size={15} />
            </span>
            <h3>{a.title}</h3>
            <p>{a.text}</p>
          </article>
        ))}
      </div>
      <div className="open-question">
        <CircleHelp size={20} />
        <p>
          <b>Offen: Performance-Abnahme</b>
          <br />
          Messbare Performance-Abnahme mit 1.000 Testdatensätzen gemeinsam
          vereinbaren.
        </p>
      </div>
    </section>
  );
}

export function RefinementPanel({
  room,
  token,
}: {
  room: Room;
  token: string;
}) {
  const [text, setText] = useState("");
  const [kind, setKind] = useState<"question" | "fact" | "assumption">(
    "question",
  );
  const [source, setSource] = useState("");
  const add = useMutation(api.rooms.addInsight);
  const access = useDemoAccess();
  const resolve = useMutation(api.rooms.resolveInsight);
  const task = useTask();
  const editable = room.phase === "refine" || room.phase === "scope";
  function submit(event: FormEvent) {
    event.preventDefault();
    void task.run(async () => {
      await add({
        access,
        code: room.code,
        token,
        text,
        kind: room.isHost ? kind : "question",
        source: room.isHost ? source : undefined,
      });
      setText("");
      setSource("");
    });
  }
  const labels = {
    question: "Offene Frage",
    fact: "Geprüfter Fakt",
    assumption: "Annahme",
  };
  return (
    <>
      <div className="refinement-intro">
        <b>Fragen sammeln</b>
        <ArrowRight size={17} />
        <b>KI-Codeanalyse</b>
        <ArrowRight size={17} />
        <b>Gemeinsam bewerten</b>
      </div>
      {editable && (
        <form className="panel insight-form" onSubmit={submit}>
          <div className="panel-top">
            <h2>
              {room.isHost ? "Erkenntnis hinzufügen" : "Frage hinzufügen"}
            </h2>
          </div>
          {room.isHost && (
            <label className="select-label">
              Art des Beitrags
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as typeof kind)}
              >
                <option value="question">Offene Frage</option>
                <option value="fact">Geprüfter Fakt</option>
                <option value="assumption">Annahme</option>
              </select>
            </label>
          )}
          <label className="sr-only" htmlFor="insight-text">
            Dein Beitrag
          </label>
          <textarea
            id="insight-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              room.isHost
                ? "Welche Erkenntnis habt ihr gemeinsam geprüft?"
                : "Um die Aufgabe einschätzen zu können, müsste ich wissen …"
            }
            minLength={3}
            maxLength={800}
            required
            rows={3}
          />
          {room.isHost && kind === "fact" && (
            <label className="field-label">
              Beleg <span className="muted">(optional)</span>
              <input
                value={source}
                onChange={(e) => setSource(e.target.value)}
                maxLength={200}
                placeholder="Datei:Zeile oder gemeinsam geprüfte Quelle"
              />
            </label>
          )}
          <div className="form-footer">
            <Button
              type="submit"
              busy={task.busy}
              disabled={text.trim().length < 3}
            >
              <Plus size={16} /> Zum Board hinzufügen
            </Button>
          </div>
        </form>
      )}
      <ErrorNote error={task.error} />
      <div className="section-title">
        <h2>Fragen & Erkenntnisse</h2>
        <span>
          {
            room.insights.filter((i) => !i.resolved && i.kind === "question")
              .length
          }{" "}
          offene Fragen
        </span>
      </div>
      <div className="insight-grid">
        {room.insights.map((item) => (
          <article
            className={`panel insight-card kind-${item.kind} ${item.resolved ? "insight-resolved" : ""}`}
            key={item.id}
          >
            <div className="panel-top">
              <span className={`insight-label label-${item.kind}`}>
                {item.resolved ? (
                  <Check size={13} />
                ) : item.kind === "fact" ? (
                  <CheckCheck size={13} />
                ) : (
                  <CircleHelp size={13} />
                )}
                {item.resolved ? "Geklärt" : labels[item.kind]}
              </span>
              {room.isHost && (
                <button
                  className="icon-button"
                  title={
                    item.resolved ? "Wieder öffnen" : "Als geklärt markieren"
                  }
                  aria-label={
                    item.resolved
                      ? "Frage wieder öffnen"
                      : "Beitrag als geklärt markieren"
                  }
                  onClick={() =>
                    void task.run(() =>
                      resolve({ access, code: room.code, token, id: item.id }),
                    )
                  }
                >
                  <Check size={17} />
                </button>
              )}
            </div>
            <p>{item.text}</p>
            {item.source && <code className="source-note">{item.source}</code>}
            <span className="fine-print">{item.author}</span>
          </article>
        ))}
      </div>
      {room.insights.length === 0 && (
        <div className="empty-board">
          <p>Noch keine Beiträge.</p>
        </div>
      )}
    </>
  );
}

export function TransferPanel({ room, token }: { room: Room; token: string }) {
  const access = useDemoAccess();
  const [text, setText] = useState(room.ownReflection ?? "");
  const task = useTask();
  const reflect = useMutation(api.rooms.reflect);
  const reveal = useMutation(api.rooms.revealReflections);
  const saved = room.ownReflection === text;
  function submit(event: FormEvent) {
    event.preventDefault();
    void task.run(() => reflect({ access, code: room.code, token, text }));
  }
  return (
    <>
      {!room.reflectionsRevealed &&
        (room.isHost ? (
          <section className="panel transfer-wait">
            <h2>Antworten sammeln</h2>
            <p>
              {room.reflectionCount} von {room.members.length} Antworten sind
              gespeichert.
            </p>
            <Button
              onClick={() =>
                void task.run(() => reveal({ access, code: room.code, token }))
              }
              busy={task.busy}
            >
              <Eye size={17} /> Antworten gemeinsam aufdecken
            </Button>
          </section>
        ) : (
          <form className="panel" onSubmit={submit}>
            <label className="field-label" htmlFor="reflection">
              <b>Deine Antwort in zwei Sätzen</b>
            </label>
            <textarea
              id="reflection"
              placeholder="Für eine Zusage bis Freitag müsste ich zunächst …"
              rows={5}
              minLength={10}
              maxLength={600}
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="form-footer">
              <span className="fine-print">
                <LockKeyhole size={13} /> Bis zur Freigabe nur für dich
                sichtbar.
              </span>
              <Button
                type="submit"
                busy={task.busy}
                disabled={saved || text.trim().length < 10}
              >
                {saved ? "Antwort gespeichert" : "Antwort abgeben"}
                <Check size={16} />
              </Button>
            </div>
          </form>
        ))}
      <ErrorNote error={task.error} />
      {room.reflectionsRevealed && (
        <>
          <div className="perspective-list">
            {room.reflections.map((reflection, index) => (
              <article className="panel perspective" key={reflection.name}>
                <span className="person-name">
                  <Avatar name={reflection.name} index={index} />
                  {reflection.name}
                </span>
                <p>{reflection.text}</p>
              </article>
            ))}
          </div>
          {room.reflections.length === 0 && (
            <p className="empty-inline">
              Ihr könnt die Frage auch mündlich besprechen.
            </p>
          )}
          <div className="forecast-grid">
            {[
              {
                icon: Target,
                title: "Ziel",
                text: "Wir möchten bis Freitag liefern.",
              },
              {
                icon: Lightbulb,
                title: "Prognose",
                text: "Unter diesen Bedingungen erwarten wir …",
              },
              {
                icon: CheckCheck,
                title: "Zusage",
                text: "Darauf legen wir uns gemeinsam fest.",
              },
            ].map((item) => (
              <article className="panel" key={item.title}>
                <item.icon size={22} />
                <h3>{item.title}</h3>
                <p>„{item.text}“</p>
              </article>
            ))}
          </div>
          <p className="fine-print">
            Für eine Terminprognose braucht ihr Scope, Definition of Done,
            Kapazität, Abhängigkeiten, vergleichbare Durchlaufzeiten und einen
            nächsten Check.
          </p>
        </>
      )}
    </>
  );
}

export function Takeaways() {
  return (
    <>
      <div className="takeaway-banner">
        <p>Was probiert ihr beim nächsten Refinement an drei Aufgaben aus?</p>
      </div>
      <div className="scope-grid">
        {[
          [
            "01",
            "Unabhängig vergleichen",
            "Gemeinsame Referenzen und eine klare Definition of Done schaffen die Grundlage.",
          ],
          [
            "02",
            "Fragen und Belege prüfen",
            "Menschen zuerst. KI ergänzt, hinterfragt und verweist auf konkrete Belege.",
          ],
          [
            "03",
            "Scope klären und entscheiden",
            "Annahmen festhalten, Unsicherheit sichtbar machen. Das Team entscheidet.",
          ],
          [
            "04",
            "An abgeschlossener Arbeit lernen",
            "Referenzen und Prognosen nachkalibrieren. Review, Nacharbeit und Wartezeiten mitbetrachten.",
          ],
        ].map(([number, title, text]) => (
          <article className="panel takeaway-card" key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </>
  );
}
