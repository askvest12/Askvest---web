"use client";

import { clsx } from "clsx";
import { forwardRef, useId, useState, type ComponentProps, type ReactNode } from "react";

type TextFieldProps = ComponentProps<"input"> & {
  label: string;
  icon?: ReactNode;
  /** Message shown under the field. Pass " " to show the error style without a message. */
  error?: string;
  /** Adds a show/hide toggle. Use for passwords. */
  revealable?: boolean;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, icon, error, revealable, type = "text", className, id, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const [shown, setShown] = useState(false);
  const inputType = revealable ? (shown ? "text" : "password") : type;

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <label htmlFor={inputId} className="text-[13px] font-semibold text-ink">
        {label}
      </label>
      <div
        className={clsx(
          "flex h-[52px] items-center gap-3 rounded-[var(--radius-field)] border px-4 transition",
          error
            ? "border-danger bg-danger-50/40 [&>span:first-child]:text-danger"
            : "border-line bg-white focus-within:border-mint-600 focus-within:ring-4 focus-within:ring-mint/20",
        )}
      >
        {icon && <span className="shrink-0 text-ink-subtle">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          aria-invalid={error ? true : undefined}
          aria-describedby={error?.trim() ? errorId : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink-subtle"
          {...rest}
        />
        {revealable && (
          <button
            type="button"
            onClick={() => setShown((s) => !s)}
            className="shrink-0 text-ink-subtle hover:text-ink"
            aria-label={shown ? "Hide password" : "Show password"}
            aria-pressed={shown}
          >
            <EyeIcon off={shown} />
          </button>
        )}
      </div>
      {error?.trim() && (
        <p id={errorId} role="alert" className="text-[12.5px] font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
});

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M3 3l18 18" />}
    </svg>
  );
}
