/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { api } from "../convex/_generated/api";
import schema from "../convex/schema";
import { createDemoAccess } from "../shared/demo-access";
import { PHASES } from "../shared/workshop";

let access: string;
beforeAll(async () => {
  vi.stubEnv("DEMO_PASSWORD", "workshop-test-password");
  access = await createDemoAccess("workshop-test-password");
});
afterAll(() => vi.unstubAllEnvs());

const modules = import.meta.glob([
  "../convex/**/*.ts",
  "../convex/**/*.js",
  "!../convex/**/*.d.ts",
]);
async function workshop() {
  const t = convexTest(schema, modules);
  const code = "TESTAB";
  const host = crypto.randomUUID();
  const alice = crypto.randomUUID();
  const bob = crypto.randomUUID();
  await t.mutation(api.rooms.create, { access, code, hostToken: host });
  await t.mutation(api.rooms.join, {
    access,
    code,
    token: alice,
    name: "Alice",
  });
  await t.mutation(api.rooms.join, { access, code, token: bob, name: "Bob" });
  return { t, code, host, alice, bob };
}

describe("Independent estimation and moderator control", () => {
  test("votes stay secret from other participants and the host until reveal", async () => {
    const { t, code, host, alice, bob } = await workshop();
    const anonymous = await t.query(api.rooms.get, { access, code });
    expect(anonymous).toEqual({ access: "join", code, peopleCount: 2 });
    await t.mutation(api.rooms.advance, {
      access,
      code,
      token: host,
      expectedPhase: "lobby",
    });
    await t.mutation(api.rooms.vote, {
      access,
      code,
      token: alice,
      round: 1,
      point: "3",
      reason: "PRIVATE-ALPHA",
    });
    await t.mutation(api.rooms.vote, {
      access,
      code,
      token: bob,
      round: 1,
      point: "8",
      reason: "PRIVATE-BETA",
    });
    const hostView = await t.query(api.rooms.get, {
      access,
      code,
      token: host,
    });
    const aliceView = await t.query(api.rooms.get, {
      access,
      code,
      token: alice,
    });
    expect(JSON.stringify(hostView)).not.toContain("PRIVATE-");
    expect(JSON.stringify(aliceView)).not.toContain("PRIVATE-BETA");
    expect(JSON.stringify(aliceView)).not.toContain(host);
    expect(JSON.stringify(aliceView)).not.toContain(bob);
    expect(aliceView).toMatchObject({
      votedCount: 2,
      firstVotes: [],
      secondVotes: [],
      answers: [],
      ownVotes: [{ point: "3", reason: "PRIVATE-ALPHA" }],
    });
    await expect(
      t.mutation(api.rooms.advance, {
        access,
        code,
        token: alice,
        expectedPhase: "estimate1",
      }),
    ).rejects.toThrow("Nur die Moderation");
    await t.mutation(api.rooms.advance, {
      access,
      code,
      token: host,
      expectedPhase: "estimate1",
    });
    const revealed = await t.query(api.rooms.get, { access, code, token: bob });
    expect(revealed).toMatchObject({
      firstVotes: [
        { point: "3", reason: "PRIVATE-ALPHA" },
        { point: "8", reason: "PRIVATE-BETA" },
      ],
    });
    await expect(
      t.mutation(api.rooms.vote, {
        access,
        code,
        token: alice,
        round: 1,
        point: "1",
        reason: "Too late",
      }),
    ).rejects.toThrow("nicht geöffnet");
    await expect(
      t.mutation(api.rooms.advance, {
        access,
        code,
        token: host,
        expectedPhase: "estimate1",
      }),
    ).rejects.toThrow("inzwischen in einem anderen Schritt");
  });

  test("changing your vote keeps one vote; wrong rounds and empty reveals are rejected", async () => {
    const { t, code, host, alice } = await workshop();
    await t.mutation(api.rooms.advance, {
      access,
      code,
      token: host,
      expectedPhase: "lobby",
    });
    await expect(
      t.mutation(api.rooms.advance, {
        access,
        code,
        token: host,
        expectedPhase: "estimate1",
      }),
    ).rejects.toThrow("mindestens eine");
    await expect(
      t.mutation(api.rooms.vote, {
        access,
        code,
        token: alice,
        round: 2,
        point: "2",
        reason: "Too early",
      }),
    ).rejects.toThrow("nicht geöffnet");
    await t.mutation(api.rooms.vote, {
      access,
      code,
      token: alice,
      round: 1,
      point: "3",
      reason: "First assumption",
    });
    await t.mutation(api.rooms.vote, {
      access,
      code,
      token: alice,
      round: 1,
      point: "?",
      reason: "The format remains unknown",
    });
    expect(
      await t.query(api.rooms.get, { access, code, token: alice }),
    ).toMatchObject({
      votedCount: 1,
      ownVotes: [{ point: "?" }],
    });
    await expect(
      t.mutation(api.rooms.vote, {
        access,
        code,
        token: host,
        round: 1,
        point: "3",
        reason: "Moderator may not vote as a participant",
      }),
    ).rejects.toThrow("zuerst bei");
  });

  test("scope is released deliberately, and the second round hides the first distribution", async () => {
    const { t, code, host, alice } = await workshop();
    await t.mutation(api.rooms.advance, {
      access,
      code,
      token: host,
      expectedPhase: "lobby",
    });
    await t.mutation(api.rooms.vote, {
      access,
      code,
      token: alice,
      round: 1,
      point: "8",
      reason: "An XLSX export of all orders",
    });
    await t.mutation(api.rooms.advance, {
      access,
      code,
      token: host,
      expectedPhase: "estimate1",
    });
    await t.mutation(api.rooms.advance, {
      access,
      code,
      token: host,
      expectedPhase: "reveal1",
    });
    expect(
      await t.query(api.rooms.get, { access, code, token: alice }),
    ).toMatchObject({
      answers: [],
    });
    await t.mutation(api.rooms.addInsight, {
      access,
      code,
      token: alice,
      text: "Does CSV suffice?",
      kind: "question",
    });
    await expect(
      t.mutation(api.rooms.addInsight, {
        access,
        code,
        token: alice,
        text: "CSV definitely suffices",
        kind: "fact",
      }),
    ).rejects.toThrow("Moderation");
    await t.mutation(api.rooms.advance, {
      access,
      code,
      token: host,
      expectedPhase: "refine",
    });
    expect(
      await t.query(api.rooms.get, { access, code, token: alice }),
    ).toMatchObject({
      phase: "analyze",
      answers: [],
      insights: [{ text: "Does CSV suffice?", resolved: false }],
    });
    await t.mutation(api.rooms.addInsight, {
      access,
      code,
      token: alice,
      text: "Does a customer CSV export already exist?",
      kind: "question",
    });
    await expect(
      t.mutation(api.rooms.advance, {
        access,
        code,
        token: alice,
        expectedPhase: "analyze",
      }),
    ).rejects.toThrow("Nur die Moderation");
    await t.mutation(api.rooms.advance, {
      access,
      code,
      token: host,
      expectedPhase: "analyze",
    });
    const reviewed = await t.query(api.rooms.get, { access, code, token: alice });
    expect(reviewed).toMatchObject({ phase: "review", answers: [] });
    if (reviewed?.access !== "joined")
      throw new Error("Participant must remain joined");
    await t.mutation(api.rooms.addInsight, {
      access,
      code,
      token: host,
      text: "A customer CSV export is available; order reuse still needs checking.",
      kind: "fact",
      source: "demo/README.md",
    });
    await t.mutation(api.rooms.resolveInsight, {
      access,
      code,
      token: host,
      id: reviewed.insights[1].id,
    });
    await t.mutation(api.rooms.addInsight, {
      access,
      code,
      token: alice,
      text: "Which columns should be included?",
      kind: "question",
    });
    await t.mutation(api.rooms.advance, {
      access,
      code,
      token: host,
      expectedPhase: "review",
    });
    const clarified = await t.query(api.rooms.get, {
      access,
      code,
      token: alice,
    });
    if (clarified?.access !== "joined")
      throw new Error("Participant must remain joined");
    expect(clarified.answers).toHaveLength(4);
    expect(clarified.insights).toHaveLength(4);
    expect(clarified.insights[1].resolved).toBe(true);
    await t.mutation(api.rooms.advance, {
      access,
      code,
      token: host,
      expectedPhase: "scope",
    });
    expect(
      await t.query(api.rooms.get, { access, code, token: alice }),
    ).toMatchObject({
      firstVotes: [],
      secondVotes: [],
    });
    await expect(
      t.mutation(api.rooms.addInsight, {
        access,
        code,
        token: alice,
        text: "A late question during the independent vote",
        kind: "question",
      }),
    ).rejects.toThrow("gerade geschlossen");
    await t.mutation(api.rooms.vote, {
      access,
      code,
      token: alice,
      round: 2,
      point: "5",
      reason: "CSV reuse, but pagination needs care",
    });
    await t.mutation(api.rooms.advance, {
      access,
      code,
      token: host,
      expectedPhase: "estimate2",
    });
    expect(
      await t.query(api.rooms.get, { access, code, token: alice }),
    ).toMatchObject({
      firstVotes: [{ point: "8" }],
      secondVotes: [{ point: "5" }],
    });
  });

  test("room capabilities cannot change another room's insights or moderation state", async () => {
    const { t, code, host, alice } = await workshop();
    const otherCode = "OTHERA";
    const otherHost = crypto.randomUUID();
    await t.mutation(api.rooms.create, {
      access,
      code: otherCode,
      hostToken: otherHost,
    });
    const insightId = await t.run(async (ctx) => {
      const first = await ctx.db
        .query("rooms")
        .withIndex("by_code", (q) => q.eq("code", code))
        .unique();
      return ctx.db.insert("insights", {
        roomId: first!._id,
        kind: "question",
        author: "Alice",
        text: "Sensitive assumption",
        source: "",
        resolved: false,
      });
    });
    await expect(
      t.mutation(api.rooms.resolveInsight, {
        access,
        code: otherCode,
        token: otherHost,
        id: insightId,
      }),
    ).rejects.toThrow("nicht zu diesem Raum");
    await expect(
      t.mutation(api.rooms.reset, { access, code, token: otherHost }),
    ).rejects.toThrow("Nur die Moderation");
    await expect(
      t.mutation(api.rooms.retreat, {
        access,
        code,
        token: otherHost,
        expectedPhase: "lobby",
      }),
    ).rejects.toThrow("Nur die Moderation");
    await expect(
      t.mutation(api.rooms.join, {
        access,
        code,
        token: crypto.randomUUID(),
        name: "alice",
      }),
    ).rejects.toThrow("bereits dabei");
    expect(
      await t.query(api.rooms.get, { access, code: otherCode, token: alice }),
    ).toMatchObject({ access: "join" });
    expect(
      await t.query(api.rooms.get, { access, code, token: host }),
    ).toMatchObject({
      generation: 1,
    });
  });

  test("transfer answers are secret until reveal; reset clears contributions and preserves access", async () => {
    const { t, code, host, alice, bob } = await workshop();
    await t.run(async (ctx) => {
      const room = await ctx.db
        .query("rooms")
        .withIndex("by_code", (q) => q.eq("code", code))
        .unique();
      await ctx.db.patch(room!._id, { phase: "transfer" });
    });
    await t.mutation(api.rooms.reflect, {
      access,
      code,
      token: alice,
      text: "PRIVATE deadline answer. We need the scope first.",
    });
    const hostView = await t.query(api.rooms.get, {
      access,
      code,
      token: host,
    });
    expect(hostView).toMatchObject({ reflections: [], reflectionCount: 1 });
    expect(JSON.stringify(hostView)).not.toContain("PRIVATE");
    expect(
      JSON.stringify(
        await t.query(api.rooms.get, { access, code, token: bob }),
      ),
    ).not.toContain("PRIVATE");
    await expect(
      t.mutation(api.rooms.revealReflections, { access, code, token: bob }),
    ).rejects.toThrow("Nur die Moderation");
    await t.mutation(api.rooms.revealReflections, {
      access,
      code,
      token: host,
    });
    expect(
      JSON.stringify(
        await t.query(api.rooms.get, { access, code, token: bob }),
      ),
    ).toContain("PRIVATE");
    await expect(
      t.mutation(api.rooms.reflect, {
        access,
        code,
        token: alice,
        text: "Changing the answer after reveal",
      }),
    ).rejects.toThrow("geschlossen");
    await t.mutation(api.rooms.advance, {
      access,
      code,
      token: host,
      expectedPhase: "transfer",
    });
    await t.mutation(api.rooms.reset, { access, code, token: host });
    expect(
      await t.query(api.rooms.get, { access, code, token: alice }),
    ).toMatchObject({
      phase: "lobby",
      generation: 2,
      reflectionCount: 0,
      reflections: [],
      ownReflection: null,
      firstVotes: [],
      secondVotes: [],
      insights: [],
      answers: [],
      me: { name: "Alice" },
    });
  });
});

describe("Stepping back through the workshop", () => {
  test("only the host can go back, the lobby is the boundary, and stale clicks are rejected", async () => {
    const { t, code, host, alice } = await workshop();
    const credentials = { access, code, token: host };
    await expect(
      t.mutation(api.rooms.retreat, { ...credentials, expectedPhase: "lobby" }),
    ).rejects.toThrow("bereits im ersten Schritt");
    await t.mutation(api.rooms.advance, { ...credentials, expectedPhase: "lobby" });
    await expect(
      t.mutation(api.rooms.retreat, {
        ...credentials,
        token: alice,
        expectedPhase: "estimate1",
      }),
    ).rejects.toThrow("Nur die Moderation");
    await expect(
      t.mutation(api.rooms.retreat, {
        ...credentials,
        access: "",
        expectedPhase: "estimate1",
      }),
    ).rejects.toThrow("Veranstaltungspasswort");
    await t.mutation(api.rooms.retreat, {
      ...credentials,
      expectedPhase: "estimate1",
    });
    for (const mutation of [api.rooms.retreat, api.rooms.advance]) {
      await expect(
        t.mutation(mutation, { ...credentials, expectedPhase: "estimate1" }),
      ).rejects.toThrow("inzwischen in einem anderen Schritt");
    }
    expect(await t.query(api.rooms.get, credentials)).toMatchObject({ phase: "lobby" });
  });

  test.each([
    { round: 1, estimate: "estimate1", reveal: "reveal1" },
    { round: 2, estimate: "estimate2", reveal: "compare" },
  ] as const)("going back reopens round $round with saved votes hidden and editable", async ({ round, estimate, reveal }) => {
    const { t, code, host, alice, bob } = await workshop();
    const credentials = { access, code, token: host };
    await t.run(async (ctx) => {
      const room = await ctx.db.query("rooms").unique();
      await ctx.db.patch(room!._id, { phase: estimate });
    });
    for (const token of [alice, bob]) {
      await t.mutation(api.rooms.vote, {
        access, code, token, round, point: "8", reason: "PRIVATE original estimate",
      });
    }
    await t.mutation(api.rooms.advance, { ...credentials, expectedPhase: estimate });
    await t.mutation(api.rooms.retreat, { ...credentials, expectedPhase: reveal });
    const hostView = await t.query(api.rooms.get, credentials);
    expect(hostView).toMatchObject({
      phase: estimate, votedCount: 2, firstVotes: [], secondVotes: [],
    });
    expect(JSON.stringify(hostView)).not.toContain("PRIVATE");
    expect(await t.query(api.rooms.get, { access, code, token: alice })).toMatchObject({
      firstVotes: [], secondVotes: [], ownVotes: [{ round, point: "8" }],
    });
    await t.mutation(api.rooms.vote, {
      access, code, token: alice, round, point: "3", reason: "Revised estimate",
    });
    await t.mutation(api.rooms.advance, { ...credentials, expectedPhase: estimate });
    expect(await t.query(api.rooms.get, credentials)).toMatchObject({
      votedCount: 2,
      [round === 1 ? "firstVotes" : "secondVotes"]: [
        { name: "Alice", point: "3", reason: "Revised estimate" },
        { name: "Bob", point: "8", reason: "PRIVATE original estimate" },
      ],
    });
  });

  test("every phase can be revisited without losing contributions or access", async () => {
    const { t, code, host, alice } = await workshop();
    const credentials = { access, code, token: host };
    const participant = { access, code, token: alice };
    for (const phase of PHASES.slice(0, -1)) {
      if (phase === "estimate1" || phase === "estimate2") {
        await t.mutation(api.rooms.vote, {
          ...participant,
          round: phase === "estimate1" ? 1 : 2,
          point: "5",
          reason: "Saved estimate",
        });
      }
      if (phase === "refine") {
        await t.mutation(api.rooms.addInsight, {
          ...participant, text: "Does CSV suffice?", kind: "question",
        });
      }
      if (phase === "transfer") {
        await t.mutation(api.rooms.reflect, {
          ...participant, text: "We need to agree on scope first.",
        });
        await t.mutation(api.rooms.revealReflections, credentials);
      }
      await t.mutation(api.rooms.advance, { ...credentials, expectedPhase: phase });
    }
    const completed = await t.query(api.rooms.get, credentials);
    for (let index = PHASES.length - 1; index > 0; index--) {
      await t.mutation(api.rooms.retreat, {
        ...credentials, expectedPhase: PHASES[index],
      });
      expect(await t.query(api.rooms.get, participant)).toMatchObject({
        phase: PHASES[index - 1],
        generation: 1,
        me: { name: "Alice" },
        ownVotes: [{ round: 1, point: "5" }, { round: 2, point: "5" }],
        ownReflection: "We need to agree on scope first.",
        reflectionsRevealed: PHASES[index - 1] === "transfer",
      });
    }
    expect(await t.query(api.rooms.get, credentials)).toMatchObject({
      phase: "lobby", firstVotes: [], secondVotes: [], insights: [], reflections: [],
    });
    for (const phase of PHASES.slice(0, -1)) {
      if (phase === "review") {
        expect(await t.query(api.rooms.get, participant)).toMatchObject({
          answers: [], insights: [{ text: "Does CSV suffice?" }],
        });
      }
      if (phase === "transfer") {
        expect(await t.query(api.rooms.get, credentials)).toMatchObject({
          reflections: [], reflectionsRevealed: false, reflectionCount: 1,
        });
        await expect(
          t.mutation(api.rooms.advance, { ...credentials, expectedPhase: phase }),
        ).rejects.toThrow("Decke zuerst die Antworten auf");
        await t.mutation(api.rooms.reflect, {
          ...participant, text: "Updated answer after clarifying the scope.",
        });
        await t.mutation(api.rooms.revealReflections, credentials);
      }
      await t.mutation(api.rooms.advance, { ...credentials, expectedPhase: phase });
    }
    expect(await t.query(api.rooms.get, credentials)).toEqual({
      ...completed,
      reflections: [{ name: "Alice", text: "Updated answer after clarifying the scope." }],
    });
  });
});
