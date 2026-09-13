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
  Copy,
  Download,
  ExternalLink,
  LockKeyhole,
  Monitor,
  RotateCcw,
  Share2,
  Users,
  X,
} from "lucide-react";
import { api } from "@convex/_generated/api";
import {
  PHASE_COPY,
  STEPS,
  isRefinementPhase,
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
import { useDemoAccess } from "./convex-client-provider";
import { AppLoading, Avatar, Button, ErrorNote, Logo } from "./ui";
import { AnalysisPanel, WorkshopGuidance } from "./workshop-guidance";
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
  const access = useDemoAccess();
  const token = useStoredValue(host ? hostKey(code) : memberKey(code));
  const hydrated = useHydrated();
  const room = useQuery(api.rooms.get, {
    access,
    code,
    token: token ?? undefined,
  });
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
  const access = useDemoAccess();
  const task = useTask();
  function submit(event: FormEvent) {
    event.preventDefault();
    void task.run(async () => {
      const token =
        localStorage.getItem(memberKey(code)) ?? crypto.randomUUID();
      remember(memberKey(code), token);
      await join({ access, code, token, name });
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
          <h1>
            Gemeinsam
            <br />
            <em>besser schätzen.</em>
          </h1>
        </div>
        <form className="panel join-name-panel" onSubmit={submit}>
          <span className="badge">
            <span className="live-dot" /> Workshop {code}
          </span>
          <h2>Workshop beitreten</h2>
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
            <Users size={16} /> {peopleCount} bereits dabei
          </p>
          <p className="fine-print">
            Dein Zugang bleibt in diesem Browser gespeichert.
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
      <Button
        variant="secondary"
        aria-label="Teilnehmende einladen"
        onClick={() => dialog.current?.showModal()}
      >
        <Share2 size={16} />
        <span className="hide-small">Einladen</span>
      </Button>
      <dialog
        ref={dialog}
        className="share-dialog"
        aria-labelledby="share-heading"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="panel-top">
          <h2 id="share-heading">Workshop einladen</h2>
          <button
            className="icon-button"
            onClick={() => dialog.current?.close()}
            aria-label="Einladung schließen"
          >
            <X size={20} />
          </button>
        </div>
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

function Workspace({ room, token }: { room: Room; token: string }) {
  const access = useDemoAccess();
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
      void task.run(() => reset({ access, code: room.code, token }));
  }
  return (
    <div className="workspace">
      <header className="workspace-header">
        <div className="workspace-brand">
          <Logo />
        </div>
        <div className="header-tools">
          <span
            className={`connection-pill ${connection.isWebSocketConnected ? "" : "connection-pending"}`}
            role="status"
          >
            <span className="live-dot" />
            {connection.isWebSocketConnected ? "Live" : "Verbinde …"}
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
            <span className="room-code-label">Raumcode</span>
            <strong>{room.code}</strong>
          </div>
          <nav className="step-navigation" aria-label="Workshop-Ablauf">
            <ol>
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className={`${index === currentStep ? "step-current" : ""} ${index < currentStep ? "step-complete" : ""}`}
                  aria-current={index === currentStep ? "step" : undefined}
                >
                  <span>
                    {index < currentStep ? <Check size={14} /> : index + 1}
                  </span>
                  <div>{step.title}</div>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
        <main className="workshop-main">
          <div className="phase-heading">
            <h1 ref={heading} tabIndex={-1}>
              {phase.title}
            </h1>
            {room.isHost && room.phase !== "done" && (
              <Button
                onClick={() =>
                  void task.run(() =>
                    advance({
                      access,
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
            )}
          </div>
          <ErrorNote error={task.error} />
          <div
            className="phase-content"
            key={`${room.generation}-${room.phase}`}
          >
            <WorkshopGuidance room={room} />
            {room.phase === "lobby" && <LobbyPanel room={room} />}
            {room.phase === "estimate1" && (
              <VotePanel room={room} token={token} round={1} />
            )}
            {room.phase === "reveal1" && <ResultsPanel room={room} />}
            {isRefinementPhase(room.phase) && (
              <>
                {room.phase === "analyze" && <AnalysisPanel room={room} />}
                {room.phase === "scope" && <ScopePanel room={room} />}
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
          {(room.phase === "compare" || room.phase === "done") && (
            <button
              className="button button-secondary export-button"
              onClick={() => report(room)}
            >
              <Download size={16} /> Protokoll herunterladen
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
                  {room.votedCount} / {room.members.length} Schätzungen
                </p>
              </>
            )}
            {room.members.length > 0 && (
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
                        <span
                          className="pending-dot"
                          aria-label="Schätzt noch"
                        />
                      ))}
                  </div>
                ))}
              </div>
            )}
            {room.members.length === 0 && (
              <div className="empty-people">
                <p>Noch niemand beigetreten.</p>
              </div>
            )}
          </section>
          {room.isHost && (
            <>
              <details className="panel moderator-notes" key={room.phase}>
                <summary>
                  Moderationshinweis
                  <ChevronDown size={15} />
                </summary>
                <p>{phase.cue}</p>
              </details>
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
          )}
        </aside>
      </div>
    </div>
  );
}
