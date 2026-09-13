import Link from "next/link";
import { ArrowUpRight, Layers2, LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      className={`brand ${light ? "brand-light" : ""}`}
      href="/"
      aria-label="devtreff Startseite"
    >
      <span className="brand-mark">
        <Layers2 size={21} strokeWidth={1.8} />
      </span>
      <span>
        devtreff<span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
export function Button({
  children,
  variant = "primary",
  busy,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "lime";
  busy?: boolean;
}) {
  return (
    <button
      {...props}
      disabled={props.disabled || busy}
      className={`button button-${variant} ${className}`}
      aria-busy={busy || undefined}
    >
      {busy && <LoaderCircle size={17} className="spin" />}
      {children}
    </button>
  );
}
export function ErrorNote({ error }: { error?: string }) {
  return error ? (
    <p className="error-note" role="alert">
      {error}
    </p>
  ) : null;
}
export function AppLoading() {
  return (
    <div className="loading-page">
      <Logo />
      <div className="loading-content">
        <LoaderCircle className="spin" size={30} />
        <h1>Wir öffnen den Workshop.</h1>
        <p>Einen Moment, die Runde wird geladen.</p>
      </div>
    </div>
  );
}
export function DemoLink() {
  return (
    <Link href="/demo" target="_blank" rel="noreferrer" className="text-link">
      B2B-Beispiel öffnen <ArrowUpRight size={15} />
    </Link>
  );
}
export function Avatar({ name, index = 0 }: { name: string; index?: number }) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className={`avatar avatar-${index % 4}`} aria-hidden="true">
      {initials}
    </span>
  );
}
