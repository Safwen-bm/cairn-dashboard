import type { Priority, Status } from "./types";

export const USER_NAME = "Safwen";

export const STATUSES: readonly Status[] = ["todo", "in-progress", "done"];
export const PRIORITIES: readonly Priority[] = ["low", "medium", "high"];

export const STATUS_META: Record<Status, { label: string; tone: string; empty: string }> = {
  todo: {
    label: "To do",
    tone: "text-soft",
    empty: "Nothing queued. Add a task or drag one in.",
  },
  "in-progress": {
    label: "In progress",
    tone: "text-accent",
    empty: "Pick one thing and start. Focus beats juggling.",
  },
  done: {
    label: "Done",
    tone: "text-moss",
    empty: "Finished work gets stacked here.",
  },
};

export const PRIORITY_META: Record<
  Priority,
  { label: string; dot: string; chip: string; bar: string }
> = {
  low: { label: "Low", dot: "bg-tide", chip: "bg-tide/10 text-tide", bar: "bg-tide" },
  medium: { label: "Medium", dot: "bg-ochre", chip: "bg-ochre/10 text-ochre", bar: "bg-ochre" },
  high: { label: "High", dot: "bg-berry", chip: "bg-berry/10 text-berry", bar: "bg-berry" },
};