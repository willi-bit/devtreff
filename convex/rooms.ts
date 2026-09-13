import { ConvexError, v } from "convex/values";
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { PHASES, isRefinementPhase } from "../shared/workshop";
import { PO_ANSWERS } from "./lib/answers";
import { requireDemoAccess } from "./lib/access";
import {
  kindValidator,
  phaseValidator,
  pointValidator,
} from "./lib/validators";

const credentials = { access: v.string(), code: v.string(), token: v.string() };
function clean(value: string, label: string, max: number, min = 1) {
  const result = value.trim();
  if (result.length < min || result.length > max)
    throw new ConvexError(
      `${label}: bitte ${min} bis ${max} Zeichen eingeben.`,
    );
  return result;
}
function validToken(token: string) {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      token,
    )
  )
    throw new ConvexError("Ungültiger Zugang. Bitte erneut beitreten.");
}
async function findRoom(ctx: QueryCtx, code: string) {
  return ctx.db
    .query("rooms")
    .withIndex("by_code", (q) => q.eq("code", code.toUpperCase()))
    .unique();
}
async function requireRoom(ctx: QueryCtx, code: string) {
  const room = await findRoom(ctx, code);
  if (!room)
    throw new ConvexError(
      "Diesen Raum gibt es nicht. Bitte prüfe den Raumcode.",
    );
  return room;
}
function requireHost(room: Doc<"rooms">, token: string) {
  if (room.hostToken !== token)
    throw new ConvexError("Nur die Moderation kann diesen Schritt ausführen.");
}
async function findMember(ctx: QueryCtx, room: Doc<"rooms">, token: string) {
  return ctx.db
    .query("members")
    .withIndex("by_room_token", (q) =>
      q.eq("roomId", room._id).eq("token", token),
    )
    .unique();
}
async function requireMember(ctx: QueryCtx, room: Doc<"rooms">, token: string) {
  const member = await findMember(ctx, room, token);
  if (!member) throw new ConvexError("Bitte tritt dem Workshop zuerst bei.");
  return member;
}

export const create = mutation({
  args: { access: v.string(), code: v.string(), hostToken: v.string() },
  handler: async (ctx, args) => {
    await requireDemoAccess(args.access);
    validToken(args.hostToken);
    const code = args.code.toUpperCase();
    if (!/^[A-Z2-9]{6}$/.test(code))
      throw new ConvexError("Ungültiger Raumcode.");
    if (await findRoom(ctx, code))
      throw new ConvexError(
        "Der Raumcode ist schon vergeben. Bitte erneut versuchen.",
      );
    await ctx.db.insert("rooms", {
      code,
      hostToken: args.hostToken,
      phase: "lobby",
      generation: 1,
      reflectionsRevealed: false,
    });
    return code;
  },
});

export const join = mutation({
  args: { ...credentials, name: v.string() },
  handler: async (ctx, args) => {
    await requireDemoAccess(args.access);
    validToken(args.token);
    const room = await requireRoom(ctx, args.code);
    if (room.hostToken === args.token)
      throw new ConvexError("Bitte nutze den Teilnehmerlink zum Beitreten.");
    const name = clean(args.name, "Name", 30, 2);
    const existing = await findMember(ctx, room, args.token);
    if (existing) return existing._id;
    const members = await ctx.db
      .query("members")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .collect();
    if (members.length >= 50)
      throw new ConvexError("Dieser Workshop ist mit 50 Teilnehmenden voll.");
    if (
      members.some(
        (m) => m.name.toLocaleLowerCase("de") === name.toLocaleLowerCase("de"),
      )
    )
      throw new ConvexError(
        "Der Name ist bereits dabei. Ergänze zum Beispiel deinen Nachnamen.",
      );
    return ctx.db.insert("members", {
      roomId: room._id,
      token: args.token,
      name,
    });
  },
});

export const get = query({
  args: { access: v.string(), code: v.string(), token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireDemoAccess(args.access);
    const room = await findRoom(ctx, args.code);
    if (!room) return null;
    const members = await ctx.db
      .query("members")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .collect();
    const isHost = args.token === room.hostToken;
    const me = args.token ? await findMember(ctx, room, args.token) : null;
    if (!isHost && !me)
      return {
        access: "join" as const,
        code: room.code,
        peopleCount: members.length,
      };
    const [votes, insights, reflections] = await Promise.all([
      ctx.db
        .query("votes")
        .withIndex("by_room", (q) => q.eq("roomId", room._id))
        .collect(),
      ctx.db
        .query("insights")
        .withIndex("by_room", (q) => q.eq("roomId", room._id))
        .collect(),
      ctx.db
        .query("reflections")
        .withIndex("by_room", (q) => q.eq("roomId", room._id))
        .collect(),
    ]);
    const index = PHASES.indexOf(room.phase);
    const firstVisible = index >= 2 && room.phase !== "estimate2";
    const secondVisible = index >= PHASES.indexOf("compare");
    const round = room.phase === "estimate2" || secondVisible ? 2 : 1;
    const safeVote = (vote: Doc<"votes">) => ({
      memberId: vote.memberId,
      name: members.find((m) => m._id === vote.memberId)?.name ?? "Teilnehmer",
      point: vote.point,
      reason: vote.reason,
      round: vote.round,
    });
    return {
      access: "joined" as const,
      code: room.code,
      phase: room.phase,
      generation: room.generation,
      isHost,
      me: me ? { id: me._id, name: me.name } : null,
      members: members.map((m) => ({
        id: m._id,
        name: m.name,
        voted: votes.some(
          (vote) => vote.memberId === m._id && vote.round === round,
        ),
      })),
      firstVotes: firstVisible
        ? votes.filter((vote) => vote.round === 1).map(safeVote)
        : [],
      secondVotes: secondVisible
        ? votes.filter((vote) => vote.round === 2).map(safeVote)
        : [],
      ownVotes: me
        ? votes.filter((vote) => vote.memberId === me._id).map(safeVote)
        : [],
      votedCount: votes.filter((vote) => vote.round === round).length,
      insights:
        index >= PHASES.indexOf("refine")
          ? insights.map((item) => ({
              id: item._id,
              author: item.author,
              kind: item.kind,
              text: item.text,
              source: item.source,
              resolved: item.resolved,
            }))
          : [],
      answers: isHost || index >= PHASES.indexOf("scope") ? PO_ANSWERS : [],
      reflections: room.reflectionsRevealed
        ? reflections.map((r) => ({
            name:
              members.find((m) => m._id === r.memberId)?.name ?? "Teilnehmer",
            text: r.text,
          }))
        : [],
      reflectionCount: reflections.length,
      ownReflection:
        reflections.find((r) => r.memberId === me?._id)?.text ?? null,
      reflectionsRevealed: room.reflectionsRevealed,
    };
  },
});

export const vote = mutation({
  args: {
    ...credentials,
    round: v.union(v.literal(1), v.literal(2)),
    point: pointValidator,
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    await requireDemoAccess(args.access);
    const room = await requireRoom(ctx, args.code);
    const member = await requireMember(ctx, room, args.token);
    if (room.phase !== (args.round === 1 ? "estimate1" : "estimate2"))
      throw new ConvexError("Diese Schätzrunde ist gerade nicht geöffnet.");
    const reason = clean(args.reason, "Begründung", 500, 3);
    const existing = await ctx.db
      .query("votes")
      .withIndex("by_member_round", (q) =>
        q.eq("memberId", member._id).eq("round", args.round),
      )
      .unique();
    if (existing)
      await ctx.db.patch(existing._id, { point: args.point, reason });
    else
      await ctx.db.insert("votes", {
        roomId: room._id,
        memberId: member._id,
        round: args.round,
        point: args.point,
        reason,
      });
  },
});

export const advance = mutation({
  args: { ...credentials, expectedPhase: phaseValidator },
  handler: async (ctx, args) => {
    await requireDemoAccess(args.access);
    const room = await requireRoom(ctx, args.code);
    requireHost(room, args.token);
    if (room.phase !== args.expectedPhase)
      throw new ConvexError("Der Workshop ist inzwischen in einem anderen Schritt.");
    const index = PHASES.indexOf(room.phase);
    if (index === PHASES.length - 1)
      throw new ConvexError("Der Workshop ist bereits abgeschlossen.");
    if (room.phase === "estimate1" || room.phase === "estimate2") {
      const round = room.phase === "estimate1" ? 1 : 2;
      const votes = await ctx.db
        .query("votes")
        .withIndex("by_room", (q) => q.eq("roomId", room._id))
        .collect();
      if (!votes.some((vote) => vote.round === round))
        throw new ConvexError(
          "Warte auf mindestens eine Schätzung, bevor du aufdeckst.",
        );
    }
    if (room.phase === "transfer" && !room.reflectionsRevealed)
      throw new ConvexError("Decke zuerst die Antworten auf.");
    await ctx.db.patch(room._id, { phase: PHASES[index + 1] });
  },
});

export const retreat = mutation({
  args: { ...credentials, expectedPhase: phaseValidator },
  handler: async (ctx, args) => {
    await requireDemoAccess(args.access);
    const room = await requireRoom(ctx, args.code);
    requireHost(room, args.token);
    if (room.phase !== args.expectedPhase)
      throw new ConvexError("Der Workshop ist inzwischen in einem anderen Schritt.");
    const index = PHASES.indexOf(room.phase);
    if (index === 0)
      throw new ConvexError("Der Workshop ist bereits im ersten Schritt.");
    await ctx.db.patch(room._id, {
      phase: PHASES[index - 1],
      reflectionsRevealed: room.phase === "done" && room.reflectionsRevealed,
    });
  },
});

export const addInsight = mutation({
  args: {
    ...credentials,
    text: v.string(),
    kind: kindValidator,
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireDemoAccess(args.access);
    const room = await requireRoom(ctx, args.code);
    if (!isRefinementPhase(room.phase))
      throw new ConvexError("Das Fragenboard ist gerade geschlossen.");
    const isHost = room.hostToken === args.token;
    const member = isHost ? null : await requireMember(ctx, room, args.token);
    if (!isHost && args.kind !== "question")
      throw new ConvexError("Geprüfte Erkenntnisse übernimmt die Moderation.");
    const insights = await ctx.db
      .query("insights")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .take(80);
    if (insights.length >= 80)
      throw new ConvexError(
        "Das Board ist voll. Besprecht zunächst die vorhandenen Fragen.",
      );
    await ctx.db.insert("insights", {
      roomId: room._id,
      author: member?.name ?? "Moderation",
      kind: args.kind,
      text: clean(args.text, "Beitrag", 800, 3),
      source: args.source ? clean(args.source, "Beleg", 200) : "",
      resolved: false,
    });
  },
});

export const resolveInsight = mutation({
  args: { ...credentials, id: v.id("insights") },
  handler: async (ctx, args) => {
    await requireDemoAccess(args.access);
    const room = await requireRoom(ctx, args.code);
    requireHost(room, args.token);
    const item = await ctx.db.get(args.id);
    if (!item || item.roomId !== room._id)
      throw new ConvexError("Dieser Beitrag gehört nicht zu diesem Raum.");
    await ctx.db.patch(item._id, { resolved: !item.resolved });
  },
});

export const reflect = mutation({
  args: { ...credentials, text: v.string() },
  handler: async (ctx, args) => {
    await requireDemoAccess(args.access);
    const room = await requireRoom(ctx, args.code);
    const member = await requireMember(ctx, room, args.token);
    if (room.phase !== "transfer" || room.reflectionsRevealed)
      throw new ConvexError("Die Antwortrunde ist geschlossen.");
    const text = clean(args.text, "Antwort", 600, 10);
    const existing = await ctx.db
      .query("reflections")
      .withIndex("by_member", (q) => q.eq("memberId", member._id))
      .unique();
    if (existing) await ctx.db.patch(existing._id, { text });
    else
      await ctx.db.insert("reflections", {
        roomId: room._id,
        memberId: member._id,
        text,
      });
  },
});

export const revealReflections = mutation({
  args: credentials,
  handler: async (ctx, args) => {
    await requireDemoAccess(args.access);
    const room = await requireRoom(ctx, args.code);
    requireHost(room, args.token);
    if (room.phase !== "transfer")
      throw new ConvexError("Diese Aktion gehört zur Transferrunde.");
    await ctx.db.patch(room._id, { reflectionsRevealed: true });
  },
});

async function clearRound(ctx: MutationCtx, room: Doc<"rooms">) {
  for (const table of ["votes", "insights", "reflections"] as const) {
    const records = await ctx.db
      .query(table)
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .collect();
    for (const record of records) await ctx.db.delete(record._id);
  }
}
export const reset = mutation({
  args: credentials,
  handler: async (ctx, args) => {
    await requireDemoAccess(args.access);
    const room = await requireRoom(ctx, args.code);
    requireHost(room, args.token);
    await clearRound(ctx, room);
    await ctx.db.patch(room._id, {
      phase: "lobby",
      reflectionsRevealed: false,
      generation: room.generation + 1,
    });
  },
});
