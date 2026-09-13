import { NextResponse, type NextRequest } from "next/server";
import { DEMO_ACCESS_COOKIE, verifyDemoAccess } from "../shared/demo-access";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/login" || pathname === "/api/access")
    return NextResponse.next();

  if (await verifyDemoAccess(request.cookies.get(DEMO_ACCESS_COOKIE)?.value)) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  if (pathname.startsWith("/api/"))
    return NextResponse.json(
      { error: "Zugang erforderlich." },
      { status: 401 },
    );

  const login = new URL("/login", request.url);
  login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login, 303);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|icon.svg|favicon.ico).*)"],
};
