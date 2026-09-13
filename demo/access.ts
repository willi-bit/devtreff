import type { Actor, Persona } from "./types";

// Deliberately public personas for a synthetic teaching fixture, not production authentication.
const actors: Record<Persona, Actor> = {
  "nord-admin": {
    tenant: "nordlicht",
    role: "admin",
    name: "Alex Winter",
    company: "Nordlicht Handel",
  },
  "nord-member": {
    tenant: "nordlicht",
    role: "member",
    name: "Sam Keller",
    company: "Nordlicht Handel",
  },
  "hafen-admin": {
    tenant: "hafenwerk",
    role: "admin",
    name: "Kim Berger",
    company: "Hafenwerk",
  },
};
export function getActor(persona: Persona): Actor {
  const actor = actors[persona];
  if (!actor) throw new Error("Diese Demo-Persona gibt es nicht.");
  return actor;
}
export function requireAdmin(actor: Actor) {
  if (actor.role !== "admin")
    throw new Error("Der Kundenexport ist nur für Admins freigegeben.");
}
