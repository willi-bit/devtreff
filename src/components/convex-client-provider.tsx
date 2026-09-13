"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { createContext, useContext, useState, type ReactNode } from "react";

const DemoAccess = createContext<string | null>(null);

export function useDemoAccess() {
  const access = useContext(DemoAccess);
  if (!access) throw new Error("Veranstaltungszugang fehlt.");
  return access;
}

export function ConvexClientProvider({
  children,
  access,
}: {
  children: ReactNode;
  access: string;
}) {
  const [client] = useState(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;

    if (!url) {
      throw new Error(
        "NEXT_PUBLIC_CONVEX_URL is missing. Run `npm run dev` to configure Convex, or use the Vercel setup in README.md.",
      );
    }

    return new ConvexReactClient(url);
  });

  return (
    <DemoAccess.Provider value={access}>
      <ConvexProvider client={client}>{children}</ConvexProvider>
    </DemoAccess.Provider>
  );
}
