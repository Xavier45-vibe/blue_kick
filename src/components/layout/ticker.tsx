const items = ["Free shipping over $75", "Family-owned since day one", "New: Aurora Watercolor Palette", "Code WELCOME10 = 10% off", "Glamour you can afford"];

/** Scrolling announcement strip: grey-900 with gold stars. Pauses for reduced-motion users. */
export function Ticker() {
  const row = items.map((t) => (
    <span key={t} className="flex items-center gap-6 whitespace-nowrap">
      {t}
      <span className="text-gold" aria-hidden="true">✦</span>
    </span>
  ));
  return (
    <div className="overflow-hidden bg-grey-900 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-grey-100" aria-label="Announcements">
      <div className="marquee flex w-max gap-6">
        <div className="flex gap-6">{row}</div>
        <div className="flex gap-6" aria-hidden="true">{row}</div>
      </div>
    </div>
  );
}
