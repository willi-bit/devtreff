import type { Actor, Order, OrderStatus } from "./types";

export function listOrders(
  data: Order[],
  actor: Actor,
  status: OrderStatus | "all",
  page: number,
  pageSize: number,
) {
  if (!Number.isInteger(page) || page < 0) throw new Error("Ungültige Seite.");
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100)
    throw new Error("Pro Seite sind 1 bis 100 Bestellungen erlaubt.");
  const visible = data.filter(
    (order) =>
      order.tenant === actor.tenant &&
      (status === "all" || order.status === status),
  );
  const start = page * pageSize;
  return {
    rows: visible.slice(start, start + pageSize),
    total: visible.length,
    page,
    pageSize,
    hasMore: start + pageSize < visible.length,
  };
}
