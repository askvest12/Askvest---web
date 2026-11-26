"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Seconds-left countdown for "Resend in 0:42". Call restart() after a resend. */
export function useCountdown(seconds: number) {
  const [left, setLeft] = useState(seconds);
  const [round, setRound] = useState(0);
  const endsAt = useRef<number | null>(null);

  useEffect(() => {
    // The clock only starts in the browser (Date.now can't run during prerendering).
    endsAt.current = Date.now() + seconds * 1000;
    const id = setInterval(() => {
      const ms = (endsAt.current ?? 0) - Date.now();
      setLeft(Math.max(0, Math.ceil(ms / 1000)));
    }, 500);
    return () => clearInterval(id);
  }, [seconds, round]);

  const restart = useCallback(() => {
    setLeft(seconds);
    setRound((r) => r + 1);
  }, [seconds]);

  const label = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  return { left, label, done: left === 0, restart };
}
