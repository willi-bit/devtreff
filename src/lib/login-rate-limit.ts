const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;

// Deliberately local to this server instance. Vercel WAF can enforce the same
// limit across instances without adding a rate-limit database to this demo.
export function loginRetryAfter(ip: string, now = Date.now()) {
  for (const [key, entry] of attempts) {
    if (entry.resetAt <= now) attempts.delete(key);
  }

  let entry = attempts.get(ip);
  if (!entry) {
    if (attempts.size >= 1000) return 60;
    entry = { count: 0, resetAt: now + WINDOW_MS };
    attempts.set(ip, entry);
  }
  if (entry.count >= 30) return Math.ceil((entry.resetAt - now) / 1000);
  entry.count += 1;
  return 0;
}
