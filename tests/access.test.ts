/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { api } from "../convex/_generated/api";
import schema from "../convex/schema";
import { POST } from "../src/app/api/access/route";
import { loginRetryAfter } from "../src/lib/login-rate-limit";
import { proxy } from "../src/proxy";
import {
  createDemoAccess,
  DEMO_ACCESS_COOKIE,
  verifyDemoAccess,
} from "../shared/demo-access";

const password = "demo-test-password-long-enough";
const modules = import.meta.glob([
  "../convex/**/*.ts",
  "../convex/**/*.js",
  "!../convex/**/*.d.ts",
]);

beforeEach(() => {
  vi.stubEnv("DEMO_PASSWORD", password);
  vi.stubEnv("VERCEL", "");
});
afterEach(() => vi.unstubAllEnvs());

function login(value: unknown, origin = "https://workshop.test") {
  return POST(
    new Request("https://workshop.test/api/access", {
      method: "POST",
      headers: { "Content-Type": "application/json", origin },
      body: JSON.stringify({ password: value }),
    }),
  );
}

describe("Shared demo access", () => {
  test("only the password produces access; missing configuration fails closed", async () => {
    const access = await createDemoAccess(password);
    expect(access).not.toContain(password);
    expect(await verifyDemoAccess(access)).toBe(true);
    for (const invalid of [
      undefined,
      "",
      password,
      "f".repeat(64),
      access + "0",
    ])
      expect(await verifyDemoAccess(invalid)).toBe(false);

    vi.stubEnv("DEMO_PASSWORD", "another-test-password");
    expect(await verifyDemoAccess(access)).toBe(false);
    vi.stubEnv("DEMO_PASSWORD", "");
    expect(await verifyDemoAccess(access)).toBe(false);
    expect((await login(password)).status).toBe(503);
  });

  test("login rejects wrong passwords and cross-origin requests, then sets a secure cookie", async () => {
    expect((await login("incorrect-password")).status).toBe(401);
    expect((await login({ password })).status).toBe(401);
    expect((await login(password, "https://other.test")).status).toBe(403);

    vi.stubEnv("NODE_ENV", "production");
    const response = await login(password);
    expect(response.status).toBe(200);
    const cookie = response.headers.get("set-cookie")!;
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("SameSite=lax");
    expect(cookie).not.toContain(password);
    expect(await response.json()).toEqual({ ok: true });
    expect(
      await verifyDemoAccess(response.cookies.get(DEMO_ACCESS_COOKIE)?.value),
    ).toBe(true);
  });

  test("protects deep links and direct API requests even with a forged cookie", async () => {
    for (const path of ["/", "/demo", "/room/ABCDEF", "/host/ABCDEF"]) {
      const response = await proxy(
        new NextRequest(`https://workshop.test${path}`, {
          headers: { cookie: `${DEMO_ACCESS_COOKIE}=fake` },
        }),
      );
      expect(response.status).toBe(303);
      const target = new URL(response.headers.get("location")!);
      expect(target.pathname).toBe("/login");
      expect(target.searchParams.get("next")).toBe(path);
    }
    expect(
      (await proxy(new NextRequest("https://workshop.test/api/private")))
        .status,
    ).toBe(401);

    const access = await createDemoAccess(password);
    const response = await proxy(
      new NextRequest("https://workshop.test/demo", {
        headers: { cookie: `${DEMO_ACCESS_COOKIE}=${access}` },
      }),
    );
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("cache-control")).toContain("no-store");
  });

  test("login accepts the public host when Next.js normalizes the internal URL", async () => {
    const response = await POST(
      new Request("http://localhost:3001/api/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          host: "workshop.test",
          origin: "https://workshop.test",
        },
        body: JSON.stringify({ password }),
      }),
    );
    expect(response.status).toBe(200);
  });

  test("throttles bursts without blocking another IP or the next minute", () => {
    const ip = crypto.randomUUID();
    for (let i = 0; i < 30; i++) expect(loginRetryAfter(ip, 1000)).toBe(0);
    expect(loginRetryAfter(ip, 1000)).toBe(60);
    expect(loginRetryAfter(ip, 60_000)).toBe(1);
    expect(loginRetryAfter(crypto.randomUUID(), 1000)).toBe(0);
    expect(loginRetryAfter(ip, 61_000)).toBe(0);
  });

  test("direct Convex calls cannot create, join, read or export without access", async () => {
    const t = convexTest(schema, modules);
    const access = await createDemoAccess(password);
    const code = "TESTAB";
    const hostToken = crypto.randomUUID();
    const token = crypto.randomUUID();
    await expect(
      t.mutation(api.rooms.create, { access: "", code, hostToken }),
    ).rejects.toThrow("Veranstaltungspasswort");
    expect(await t.run((ctx) => ctx.db.query("rooms").collect())).toEqual([]);
    await t.mutation(api.rooms.create, { access, code, hostToken });

    await expect(
      t.mutation(api.rooms.join, { access: "", code, token, name: "Bot" }),
    ).rejects.toThrow("Veranstaltungspasswort");
    await expect(
      t.query(api.rooms.get, { access: "", code, token: hostToken }),
    ).rejects.toThrow("Veranstaltungspasswort");
    await expect(
      t.mutation(api.rooms.reset, { access: "", code, token: hostToken }),
    ).rejects.toThrow("Veranstaltungspasswort");
    await expect(
      t.query(api.demo.overview, {
        access: "",
        persona: "nord-admin",
        status: "all",
        page: 0,
      }),
    ).rejects.toThrow("Veranstaltungspasswort");
    await expect(
      t.query(api.demo.customerExport, { access: "", persona: "nord-admin" }),
    ).rejects.toThrow("Veranstaltungspasswort");
    await expect(t.query(api.health.check, { access: "" })).rejects.toThrow(
      "Veranstaltungspasswort",
    );
    expect(
      await t.query(api.demo.overview, {
        access,
        persona: "nord-admin",
        status: "all",
        page: 0,
      }),
    ).toHaveProperty("orders");
  });
});
