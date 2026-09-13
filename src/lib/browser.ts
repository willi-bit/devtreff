"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { ConvexError } from "convex/values";

function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener("devtreff-storage", listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener("devtreff-storage", listener);
  };
}
export function useStoredValue(key: string) {
  const snapshot = useCallback(() => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }, [key]);
  return useSyncExternalStore(subscribe, snapshot, () => null);
}
export function remember(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
    window.dispatchEvent(new Event("devtreff-storage"));
  } catch {
    throw new Error(
      "Bitte erlaube lokalen Browserspeicher, damit dein Workshop-Zugang erhalten bleibt.",
    );
  }
}
const noSubscription = () => () => {};
export function useHydrated() {
  return useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );
}
export function useOrigin() {
  return useSyncExternalStore(
    noSubscription,
    () => window.location.origin,
    () => "",
  );
}
export function hostKey(code: string) {
  return `devtreff:host:${code}`;
}
export function memberKey(code: string) {
  return `devtreff:member:${code}`;
}
export function makeCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    crypto.getRandomValues(new Uint8Array(6)),
    (n) => alphabet[n % alphabet.length],
  ).join("");
}
export function errorMessage(error: unknown) {
  if (error instanceof ConvexError && typeof error.data === "string")
    return error.data;
  if (error instanceof Error && error.message.startsWith("Bitte erlaube"))
    return error.message;
  return "Das hat gerade nicht geklappt. Prüfe die Verbindung und versuche es erneut.";
}
export function useTask() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const run = async (task: () => Promise<unknown>) => {
    setBusy(true);
    setError("");
    try {
      await task();
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, run };
}
