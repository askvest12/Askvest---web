// Line icons for the personalisation screens (08, 09). Inherit currentColor.
const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const paths: Record<string, React.ReactNode> = {
  sprout: <path d="M12 20v-8m0 0c0-3 2-5 6-5 0 3-2 5-6 5Zm0 0c0-2.5-1.7-4.5-5-4.5 0 2.5 1.7 4.5 5 4.5Z" />,
  bars: <path d="M5 20V11M10 20V6M15 20v-6M20 20V9M3 20h18" />,
  trend: <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />,
  book: <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15ZM4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5A2.5 2.5 0 0 1 4 20.5Z" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  building: <path d="M4 21V5l8-2v18M12 21V8l8 2v11M3 21h18M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2" />,
  pie: (
    <>
      <path d="M12 3v9h9" />
      <path d="M20.5 15.5A9 9 0 1 1 8.5 3.7" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </>
  ),
};

export function PIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" className={className} {...s} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
