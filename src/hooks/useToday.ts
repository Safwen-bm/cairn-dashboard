"use client";

import { useEffect, useState } from "react";
import { todayISO } from "@/lib/dates";

/** Today as YYYY-MM-DD. Refreshes on focus so overdue states stay correct after midnight. */
export function useToday(): string {
  const [today, setToday] = useState(() => todayISO());

  useEffect(() => {
    const update = () => setToday(todayISO());
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    const timer = window.setInterval(update, 60_000);
    return () => {
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
      window.clearInterval(timer);
    };
  }, []);

  return today;
}