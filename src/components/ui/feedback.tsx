import { clsx } from "clsx";
import type { ReactNode } from "react";

/** Rounded mint tile holding an icon at the top of auth screens (Figma: mail / lock tiles). */
export function IconTile({ children, badge }: { children: ReactNode; badge?: "dot" | "check" }) {
  return (
    <span className="relative flex size-12 items-center justify-center rounded-[14px] bg-surface-mint text-navy" aria-hidden="true">
      {children}
      {badge === "dot" && <span className="absolute top-2 right-2 size-2 rounded-full bg-mint-600 ring-2 ring-surface-mint" />}
      {badge === "check" && (
        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-success text-white ring-2 ring-white">
          <svg viewBox="0 0 24 24" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
      )}
    </span>
  );
}

/** Soft grey info box (Figma: "Can't find it?", "Nothing there?"). */
export function InfoNote({ children, icon, className }: { children: ReactNode; icon?: ReactNode; className?: string }) {
  return (
    <div className={clsx("flex items-start gap-3 rounded-[14px] bg-surface px-4 py-3.5 text-[12.5px] leading-5 font-medium text-ink-muted", className)}>
      <span className="mt-0.5 shrink-0 text-ink-subtle">{icon ?? <InfoIcon />}</span>
      <div>{children}</div>
    </div>
  );
}

/** Red banner for form-level errors (Figma: 05b "Incorrect email or password."). */
export function ErrorBanner({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-[14px] bg-danger-50 px-4 py-3">
      <span className="mt-0.5 shrink-0 text-danger" aria-hidden="true">
        <AlertIcon />
      </span>
      <div>
        <p className="text-[13px] font-bold text-danger">{title}</p>
        {children && <p className="text-[12px] font-medium text-danger/90">{children}</p>}
      </div>
    </div>
  );
}

export function InfoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

export function AlertIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6M12 16.5h.01" />
    </svg>
  );
}

export function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
