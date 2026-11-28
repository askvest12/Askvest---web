import { clsx } from "clsx";
import { CheckIcon } from "@/components/ui/icons";
import { passwordRules } from "@/lib/validation/auth";

/** Live password rules (backend policy: 10+ chars, a letter, a number). */
export function PasswordChecklist({ password, showErrors }: { password: string; showErrors?: boolean }) {
  if (!password) return null;
  return (
    <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Password requirements">
      {passwordRules.map((r) => {
        const met = r.test(password);
        return (
          <li
            key={r.id}
            className={clsx("flex items-center gap-1.5 text-[12.5px] font-medium", met ? "text-success" : showErrors ? "text-danger" : "text-ink-subtle")}
          >
            <span className={clsx("flex size-4 items-center justify-center rounded-full", met ? "bg-mint text-navy" : "border border-current")} aria-hidden="true">
              {met && <CheckIcon className="size-2.5" />}
            </span>
            {r.label}
            <span className="sr-only">{met ? "(done)" : "(not yet)"}</span>
          </li>
        );
      })}
    </ul>
  );
}
