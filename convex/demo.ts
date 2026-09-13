import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getActor } from "../demo/access";
import { customers, orders } from "../demo/data";
import { listOrders } from "../demo/orders";
import { exportCustomers } from "../demo/customer-export";
import { requireDemoAccess } from "./lib/access";

const persona = v.union(
  v.literal("nord-admin"),
  v.literal("nord-member"),
  v.literal("hafen-admin"),
);
const status = v.union(
  v.literal("all"),
  v.literal("open"),
  v.literal("processing"),
  v.literal("shipped"),
);

export const overview = query({
  args: { access: v.string(), persona, status, page: v.number() },
  handler: async (_ctx, args) => {
    await requireDemoAccess(args.access);
    const actor = getActor(args.persona);
    try {
      return {
        actor,
        orders: listOrders(orders, actor, args.status, args.page, 25),
        customers: customers.filter(
          (customer) => customer.tenant === actor.tenant,
        ),
        stats: {
          orders: orders.filter((o) => o.tenant === actor.tenant).length,
          open: orders.filter(
            (o) => o.tenant === actor.tenant && o.status === "open",
          ).length,
          customers: customers.filter((c) => c.tenant === actor.tenant).length,
        },
      };
    } catch (error) {
      throw new ConvexError(
        error instanceof Error
          ? error.message
          : "Die Liste konnte nicht geladen werden.",
      );
    }
  },
});
export const customerExport = query({
  args: { access: v.string(), persona },
  handler: async (_ctx, args) => {
    await requireDemoAccess(args.access);
    try {
      return {
        csv: exportCustomers(customers, getActor(args.persona)),
        filename: `kunden-${getActor(args.persona).tenant}.csv`,
      };
    } catch (error) {
      throw new ConvexError(
        error instanceof Error
          ? error.message
          : "Der Export konnte nicht erstellt werden.",
      );
    }
  },
});
