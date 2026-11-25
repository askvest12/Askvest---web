import Link from "next/link";
import { clsx } from "clsx";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "social" | "apple";

const base =
  "inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-[var(--radius-field)] text-[16px] font-bold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-navy text-white hover:bg-navy-700",
  secondary: "border border-line bg-white text-navy hover:bg-surface",
  social: "h-[52px] border border-line bg-white text-[15px] font-semibold text-navy hover:bg-surface",
  apple: "h-[52px] bg-black text-[15px] font-semibold text-white hover:bg-black/85",
};

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
};

export function Button({
  variant = "primary",
  loading,
  loadingText,
  icon,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(base, variants[variant], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />
          {loadingText ?? children}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "primary", className, ...rest }: ButtonLinkProps) {
  return <Link className={clsx(base, variants[variant], className)} {...rest} />;
}
