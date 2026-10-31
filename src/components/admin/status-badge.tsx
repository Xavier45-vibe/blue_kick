/** One place for status colours, so every table uses the same code (admin UX guideline). */
const map: Record<string, string> = {
  active: "sticker-green",
  paid: "sticker-green",
  delivered: "sticker-green",
  draft: "sticker-gold",
  pending: "sticker-gold",
  unfulfilled: "sticker-gold",
  shipped: "sticker-blue",
  archived: "sticker-dark",
  failed: "sticker-red",
  cancelled: "sticker-red",
  refunded: "sticker-pink",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={`sticker ${map[status] ?? ""}`}>{status}</span>;
}
