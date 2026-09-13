export type Tenant = "nordlicht" | "hafenwerk";
export type Persona = "nord-admin" | "nord-member" | "hafen-admin";
export type Actor = {
  tenant: Tenant;
  role: "admin" | "member";
  name: string;
  company: string;
};
export type OrderStatus = "open" | "processing" | "shipped";
export type Customer = {
  id: string;
  tenant: Tenant;
  company: string;
  contact: string;
  email: string;
  city: string;
};
export type Order = {
  id: string;
  tenant: Tenant;
  customer: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: number;
};
