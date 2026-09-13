"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Fingerprint,
  Layers2,
  Radio,
  Sparkles,
  Users,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { api } from "@convex/_generated/api";
import {
  hostKey,
  makeCode,
  remember,
  useStoredValue,
  useTask,
} from "@/lib/browser";
import { Button, ErrorNote, Logo } from "./ui";

export function Home() {
  const router = useRouter();
  const create = useMutation(api.rooms.create);
  const previous = useStoredValue("devtreff:last-room");
  const task = useTask();
  const [code, setCode] = useState("");
  const [joinError, setJoinError] = useState("");

  function join(event: FormEvent) {
    event.preventDefault();
    if (!/^[A-Z2-9]{6}$/.test(code.trim().toUpperCase())) {
      setJoinError("Gib den sechsstelligen Raumcode ein.");
      return;
    }
    router.push(`/room/${code.trim().toUpperCase()}`);
  }
  function start() {
    void task.run(async () => {
      const roomCode = makeCode();
      const token = crypto.randomUUID();
      remember(hostKey(roomCode), token);
      await create({ code: roomCode, hostToken: token });
      remember("devtreff:last-room", roomCode);
      router.push(`/host/${roomCode}`);
    });
  }

  return (
    <div className="home-page">
      <header className="site-header">
        <Logo />
        <nav aria-label="Hauptnavigation">
          <a href="#ablauf">Der Ablauf</a>
          <Link href="/demo">
            Das Beispiel <ArrowUpRight size={14} />
          </Link>
        </nav>
        <span className="edition">
          <span className="live-dot" /> Entwickler:innen im Austausch
        </span>
      </header>
      <main>
        <section className="home-hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="tiny-star">✳</span> Menschliche Erfahrung trifft
              KI
            </span>
            <h1>
              Eine Aufgabe.
              <br />
              Viele Perspektiven.
              <br />
              <em>Besser schätzen.</em>
            </h1>
            <p className="hero-description">
              Wie groß ist das wirklich? Findet es gemeinsam heraus. Ein
              interaktiver Workshop über Annahmen, gute Fragen und das, was
              hinter einer Zahl steckt.
            </p>
            <div className="hero-actions">
              <Button onClick={start} busy={task.busy}>
                Workshop starten <ArrowRight size={18} />
              </Button>
              <span>
                Du moderierst.
                <br />
                Alle denken mit.
              </span>
            </div>
            <ErrorNote error={task.error} />
            {previous && (
              <Link href={`/host/${previous}`} className="resume-link">
                Deinen Workshop {previous} fortsetzen <ArrowUpRight size={13} />
              </Link>
            )}
            <div className="hero-meta">
              <span>
                <Users size={15} /> Gemeinsam im Plenum
              </span>
              <span>
                <Radio size={15} /> Live auf allen Geräten
              </span>
            </div>
          </div>
          <div
            className="hero-visual"
            aria-label="Von individuellen Schätzungen zu gemeinsamem Verständnis"
          >
            <div className="visual-topline">
              <span className="live-dot" /> Eure nächste gute Frage.
            </div>
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="floating-card float-one">
              <span>Ich denke …</span>
              <strong>3</strong>
              <small>„Ein einfacher Download?“</small>
            </div>
            <div className="floating-card float-two">
              <span>Meine Annahme</span>
              <strong>8</strong>
              <small>„Und die Datenmenge?“</small>
            </div>
            <div className="floating-card float-three">
              <Sparkles size={20} />
              <strong>?</strong>
              <small>
                Die Frage macht
                <br />
                den Unterschied.
              </small>
            </div>
            <div className="visual-caption">
              <span className="caption-line" />
              <span>
                Erst verstehen.
                <br />
                <b>Dann neu einschätzen.</b>
              </span>
            </div>
            <span className="visual-index">
              01 / Ein gemeinsames Experiment
            </span>
          </div>
        </section>

        <section className="join-strip" aria-labelledby="join-heading">
          <div>
            <span className="eyebrow">Du bist eingeladen?</span>
            <h2 id="join-heading">Deine Perspektive fehlt noch.</h2>
            <p>Raumcode eingeben, Namen wählen, mitdenken.</p>
          </div>
          <form onSubmit={join} className="join-code-form">
            <label className="sr-only" htmlFor="room-code">
              Raumcode
            </label>
            <div className="join-input-row">
              <input
                id="room-code"
                name="code"
                placeholder="RAUMCODE"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase().replace(/\s/g, ""));
                  setJoinError("");
                }}
                maxLength={6}
                autoComplete="off"
                spellCheck={false}
              />
              <Button type="submit" variant="lime">
                Beitreten <ArrowRight size={17} />
              </Button>
            </div>
            <ErrorNote error={joinError} />
          </form>
        </section>

        <section className="how-section" id="ablauf">
          <div className="section-heading">
            <span className="eyebrow">Mehr als eine Zahl</span>
            <h2>
              Einmal schätzen.
              <br />
              Gemeinsam weiterdenken.
            </h2>
            <p>
              Ein vorbereitetes Beispiel führt euch durch den ganzen Workshop.
              Die Erkenntnisse entstehen in eurer Runde.
            </p>
          </div>
          <div className="how-grid">
            {[
              {
                number: "01",
                icon: Fingerprint,
                title: "Unabhängig einschätzen",
                text: "Ein Ticket, gemeinsame Referenzen. Deine Zahl und deine Annahme bleiben zunächst bei dir.",
              },
              {
                number: "02",
                icon: Sparkles,
                title: "Mit besseren Fragen klären",
                text: "Menschliche Erfahrung zuerst. Die KI ergänzt Belege und offene Fragen aus dem bestehenden Code.",
              },
              {
                number: "03",
                icon: Layers2,
                title: "Veränderung verstehen",
                text: "Erneut schätzen, gemeinsam aufdecken und erkennen, welche Annahmen den Unterschied machen.",
              },
            ].map((item) => (
              <article className="how-card" key={item.number}>
                <div>
                  <item.icon size={25} strokeWidth={1.5} />
                  <span>{item.number}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <p className="how-footnote">
            <Check size={15} /> Keine Anmeldung nötig. Ein Name und ein Raumcode
            reichen für die Teilnahme.
          </p>
        </section>
      </main>
      <footer className="site-footer">
        <Logo />
        <span>Gute Schätzungen beginnen mit guten Gesprächen.</span>
        <span className="mono">devtreff / workshop 01</span>
      </footer>
    </div>
  );
}
