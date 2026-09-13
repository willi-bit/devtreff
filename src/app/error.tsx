"use client";

import Link from "next/link";
import { Button, Logo } from "@/components/ui";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="loading-page">
      <Logo />
      <main className="loading-content">
        <h1>Kurze Unterbrechung.</h1>
        <p>
          Wir konnten den Workshop gerade nicht laden. Deine gespeicherten
          Beiträge bleiben erhalten.
        </p>
        <Button onClick={reset}>Erneut versuchen</Button>
        <Link href="/" className="text-link">
          Zur Startseite
        </Link>
      </main>
    </div>
  );
}
