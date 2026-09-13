import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireDemoAccess } from "./lib/access";

export const check = query({
  args: { access: v.string() },
  returns: v.object({ status: v.literal("ok") }),
  handler: async (_ctx, args) => {
    await requireDemoAccess(args.access);
    return { status: "ok" as const };
  },
});
