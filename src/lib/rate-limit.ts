/* ───────────────────────────────────────────────────────
   Simple In-Memory Rate Limiter
   For production, replace with Redis-based rate limiting
   ─────────────────────────────────────────────────────── */

const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, maxAttempts: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (entry.count >= maxAttempts) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: maxAttempts - entry.count };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of hits) {
    if (now > entry.resetAt) hits.delete(key);
  }
}, 60000);
