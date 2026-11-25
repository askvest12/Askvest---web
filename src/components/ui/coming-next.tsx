import { ButtonLink } from "./button";
import { BackButton } from "./back-button";

/** Temporary page for routes that are linked but not built yet. */
export function ComingNext({ title, note }: { title: string; note: string }) {
  return (
    <main className="flex min-h-dvh flex-1 flex-col px-5 pt-4 pb-6">
      <BackButton fallbackHref="/welcome" />
      <h1 className="mt-5 text-[28px] font-extrabold text-navy">{title}</h1>
      <p className="mt-2 text-[15px] font-medium text-ink-muted">{note}</p>
      <div className="mt-auto">
        <ButtonLink href="/welcome" variant="secondary">
          Back to start
        </ButtonLink>
      </div>
    </main>
  );
}
