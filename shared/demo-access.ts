export const DEMO_ACCESS_COOKIE = "devtreff-access";

const message = new TextEncoder().encode("devtreff:demo-access:v1");

async function signingKey(password: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export function demoPasswordConfigured() {
  const length = process.env.DEMO_PASSWORD?.length ?? 0;
  return length >= 16 && length <= 256;
}

// A shared bearer credential for this short-lived demo, revoked by changing
// DEMO_PASSWORD in Next.js and Convex. The password itself stays on the server.
export async function createDemoAccess(password: string) {
  const signature = await crypto.subtle.sign(
    "HMAC",
    await signingKey(password),
    message,
  );
  return Array.from(new Uint8Array(signature), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export async function verifyDemoAccess(access: string | undefined) {
  if (!demoPasswordConfigured() || !access || !/^[a-f0-9]{64}$/.test(access))
    return false;

  const signature = Uint8Array.from(access.match(/../g)!, (byte) =>
    parseInt(byte, 16),
  );
  return crypto.subtle.verify(
    "HMAC",
    await signingKey(process.env.DEMO_PASSWORD!),
    signature,
    message,
  );
}
