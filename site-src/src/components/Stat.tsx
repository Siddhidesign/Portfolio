/** A number and its label, read together by screen readers ("16,767 EV reviews"). */
export function Stat({ v, l, className = "" }: { v: string; l: string; className?: string }) {
  return <div className={className}><b aria-hidden="true">{v}</b><span aria-hidden="true">{l}</span><span className="sr">{v} {l}</span></div>;
}

/** White text on a run's color, unless white fails 4.5:1 there; then near-black. */
export function onColor(hex: string) {
  const lum = (h: string) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  return 1.05 / (lum(hex) + 0.05) >= 4.5 ? "#fff" : "#16161A";
}
