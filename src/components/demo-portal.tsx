"use client";

import Link from "next/link";
import { useState } from "react";
import { useConvex, useQuery } from "convex/react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  Package,
  ShieldCheck,
  Users,
} from "lucide-react";
import { api } from "@convex/_generated/api";
import type { OrderStatus, Persona } from "../../demo/types";
import { useTask } from "@/lib/browser";
import { AppLoading, Avatar, Button, ErrorNote, Logo } from "./ui";
import { useDemoAccess } from "./convex-client-provider";

const statusLabel = {
  open: "Offen",
  processing: "In Bearbeitung",
  shipped: "Versendet",
};
const euro = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

export function DemoPortal() {
  const access = useDemoAccess();
  const [persona, setPersona] = useState<Persona>("nord-admin");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(0);
  const [tab, setTab] = useState<"orders" | "customers">("orders");
  const task = useTask();
  const convex = useConvex();
  const data = useQuery(api.demo.overview, { access, persona, status, page });
  function download() {
    void task.run(async () => {
      const result = await convex.query(api.demo.customerExport, {
        access,
        persona,
      });
      const url = URL.createObjectURL(
        new Blob([result.csv], { type: "text/csv;charset=utf-8" }),
      );
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = result.filename;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }
  if (!data) return <AppLoading />;
  return (
    <div className="demo-page">
      <header className="workspace-header">
        <Logo />
        <Link href="/" className="text-link">
          <ArrowLeft size={14} /> Zum Workshop
        </Link>
        <span className="badge">Fiktives B2B-Beispiel</span>
      </header>
      <div className="demo-shell">
        <aside className="demo-sidebar">
          <div className="demo-company">
            <span>
              <Building2 size={23} />
            </span>
            <div>
              <b>{data.actor.company}</b>
              <small>B2B-Kundenportal</small>
            </div>
          </div>
          <div className="sidebar-caption">Arbeitsbereich</div>
          <button
            className={tab === "orders" ? "demo-nav active" : "demo-nav"}
            onClick={() => setTab("orders")}
          >
            <Package size={17} />
            Bestellungen<span>{data.stats.orders}</span>
          </button>
          <button
            className={tab === "customers" ? "demo-nav active" : "demo-nav"}
            onClick={() => setTab("customers")}
          >
            <Users size={17} />
            Kunden<span>{data.stats.customers}</span>
          </button>
          <div className="demo-ticket">
            <span className="ticket-tag">ORD-42</span>
            <h3>Die nächste Erweiterung</h3>
            <p>
              „Als Kunde möchte ich meine Bestellungen als Excel-Datei
              exportieren …“
            </p>
            <span className="fine-print">
              Wird im Workshop gemeinsam geklärt.
            </span>
          </div>
        </aside>
        <main className="demo-main">
          <div className="demo-top">
            <div>
              <span className="eyebrow">
                Überblick / {tab === "orders" ? "Bestellungen" : "Kunden"}
              </span>
              <h1>
                {tab === "orders"
                  ? "Alles im Blick."
                  : "Gute Beziehungen beginnen hier."}
              </h1>
              <p>
                {tab === "orders"
                  ? "Die aktuellen Bestellungen deines Unternehmens."
                  : "Die Kundenübersicht mit vorhandenem CSV-Export."}
              </p>
            </div>
            <div className="demo-actor">
              <label htmlFor="persona">Demo-Persona wechseln</label>
              <select
                id="persona"
                value={persona}
                onChange={(event) => {
                  setPersona(event.target.value as Persona);
                  setPage(0);
                }}
              >
                <option value="nord-admin">Nordlicht · Admin</option>
                <option value="nord-member">Nordlicht · Mitglied</option>
                <option value="hafen-admin">Hafenwerk · Admin</option>
              </select>
              <span>
                <ShieldCheck size={12} /> Ausschließlich fiktive Daten
              </span>
            </div>
          </div>
          <div className="demo-stats">
            {[
              {
                label: "Bestellungen gesamt",
                value: data.stats.orders,
                icon: Package,
              },
              { label: "Noch offen", value: data.stats.open, icon: Clock3 },
              {
                label: "Kunden im Mandanten",
                value: data.stats.customers,
                icon: Users,
              },
            ].map((item) => (
              <section className="panel demo-stat" key={item.label}>
                <div>
                  <span>{item.label}</span>
                  <strong>{item.value.toLocaleString("de-DE")}</strong>
                </div>
                <item.icon size={22} strokeWidth={1.4} />
              </section>
            ))}
          </div>
          <section className="panel demo-table-panel">
            <div className="demo-table-heading">
              <h2>
                {tab === "orders" ? "Bestellungen" : "Kunden"}
                <span>
                  {tab === "orders" ? data.orders.total : data.customers.length}
                </span>
              </h2>
              {tab === "orders" ? (
                <label className="filter-label">
                  <Filter size={15} />
                  <span className="sr-only">Bestellstatus</span>
                  <select
                    aria-label="Bestellstatus"
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value as typeof status);
                      setPage(0);
                    }}
                  >
                    <option value="all">Alle Status</option>
                    <option value="open">Offen</option>
                    <option value="processing">In Bearbeitung</option>
                    <option value="shipped">Versendet</option>
                  </select>
                </label>
              ) : (
                <Button
                  variant="secondary"
                  onClick={download}
                  busy={task.busy}
                  disabled={data.actor.role !== "admin"}
                >
                  <ArrowDownToLine size={15} />
                  Kunden als CSV exportieren
                </Button>
              )}
            </div>
            <ErrorNote error={task.error} />
            {tab === "customers" && data.actor.role !== "admin" && (
              <p className="demo-export-note">
                <ShieldCheck size={15} />
                Der Kundenexport ist für Admins freigegeben. Du bist als
                Mitglied unterwegs.
              </p>
            )}
            <div className="table-scroll">
              {tab === "orders" ? (
                <table>
                  <thead>
                    <tr>
                      <th>Bestellung</th>
                      <th>Kunde</th>
                      <th>Datum</th>
                      <th>Status</th>
                      <th className="align-right">Betrag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.orders.rows.map((order) => (
                      <tr key={order.id}>
                        <td className="order-id">{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.date.split("-").reverse().join(".")}</td>
                        <td>
                          <span
                            className={`status-badge status-${order.status}`}
                          >
                            <span />
                            {statusLabel[order.status]}
                          </span>
                        </td>
                        <td className="align-right">
                          {euro.format(order.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Kundennummer</th>
                      <th>Unternehmen</th>
                      <th>Kontakt</th>
                      <th>E-Mail</th>
                      <th>Ort</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.customers.map((customer) => (
                      <tr key={customer.id}>
                        <td className="order-id">{customer.id}</td>
                        <td>{customer.company}</td>
                        <td>{customer.contact}</td>
                        <td>{customer.email}</td>
                        <td>{customer.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {tab === "orders" && (
              <div className="table-pagination">
                <span>
                  {data.orders.total ? page * 25 + 1 : 0}–
                  {Math.min((page + 1) * 25, data.orders.total)} von{" "}
                  {data.orders.total} Bestellungen
                </span>
                <div>
                  <button
                    className="icon-button"
                    aria-label="Vorherige Seite"
                    disabled={page === 0}
                    onClick={() => setPage((value) => value - 1)}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span>Seite {page + 1}</span>
                  <button
                    className="icon-button"
                    aria-label="Nächste Seite"
                    disabled={!data.orders.hasMore}
                    onClick={() => setPage((value) => value + 1)}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </section>
          <div className="demo-footer">
            <span className="person-name">
              <Avatar name={data.actor.name} />
              {data.actor.name} ·{" "}
              {data.actor.role === "admin" ? "Admin" : "Mitglied"}
            </span>
            <span>
              Vorbereitete Ausgangsbasis für das Schätzexperiment{" "}
              <ArrowRight size={13} />
            </span>
          </div>
        </main>
      </div>
    </div>
  );
}
