import { v } from "convex/values";

export const phaseValidator = v.union(
  v.literal("lobby"),
  v.literal("estimate1"),
  v.literal("reveal1"),
  v.literal("refine"),
  v.literal("scope"),
  v.literal("estimate2"),
  v.literal("compare"),
  v.literal("transfer"),
  v.literal("done"),
);
export const pointValidator = v.union(
  v.literal("1"),
  v.literal("2"),
  v.literal("3"),
  v.literal("5"),
  v.literal("8"),
  v.literal("13"),
  v.literal("?"),
);
export const kindValidator = v.union(
  v.literal("question"),
  v.literal("fact"),
  v.literal("assumption"),
);
