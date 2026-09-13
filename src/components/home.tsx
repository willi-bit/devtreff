"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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
import { useDemoAccess } from "./convex-client-provider";

export function Home() {
  const access = useDemoAccess();
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
      await create({ access, code: roomCode, hostToken: token });
      remember("devtreff:last-room", roomCode);
      router.push(`/host/${roomCode}`);
    });
  }

  return (
    <div className="home-page">
      <header className="site-header">
        <Logo />
        <nav aria-label="Hauptnavigation">
          <a href="#beitreten">Beitreten</a>
          <Link href="/demo">
            B2B-Beispiel <ArrowUpRight size={14} />
          </Link>
        </nav>
      </header>
      <main>
        <section className="home-hero">
          <div className="hero-copy">
            <h1>
              Gemeinsam
              <br />
              <em>besser schätzen.</em>
            </h1>
            <div className="hero-actions">
              <Button onClick={start} busy={task.busy}>
                Workshop starten <ArrowRight size={18} />
              </Button>
            </div>
            <ErrorNote error={task.error} />
            {previous && (
              <Link href={`/host/${previous}`} className="resume-link">
                Workshop {previous} fortsetzen <ArrowUpRight size={13} />
              </Link>
            )}
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="floating-card float-one">
              <strong>3</strong>
            </div>
            <div className="floating-card float-two">
              <strong>8</strong>
            </div>
            <div className="floating-card float-three">
              <strong>?</strong>
            </div>
          </div>
        </section>

        <section
          className="join-strip"
          id="beitreten"
          aria-labelledby="join-heading"
        >
          <h2 id="join-heading">Workshop beitreten</h2>
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
          <h2 className="sr-only">Der Ablauf</h2>
          <ol className="how-grid">
            {["Grundlagen", "Schätzen", "Gemeinsam klären", "Neu schätzen"].map(
              (title, index) => (
                <li className="how-card" key={title}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <h3>{title}</h3>
                </li>
              ),
            )}
          </ol>
        </section>
      </main>
    </div>
  );
}
