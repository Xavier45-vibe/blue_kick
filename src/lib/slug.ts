export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** "12.50" -> 1250. Returns null for blank/invalid input. */
export function toCents(value: FormDataEntryValue | null): number | null {
  const raw = String(value ?? "").trim().replace(/[$,]/g, "");
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

export function toInt(value: FormDataEntryValue | null, fallback = 0): number {
  const n = parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}
