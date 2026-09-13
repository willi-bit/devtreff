import { NextResponse } from "next/server";
import {
  createDemoAccess,
  DEMO_ACCESS_COOKIE,
  demoPasswordConfigured,
  verifyDemoAccess,
} from "../../../../shared/demo-access";
import { loginRetryAfter } from "../../../lib/login-rate-limit";

export async function POST(request: Request) {
  // Next.js may use its internal hostname in request.url. Compare the browser's
  // origin to the public Host header, as Next.js does for Server Actions.
  let sameOrigin = false;
  try {
    sameOrigin =
      new URL(request.headers.get("origin") ?? "").host ===
      (request.headers.get("host") ?? new URL(request.url).host);
  } catch {
    /* Missing or malformed Origin. */
  }
  if (!sameOrigin)
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 403 });

  // Vercel overwrites this header. Do not trust a client-supplied X-Forwarded-For.
  const ip = process.env.VERCEL
    ? (request.headers.get("x-vercel-forwarded-for") ?? "unknown")
    : "local";
  const retryAfter = loginRetryAfter(ip);
  if (retryAfter)
    return NextResponse.json(
      { error: "Zu viele Versuche. Bitte warte eine Minute." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );

  if (!demoPasswordConfigured())
    return NextResponse.json(
      { error: "Der Zugang ist noch nicht eingerichtet." },
      { status: 503 },
    );

  if (Number(request.headers.get("content-length")) > 1024)
    return NextResponse.json({ error: "Anfrage zu groß." }, { status: 413 });

  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  if (
    typeof password !== "string" ||
    password.length < 16 ||
    password.length > 256
  )
    return NextResponse.json(
      { error: "Das Passwort stimmt nicht." },
      { status: 401 },
    );

  const access = await createDemoAccess(password);
  if (!(await verifyDemoAccess(access)))
    return NextResponse.json(
      { error: "Das Passwort stimmt nicht." },
      { status: 401 },
    );

  const response = NextResponse.json({ ok: true });
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set(DEMO_ACCESS_COOKIE, access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return response;
}
