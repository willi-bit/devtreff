import type { Customer, Order, OrderStatus } from "./types";

const companies = [
  "Berg & Partner",
  "Studio Kante",
  "Grünraum",
  "Kontor West",
  "Morgenrot",
  "Form & Funktion",
  "Atlas Büro",
  "Linie Zwei",
  "Werkraum",
  "Frische Wege",
  "Norden & Co.",
  "Raumgefühl",
];
const cities = ["Hamburg", "Berlin", "Bremen", "Kiel", "Lübeck", "Hannover"];

// A deterministic, explicitly fictitious dataset makes the workshop reproducible.
export const customers: Customer[] = Array.from({ length: 48 }, (_, i) => ({
  id: `KD-${String(1001 + i)}`,
  tenant: i < 28 ? "nordlicht" : "hafenwerk",
  company: `${companies[i % companies.length]}${i >= companies.length ? ` ${Math.floor(i / companies.length) + 1}` : ""}`,
  contact: ["Alex", "Kim", "Sam", "Robin"][i % 4],
  email: `kontakt-${i + 1}@kunde.example`,
  city: cities[i % cities.length],
}));

export const orders: Order[] = Array.from({ length: 1430 }, (_, i) => {
  const tenant = i < 1250 ? "nordlicht" : "hafenwerk";
  const tenantCustomers = customers.filter((c) => c.tenant === tenant);
  return {
    id: `BE-${String(8042 + i)}`,
    tenant,
    customer: tenantCustomers[i % tenantCustomers.length].company,
    date: `2026-09-${String(13 - (i % 12)).padStart(2, "0")}`,
    status: (["open", "processing", "shipped"] as OrderStatus[])[i % 3],
    total: Math.round((148 + ((i * 173.47) % 6400)) * 100) / 100,
    items: 2 + (i % 17),
  };
});
