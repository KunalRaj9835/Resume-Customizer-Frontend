// Headline line as SVG so glyphs stretch to an exact width and scale fluidly. Real text lives in the h1 (sr-only).
export default function SkewText({ text, w, className = "" }: { text: string; w: number; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${w + 60} 190`} className={`block w-full overflow-visible ${className}`}>
      <text x="40" y="170" fontSize="220" fill="#FF4A00" fontFamily="Anton, Impact, sans-serif" textLength={w} lengthAdjust="spacingAndGlyphs" transform="skewX(-18) translate(30 0)">{text}</text>
    </svg>
  );
}
