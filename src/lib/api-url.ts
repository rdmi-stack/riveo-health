export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://riveo-health-api-production.up.railway.app";

export function api(path: string) {
  return `${API_BASE}${path}`;
}
