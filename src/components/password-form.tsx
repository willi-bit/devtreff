"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { Button, ErrorNote, Logo } from "./ui";

export function PasswordForm({ next }: { next: string }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = new FormData(event.currentTarget).get("password");
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Der Zugang konnte nicht geprüft werden.");
        return;
      }
      window.location.assign(next);
    } catch {
      setError("Das hat nicht geklappt. Bitte versuche es erneut.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="home-page">
      <header className="site-header">
        <Logo />
      </header>
      <main className="password-page">
        <form className="panel password-panel" onSubmit={submit}>
          <LockKeyhole size={28} aria-hidden="true" />
          <p className="eyebrow">Willkommen beim devtreff</p>
          <h1>Ein Passwort. Dann geht’s los.</h1>
          <p>
            Den Zugang für diese Veranstaltung bekommst du von deiner
            Moderation.
          </p>
          <label className="field-label" htmlFor="password">
            Veranstaltungspasswort
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={256}
              autoFocus
              aria-describedby={error ? "password-error" : undefined}
              aria-invalid={Boolean(error)}
            />
          </label>
          <div id="password-error">
            <ErrorNote error={error} />
          </div>
          <Button type="submit" disabled={busy}>
            {busy ? "Wird geprüft …" : "Zugang öffnen"}
            <ArrowRight size={16} />
          </Button>
        </form>
      </main>
    </div>
  );
}
