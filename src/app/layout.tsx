import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { DEMO_ACCESS_COOKIE, verifyDemoAccess } from "../../shared/demo-access";
import "./globals.css";
import "./home.css";
import "./demo.css";
import "./workshop-type.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "devtreff · Gemeinsam besser schätzen",
  description:
    "Ein interaktiver Workshop über menschliche Erfahrung, KI und die Annahmen hinter einer Schätzung.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0f1813",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const access = (await cookies()).get(DEMO_ACCESS_COOKIE)?.value;
  const admitted = await verifyDemoAccess(access);
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {admitted ? (
          <ConvexClientProvider access={access!}>
            {children}
          </ConvexClientProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
