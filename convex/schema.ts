import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  kindValidator,
  phaseValidator,
  pointValidator,
} from "./lib/validators";

export default defineSchema({
  rooms: defineTable({
    code: v.string(),
    hostToken: v.string(),
    phase: phaseValidator,
    generation: v.number(),
    reflectionsRevealed: v.boolean(),
  }).index("by_code", ["code"]),
  members: defineTable({
    roomId: v.id("rooms"),
    token: v.string(),
    name: v.string(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_token", ["roomId", "token"]),
  votes: defineTable({
    roomId: v.id("rooms"),
    memberId: v.id("members"),
    round: v.union(v.literal(1), v.literal(2)),
    point: pointValidator,
    reason: v.string(),
  })
    .index("by_room", ["roomId"])
    .index("by_member_round", ["memberId", "round"]),
  insights: defineTable({
    roomId: v.id("rooms"),
    author: v.string(),
    kind: kindValidator,
    text: v.string(),
    source: v.string(),
    resolved: v.boolean(),
  }).index("by_room", ["roomId"]),
  reflections: defineTable({
    roomId: v.id("rooms"),
    memberId: v.id("members"),
    text: v.string(),
  })
    .index("by_room", ["roomId"])
    .index("by_member", ["memberId"]),
});
