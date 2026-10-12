export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="16" className="fill-accent" />
      <g className="fill-accent-fg stroke-accent" strokeWidth="2.5">
        <ellipse cx="32" cy="47" rx="19" ry="8.5" />
        <ellipse cx="33" cy="32.5" rx="14" ry="7" transform="rotate(-5 33 32.5)" />
        <ellipse cx="31" cy="19.5" rx="9" ry="5.5" transform="rotate(7 31 19.5)" />
      </g>
    </svg>
  );
}