import Link from "next/link";
import { ConnectionStatus } from "@/components/connection-status";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-6 sm:px-12">
      <header className="flex items-center justify-between gap-4 border-b border-stone-300/60 py-7">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700"
          aria-label="devtreff home"
        >
          devtreff<span className="text-orange-700">.</span>
        </Link>
        <ConnectionStatus />
      </header>

      <main className="flex flex-1 flex-col justify-center py-24 sm:py-32">
        <p className="mb-7 font-mono text-xs tracking-[0.18em] text-orange-800 uppercase">
          A space to build
        </p>
        <h1 className="max-w-4xl text-5xl leading-[1.08] font-medium tracking-[-0.055em] text-stone-900 sm:text-7xl lg:text-8xl">
          Good ideas
          <br />
          <span className="text-stone-500">start here.</span>
        </h1>
        <p className="mt-8 max-w-md text-lg leading-8 text-stone-600">
          A fresh canvas for our next session.
          <br />
          Let&apos;s build something together.
        </p>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-300/60 py-6 text-xs text-stone-500">
        <span>devtreff / the beginning</span>
        <span>Made to be built together.</span>
      </footer>
    </div>
  );
}
