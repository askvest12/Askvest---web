import { useId } from "react";

type LogoMarkProps = {
  className?: string;
  /** "light" = white body for dark backgrounds, "dark" = navy body for light backgrounds */
  tone?: "light" | "dark";
};

/** AskVest "A" mark, exported from Figma (node 20:619). */
export function LogoMark({ className, tone = "light" }: LogoMarkProps) {
  const id = useId();
  const body = tone === "light" ? "#FFFFFF" : "#03193D";
  const fade = tone === "light" ? "#FFFFFF" : "#03193D";
  return (
    <svg
      viewBox="0 0 133 97"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M66.9997 34.3063C75.7997 41.1063 80.6664 51.8063 81.9998 56.3063L104 43.3062L97.4997 31.8063C83.6664 29.8063 58.1997 27.5063 66.9997 34.3063Z"
        fill={`url(#${id}-a)`}
      />
      <path
        d="M46.5 67.3061C40.2046 73.6016 16.3197 87.7642 3.18522 95.0573C2.2963 95.5509 1.34823 94.5504 1.86992 93.6777L53.5 7.3062C59.5 -1.65668 77.5 -5.15674 87 13.3062L100.5 37.3059C58.5 19.8059 56.5 57.3061 46.5 67.3061Z"
        fill={body}
      />
      <path
        d="M105.32 95.3433C97.3197 94.5433 90.653 80.6766 88.3197 73.8433C87.7336 72.2433 87.2674 71.4859 88.3197 71.3433C91.7608 70.8753 102.494 62.5225 107.809 56.9451C108.301 56.4293 109.166 56.5457 109.482 57.1846L127.665 94.017C127.978 94.6518 127.553 95.401 126.847 95.4454C121.89 95.7569 112.523 96.0636 105.32 95.3433Z"
        fill={`url(#${id}-b)`}
      />
      <path
        d="M111.366 49.7085C85.5123 76.5376 46.6092 90.5326 16.5508 95.5113C15.1946 95.7359 14.5325 93.9954 15.6774 93.2344L102.459 35.5552C103.075 35.146 103.224 34.3055 102.787 33.7093L97.8175 26.9329C97.2211 26.1198 97.741 24.9671 98.7453 24.8758L130.117 22.0238C131.051 21.9389 131.763 22.8433 131.462 23.7313L121.175 54.0195C120.851 54.9738 119.609 55.2093 118.958 54.4399L114.22 48.8397C113.73 48.2609 112.85 48.2243 112.314 48.7605L111.366 49.7085Z"
        fill="#5DE9D1"
      />
      <defs>
        <linearGradient id={`${id}-a`} x1="71.5" y1="27.8433" x2="85" y2="50.8433" gradientUnits="userSpaceOnUse">
          <stop offset="0.042" stopColor="#5DE9D1" />
          <stop offset="0.85" stopColor={fade} />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="94.554" y1="52.966" x2="117.51" y2="79.9791" gradientUnits="userSpaceOnUse">
          <stop offset="0.042" stopColor="#B4F0E9" />
          <stop offset="0.85" stopColor={fade} />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Small rounded app-icon version used in chat bubbles and cards. */
export function LogoBadge({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg bg-navy ${className ?? "size-7"}`}
    >
      <LogoMark className="w-[70%]" />
    </span>
  );
}
