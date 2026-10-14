// Stand-in for the blueprint drawing in the design (asset not supplied).
export default function Blueprint({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" className={className} fill="none" stroke="#000" strokeWidth=".4">
      {[80, 66, 52, 38, 24].map(r => <circle key={r} cx="110" cy="100" r={r} />)}
      {[0, 20, 40, 60, 80, 100, 120, 140, 160].map(a => <line key={a} x1="110" y1="100" x2={110 + 90 * Math.cos((a * Math.PI) / 180)} y2={100 + 90 * Math.sin((a * Math.PI) / 180)} />)}
      <rect x="20" y="40" width="120" height="120" transform="rotate(-30 80 100)" />
      <rect x="40" y="60" width="80" height="80" transform="rotate(-30 80 100)" />
    </svg>
  );
}
