import { describe, expect, test } from "vitest";
import { getActor } from "./access";
import { csvCell, createCsv } from "./csv";
import { exportCustomers } from "./customer-export";
import { customers, orders } from "./data";
import { listOrders } from "./orders";

describe("Existing B2B behavior", () => {
  test("order pagination stays in the actor's tenant and honors the status filter", () => {
    const actor = getActor("hafen-admin");
    const first = listOrders(orders, actor, "open", 0, 25);
    const second = listOrders(orders, actor, "open", 1, 25);
    expect(first.rows).toHaveLength(25);
    expect(
      first.rows.every(
        (row) => row.tenant === "hafenwerk" && row.status === "open",
      ),
    ).toBe(true);
    expect(
      new Set([...first.rows, ...second.rows].map((row) => row.id)).size,
    ).toBe(50);
    expect(first.total).toBeGreaterThan(first.rows.length);
    expect(() => listOrders(orders, actor, "all", -1, 25)).toThrow("Seite");
    expect(() => listOrders(orders, actor, "all", 0, 101)).toThrow("100");
  });
  test("customer export enforces roles, tenant isolation, and the limit without truncating", () => {
    expect(() => exportCustomers(customers, getActor("nord-member"))).toThrow(
      "Admins",
    );
    const result = exportCustomers(customers, getActor("nord-admin"));
    expect(result).toContain('"KD-1001"');
    expect(result).not.toContain('"KD-1029"');
    expect(result.startsWith("\uFEFF")).toBe(true);
    const large = Array.from({ length: 1001 }, () => customers[0]);
    expect(() => exportCustomers(large, getActor("nord-admin"))).toThrow(
      "1.000",
    );
    expect(() =>
      exportCustomers(large.slice(0, 1000), getActor("nord-admin")),
    ).not.toThrow();
  });
  test("CSV preserves quotes, delimiters and line breaks and neutralizes formula prefixes", () => {
    expect(csvCell('Berg; "Partner"\nHamburg')).toBe(
      '"Berg; ""Partner""\nHamburg"',
    );
    for (const value of [
      "=1+1",
      "+SUM(A1)",
      "-1+2",
      "@SUM(A1)",
      "  =1+1",
      "\tvalue",
      "\rvalue",
    ])
      expect(csvCell(value)).toBe(`"'${value}"`);
    expect(createCsv(["Firma", "Ort"], [["Müller", "Köln"]])).toBe(
      '\uFEFF"Firma";"Ort"\r\n"Müller";"Köln"\r\n',
    );
  });
});
