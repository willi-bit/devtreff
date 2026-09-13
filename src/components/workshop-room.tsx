"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useConvexConnectionState, useMutation, useQuery } from "convex/react";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  ChevronDown,
  Clipboard,
  Copy,
  Download,
  ExternalLink,
  Lightbulb,
  LockKeyhole,
  Monitor,
  RotateCcw,
  Share2,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { api } from "@convex/_generated/api";
import {
  ANALYSIS_PROMPT,
  PHASE_COPY,
  STEPS,
  stepIndex,
} from "../../shared/workshop";
import {
  hostKey,
  memberKey,
  remember,
  useHydrated,
  useOrigin,
  useStoredValue,
  useTask,
} from "@/lib/browser";
import { report, type Room } from "@/lib/room";
import { AppLoading, Avatar, Button, DemoLink, ErrorNote, Logo } from "./ui";
import {
  LobbyPanel,
  RefinementPanel,
  ResultsPanel,
  ScopePanel,
  Takeaways,
  TransferPanel,
  VotePanel,
} from "./workshop-panels";

export function WorkshopRoom({ code, host }: { code: string; host: boolean }) {
  const token = useStoredValue(host ? hostKey(code) : memberKey(code));
  const hydrated = useHydrated();
  const room = useQuery(api.rooms.get, { code, token: token ?? undefined });
  if (!hydrated || room === undefined) return <AppLoading />;
  if (room === null)
    return (
      <AccessMessage
        title="Diesen Raum gibt es noch nicht."
        description="Prüfe den sechsstelligen Code oder lass dir den Teilnehmerlink von deiner Moderation schicken."
      />
    );
  if (host && (room.access !== "joined" || !room.isHost))
    return (
      <AccessMessage
        title="Dein Moderationszugang fehlt hier."
        description="Öffne den Workshop in dem Browser, in dem du ihn gestartet hast. Dort ist dein Zugang gespeichert. Über den Teilnehmerlink kannst du jederzeit mitmachen."
        code={code}
      />
    );
  if (room.access === "join")
    return <JoinRoom code={code} peopleCount={room.peopleCount} />;
  return <Workspace room={room} token={token!} />;
}
function AccessMessage({
  title,
  description,
  code,
}: {
  title: string;
  description: string;
  code?: string;
}) {
  return (
    <div className="loading-page">
      <Logo />
      <main className="loading-content">
        <LockKeyhole size={30} />
        <h1>{title}</h1>
        <p>{description}</p>
        {code && (
          <Link href={`/room/${code}`} className="button button-primary">
            Als Teilnehmer beitreten <ArrowRight size={16} />
          </Link>
        )}
        <Link href="/" className="text-link">
          <ArrowLeft size={16} /> Zur Startseite
        </Link>
      </main>
    </div>
  );
}
function JoinRoom({
  code,
  peopleCount,
}: {
  code: string;
  peopleCount: number;
}) {
  const [name, setName] = useState("");
  const join = useMutation(api.rooms.join);
  const task = useTask();
  function submit(event: FormEvent) {
    event.preventDefault();
    void task.run(async () => {
      const token =
        localStorage.getItem(memberKey(code)) ?? crypto.randomUUID();
      remember(memberKey(code), token);
      await join({ code, token, name });
    });
  }
  return (
    <div className="join-page">
      <header className="site-header">
        <Logo />
        <Link href="/" className="text-link">
          <ArrowLeft size={15} /> Zurück
        </Link>
      </header>
      <main className="join-layout">
        <div className="join-welcome">
          <span className="eyebrow">Ein gemeinsames Experiment</span>
          <h1>
            Deine Erfahrung.
            <br />
            <em>Unsere nächste Frage.</em>
          </h1>
          <p>
            Eine Aufgabe. Zwei Schätzrunden. Und dazwischen jede Menge gute
            Fragen.
          </p>
          <div className="join-quote">
            <Sparkles size={24} />
            <span>
              Eine Schätzung wird besser,
              <br />
              wenn ihre Annahmen sichtbar werden.
            </span>
          </div>
        </div>
        <form className="panel join-name-panel" onSubmit={submit}>
          <span className="badge">
            <span className="live-dot" /> Workshop {code}
          </span>
          <h2>Schön, dass du dabei bist.</h2>
          <p>Wie sollen wir dich in der Runde nennen?</p>
          <label className="field-label" htmlFor="participant-name">
            Dein Name
          </label>
          <input
            id="participant-name"
            autoComplete="nickname"
            placeholder="Zum Beispiel Alex"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={2}
            maxLength={30}
            required
            autoFocus
          />
          <Button
            type="submit"
            busy={task.busy}
            disabled={name.trim().length < 2}
          >
            Mitmachen <ArrowRight size={17} />
          </Button>
          <ErrorNote error={task.error} />
          <p className="join-count">
            <Users size={16} />{" "}
            {peopleCount === 0
              ? "Du bist die erste Perspektive in der Runde."
              : `${peopleCount} ${peopleCount === 1 ? "Person ist" : "Personen sind"} schon dabei.`}
          </p>
          <p className="fine-print">
            Deine Beiträge sind Teil dieses Workshops. Dein Zugang bleibt in
            diesem Browser gespeichert.
          </p>
        </form>
      </main>
    </div>
  );
}

function ShareDialog({ code }: { code: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const origin = useOrigin();
  const [copied, setCopied] = useState(false);
  const task = useTask();
  const url = `${origin}/room/${code}`;
  return (
    <>
      <Button variant="secondary" onClick={() => dialog.current?.showModal()}>
        <Share2 size={16} />
        <span className="hide-small">Einladen</span>
      </Button>
      <dialog
        ref={dialog}
        className="share-dialog"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="panel-top">
          <span className="eyebrow">Zusammen ist besser</span>
          <button
            className="icon-button"
            onClick={() => dialog.current?.close()}
            aria-label="Einladung schließen"
          >
            <X size={20} />
          </button>
        </div>
        <h2>Eine Runde. Ein Raum.</h2>
        <p>Teile diesen Link oder lass den QR-Code scannen.</p>
        <div className="qr-wrap">
          <QRCodeSVG value={url} size={180} marginSize={2} fgColor="#163e31" />
        </div>
        <div className="share-code">{code}</div>
        <label className="sr-only" htmlFor="participant-link">
          Teilnehmerlink
        </label>
        <input
          id="participant-link"
          readOnly
          value={url}
          onFocus={(e) => e.target.select()}
        />
        <Button
          className="full-width"
          onClick={() =>
            void task.run(async () => {
              await navigator.clipboard.writeText(url);
              setCopied(true);
            })
          }
          busy={task.busy}
        >
          {copied ? <Check size={17} /> : <Copy size={17} />}
          {copied ? "Teilnehmerlink kopiert" : "Teilnehmerlink kopieren"}
        </Button>
        <ErrorNote error={task.error} />
        <Link href={`/room/${code}`} target="_blank" className="text-link">
          Teilnehmeransicht öffnen <ArrowUpRight size={15} />
        </Link>
      </dialog>
    </>
  );
}

function AnalysisDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);
  const task = useTask();
  return (
    <>
      <Button variant="secondary" onClick={() => dialog.current?.showModal()}>
        <Clipboard size={16} /> Analyseauftrag öffnen
      </Button>
      <dialog ref={dialog} className="analysis-dialog">
        <div className="panel-top">
          <span className="eyebrow">Für deinen Coding-Agent</span>
          <button
            className="icon-button"
            onClick={() => dialog.current?.close()}
            aria-label="Analyseauftrag schließen"
          >
            <X size={20} />
          </button>
        </div>
        <h2>Erst Fragen. Noch keine Zahl.</h2>
        <p>
          Der Agent untersucht das vorbereitete B2B-Beispiel. Ihr prüft die
          Antwort gemeinsam und haltet die Erkenntnisse auf dem Board fest.
        </p>
        <pre>{ANALYSIS_PROMPT}</pre>
        <Button
          onClick={() =>
            void task.run(async () => {
              await navigator.clipboard.writeText(ANALYSIS_PROMPT);
              setCopied(true);
            })
          }
        >
          {copied ? <Check size={17} /> : <Copy size={17} />}
          {copied ? "Analyseauftrag kopiert" : "Analyseauftrag kopieren"}
        </Button>
        <ErrorNote error={task.error} />
      </dialog>
    </>
  );
}

function Workspace({ room, token }: { room: Room; token: string }) {
  const advance = useMutation(api.rooms.advance);
  const reset = useMutation(api.rooms.reset);
  const connection = useConvexConnectionState();
  const task = useTask();
  const phase = PHASE_COPY[room.phase];
  const currentStep = stepIndex(room.phase);
  const heading = useRef<HTMLHeadingElement>(null);
  const phaseKey = `${room.generation}-${room.phase}`;
  const previousPhase = useRef(phaseKey);
  useEffect(() => {
    if (previousPhase.current !== phaseKey) {
      previousPhase.current = phaseKey;
      heading.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [phaseKey]);
  const voting = room.phase === "estimate1" || room.phase === "estimate2";
  const canAdvance =
    (!voting || room.votedCount > 0) &&
    (room.phase !== "transfer" || room.reflectionsRevealed);
  const progress = room.members.length
    ? (room.votedCount / room.members.length) * 100
    : 0;
  function resetRound() {
    if (
      window.confirm(
        "Diesen Workshop neu beginnen? Schätzungen, Fragen und Antworten werden gelöscht. Teilnehmende und Raumcode bleiben erhalten.",
      )
    )
      void task.run(() => reset({ code: room.code, token }));
  }
  return (
    <div className="workspace">
      <header className="workspace-header">
        <div className="workspace-brand">
          <Logo />
          <span className="header-divider" />
          <span className="workshop-title">Wie groß ist das wirklich?</span>
        </div>
        <div className="header-tools">
          <span
            className={`connection-pill ${connection.isWebSocketConnected ? "" : "connection-pending"}`}
            role="status"
          >
            <span className="live-dot" />
            {connection.isWebSocketConnected ? "Live verbunden" : "Verbinde …"}
          </span>
          {room.isHost ? (
            <>
              <span className="role-tag">
                <Monitor size={14} /> Moderation
              </span>
              <ShareDialog code={room.code} />
            </>
          ) : (
            <span className="person-name header-person">
              <Avatar name={room.me?.name ?? ""} />
              {room.me?.name}
            </span>
          )}
        </div>
      </header>
      <div className="workshop-grid">
        <aside className="workshop-sidebar">
          <div className="room-code-box">
            <span className="eyebrow">Unser Workshop</span>
            <strong>{room.code}</strong>
            <span>
              <Users size={14} /> {room.members.length} dabei
            </span>
          </div>
          <nav className="step-navigation" aria-label="Workshop-Ablauf">
            <span className="sidebar-caption">Unser Weg</span>
            <ol>
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className={`${index === currentStep ? "step-current" : ""} ${index < currentStep ? "step-complete" : ""}`}
                  aria-current={index === currentStep ? "step" : undefined}
                >
                  <span>
                    {index < currentStep ? (
                      <Check size={14} />
                    ) : (
                      `0${index + 1}`
                    )}
                  </span>
                  <div>
                    {step.title}
                    {index === currentStep && (
                      <small>Hier sind wir gerade</small>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </nav>
          <div className="sidebar-bottom">
            <span className="sidebar-caption">Das gemeinsame Beispiel</span>
            <DemoLink />
            <p>
              ORD-42 · Bestellexport
              <br />
              Fiktives B2B-Portal
            </p>
          </div>
        </aside>
        <main className="workshop-main">
          <div className="phase-heading">
            <span className="eyebrow">{phase.eyebrow}</span>
            <h1 ref={heading} tabIndex={-1}>
              {phase.title}
            </h1>
            <p>{phase.description}</p>
          </div>
          <div
            className="phase-content"
            key={`${room.generation}-${room.phase}`}
          >
            {room.phase === "lobby" && <LobbyPanel room={room} />}
            {room.phase === "estimate1" && (
              <VotePanel room={room} token={token} round={1} />
            )}
            {room.phase === "reveal1" && <ResultsPanel room={room} />}
            {room.phase === "refine" && (
              <RefinementPanel room={room} token={token} />
            )}
            {room.phase === "scope" && (
              <>
                <ScopePanel room={room} />
                <RefinementPanel room={room} token={token} />
              </>
            )}
            {room.phase === "estimate2" && (
              <VotePanel room={room} token={token} round={2} />
            )}
            {room.phase === "compare" && <ResultsPanel room={room} compare />}
            {room.phase === "transfer" && (
              <TransferPanel room={room} token={token} />
            )}
            {room.phase === "done" && (
              <>
                <Takeaways />
                <details className="panel recap-details">
                  <summary>
                    Unsere beiden Schätzrunden ansehen <ChevronDown size={17} />
                  </summary>
                  <ResultsPanel room={room} compare />
                </details>
              </>
            )}
          </div>
          <ErrorNote error={task.error} />
          {room.isHost && room.phase !== "done" ? (
            <div className="moderator-action">
              <div>
                <span className="eyebrow">Du führst durch die Runde</span>
                <span>
                  {voting
                    ? `${room.votedCount} von ${room.members.length} Schätzungen sind bereit.`
                    : "Weiter, wenn ihr gemeinsam so weit seid."}
                </span>
              </div>
              <Button
                onClick={() =>
                  void task.run(() =>
                    advance({
                      code: room.code,
                      token,
                      expectedPhase: room.phase,
                    }),
                  )
                }
                busy={task.busy}
                disabled={!canAdvance}
              >
                {phase.action}
                <ArrowRight size={17} />
              </Button>
            </div>
          ) : (
            room.phase !== "done" && (
              <p className="participant-wait">
                <span className="live-dot" />
                Die Moderation führt euch gemeinsam zum nächsten Schritt.
              </p>
            )
          )}
          {(room.phase === "compare" || room.phase === "done") && (
            <button
              className="button button-secondary export-button"
              onClick={() => report(room)}
            >
              <Download size={16} /> Ergebnisse als Markdown mitnehmen
            </button>
          )}
        </main>
        <aside className="workshop-aside">
          <section className="panel people-panel">
            <div className="panel-top">
              <h3>Die Runde</h3>
              <span className="count-badge">{room.members.length}</span>
            </div>
            {voting && (
              <>
                <div className="progress-track">
                  <div style={{ width: `${progress}%` }} />
                </div>
                <p className="fine-print">
                  {room.votedCount} Schätzungen abgegeben
                </p>
              </>
            )}
            <div className="people-list">
              {room.members.map((person, index) => (
                <div className="person-row" key={person.id}>
                  <Avatar name={person.name} index={index} />
                  <span>
                    {person.name}
                    {person.id === room.me?.id && <small>Du</small>}
                  </span>
                  {voting &&
                    (person.voted ? (
                      <CheckCheck
                        size={16}
                        className="person-ready"
                        aria-label="Schätzung abgegeben"
                      />
                    ) : (
                      <span className="pending-dot" aria-label="Schätzt noch" />
                    ))}
                </div>
              ))}
            </div>
            {room.members.length === 0 && (
              <div className="empty-people">
                <Users size={25} />
                <p>
                  Noch ist es ruhig hier.
                  <br />
                  Lade deine Runde ein.
                </p>
              </div>
            )}
            <span className="fine-print">Beigetretene Teilnehmende</span>
          </section>
          {room.isHost ? (
            <>
              <details className="panel moderator-notes" open>
                <summary>
                  <Lightbulb size={17} /> Dein Moderationshinweis{" "}
                  <ChevronDown size={15} />
                </summary>
                <p>{phase.cue}</p>
              </details>
              {room.phase === "refine" && (
                <div className="agent-tools">
                  <AnalysisDialog />
                  <DemoLink />
                </div>
              )}
              <details className="session-options">
                <summary>
                  Workshop verwalten <ChevronDown size={13} />
                </summary>
                <Link
                  href={`/room/${room.code}`}
                  target="_blank"
                  className="text-link"
                >
                  <ExternalLink size={14} /> Selbst als Teilnehmer beitreten
                </Link>
                <button
                  onClick={resetRound}
                  disabled={task.busy}
                  className="text-link reset-link"
                >
                  <RotateCcw size={14} /> Workshop neu beginnen
                </button>
                <p className="fine-print">
                  Dein Moderationszugang bleibt in diesem Browser gespeichert.
                </p>
              </details>
            </>
          ) : (
            <div className="sidebar-reminder">
              <Sparkles size={21} />
              <p>
                <b>Deine Erfahrung zählt.</b>
                <br />
                Eine gute Frage kann mehr bewegen als eine schnelle Zahl.
              </p>
            </div>
          )}
        </aside>
      </div>
      <footer className="workspace-footer">
        <span>devtreff / gemeinsam besser schätzen</span>
        <span>
          Schritt {currentStep + 1} von {STEPS.length}
        </span>
      </footer>
    </div>
  );
}
