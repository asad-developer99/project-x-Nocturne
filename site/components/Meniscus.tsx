/**
 * S3 "meniscus" edge: the next section meets the last on a gentle liquid-surface curve with a thin
 * line of amber light along it. Sits at the top of a section (pulls itself up over the previous one).
 */
export default function Meniscus({ fill = "var(--bg)", className = "" }: { fill?: string; className?: string }) {
  return (
    <div aria-hidden className={`meniscus ${className}`}>
      <svg viewBox="0 0 1000 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="men-light" x1="0" x2="1">
            <stop offset="0" stopColor="#e9a04c" stopOpacity="0" />
            <stop offset=".5" stopColor="#ffd9a0" stopOpacity=".9" />
            <stop offset="1" stopColor="#e9a04c" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="men-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e9a04c" stopOpacity=".16" />
            <stop offset="1" stopColor="#e9a04c" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="men-body" d="M0 100 L0 70 Q500 -10 1000 70 L1000 100 Z" fill={fill} />
        <path className="men-glow" d="M0 70 Q500 -10 1000 70 L1000 100 L0 100 Z" fill="url(#men-glow)" />
        <path className="men-line" d="M0 70 Q500 -10 1000 70" fill="none" stroke="url(#men-light)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
