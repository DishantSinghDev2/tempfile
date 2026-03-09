// src/hooks/use-countdown.ts
"use client";

import { useState, useEffect } from "react";

export function useCountdown(expiresAt: string) {
  const getRemaining = () => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return { expired: true, display: "Expired", diff: 0 };

    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let display: string;
    if (hours > 24 * 7) {
      const days = Math.floor(hours / 24);
      display = `${days}d`;
    } else if (hours > 0) {
      display = `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      display = `${minutes}m ${seconds}s`;
    } else {
      display = `${seconds}s`;
    }

    return { expired: false, display, diff };
  };

  const [state, setState] = useState(getRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(getRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return state;
}
