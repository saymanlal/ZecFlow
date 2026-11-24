export function BrandMark({ height, priority: _priority = false }: { height: number; priority?: boolean }) {
  return (
    <svg
      width={height}
      height={height}
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="36" height="36" rx="10" fill="#181826" stroke="#F4B728" strokeWidth="1.5" />
      <path
        d="M19.25 8V11.2H24.5L13.5 24.8H19.25V28H16.75V24.8H11.5L22.5 11.2H16.75V8H19.25Z"
        fill="#F4B728"
      />
    </svg>
  );
}
