// Small inline icons used across onboarding. Stroke icons inherit currentColor.
type P = { className?: string };
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const UserIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" width="20" height="20" className={className} {...stroke} aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
  </svg>
);

export const MailIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" width="20" height="20" className={className} {...stroke} aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const LockIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" width="20" height="20" className={className} {...stroke} aria-hidden="true">
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

export const ArrowLeftIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" width="20" height="20" className={className} {...stroke} aria-hidden="true">
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const CheckIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" width="16" height="16" className={className} {...stroke} strokeWidth={2.4} aria-hidden="true">
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const TrendIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" width="16" height="16" className={className} {...stroke} aria-hidden="true">
    <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />
  </svg>
);

export const GiftIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" width="18" height="18" className={className} {...stroke} aria-hidden="true">
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
  </svg>
);

export const CoinsIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" width="22" height="22" className={className} {...stroke} aria-hidden="true">
    <circle cx="9" cy="9" r="6" />
    <path d="M18.1 10.4A6 6 0 1 1 10.4 18" />
  </svg>
);

export const GoogleIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" width="20" height="20" className={className} aria-hidden="true">
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7Z" />
    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24Z" />
    <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z" />
    <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.8 3.6-4.9 6.7-4.9Z" />
  </svg>
);

export const AppleIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" width="20" height="20" className={className} fill="currentColor" aria-hidden="true">
    <path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1ZM13.9 5c.7-.9 1.2-2 1-3.2-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.1.1 2.3-.6 3.1-1.5Z" />
  </svg>
);
