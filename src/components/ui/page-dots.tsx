import { clsx } from "clsx";

/** Carousel / progress pills, matching the Figma indicator (active 40px, inactive ~17-20px). */
export function PageDots({ count, active, tone = "dark" }: { count: number; active: number; tone?: "dark" | "light" }) {
  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={clsx(
            "h-2 rounded-full transition-all duration-300",
            i === active ? "w-10" : "w-[18px]",
            tone === "dark"
              ? i === active ? "bg-navy" : "bg-line"
              : i === active ? "bg-mint" : "bg-white/40",
          )}
        />
      ))}
    </div>
  );
}
