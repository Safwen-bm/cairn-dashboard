import type { Task } from "./types";

const MS_PER_DAY = 86_400_000;

function parse(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDays(iso: string, days: number): string {
  const date = parse(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

/** Whole days from `fromISO` to `iso`. Negative when `iso` is in the past. */
export function diffDays(iso: string, fromISO: string): number {
  const [y1, m1, d1] = iso.split("-").map(Number);
  const [y2, m2, d2] = fromISO.split("-").map(Number);
  return Math.round((Date.UTC(y1, m1 - 1, d1) - Date.UTC(y2, m2 - 1, d2)) / MS_PER_DAY);
}

export function isOverdue(task: Pick<Task, "dueDate" | "completedAt">, today: string): boolean {
  return task.completedAt === null && task.dueDate !== null && task.dueDate < today;
}

export type DueTone = "overdue" | "today" | "soon" | "later";

export function dueInfo(due: string, today: string): { label: string; tone: DueTone } {
  const diff = diffDays(due, today);
  if (diff < 0) return { label: diff === -1 ? "Yesterday" : `${-diff} days late`, tone: "overdue" };
  if (diff === 0) return { label: "Today", tone: "today" };
  if (diff === 1) return { label: "Tomorrow", tone: "soon" };
  if (diff < 7) {
    return { label: new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(parse(due)), tone: "soon" };
  }
  return { label: formatShort(due), tone: "later" };
}

export function formatShort(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(parse(iso));
}

export function formatLong(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(parse(iso));
}

export function formatStamp(isoDateTime: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDateTime));
}

export function greeting(hour: number): string {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
}