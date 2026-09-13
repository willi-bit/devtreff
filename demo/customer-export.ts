import { requireAdmin } from "./access";
import { createCsv } from "./csv";
import type { Actor, Customer } from "./types";

export function exportCustomers(customers: Customer[], actor: Actor) {
  requireAdmin(actor);
  const visible = customers.filter(
    (customer) => customer.tenant === actor.tenant,
  );
  if (visible.length > 1000)
    throw new Error(
      "Der Kundenexport ist auf 1.000 Datensätze begrenzt. Bitte grenze die Auswahl ein.",
    );
  return createCsv(
    ["Kundennummer", "Firma", "Kontakt", "E-Mail", "Ort"],
    visible.map((customer) => [
      customer.id,
      customer.company,
      customer.contact,
      customer.email,
      customer.city,
    ]),
  );
}
