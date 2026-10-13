import { isOverdue } from "./dates";
import type { Filters, Task } from "./types";

export const DEFAULT_FILTERS: Filters = {
  query: "",
  status: "all",
  priority: "all",
  label: "all",
  overdueOnly: false,
};

export function hasActiveFilters(f: Filters): boolean {
  return (
    f.query.trim() !== "" ||
    f.status !== "all" ||
    f.priority !== "all" ||
    f.label !== "all" ||
    f.overdueOnly
  );
}

/** Status is handled at the column level, so it is not checked here. */
export function matchesFilters(task: Task, f: Filters, today: string): boolean {
  if (f.priority !== "all" && task.priority !== f.priority) return false;
  if (f.label !== "all" && !task.labelIds.includes(f.label)) return false;
  if (f.overdueOnly && !isOverdue(task, today)) return false;

  const q = f.query.trim().toLowerCase();
  if (q) {
    const haystack = `${task.title} ${task.description} ${task.subtasks.map((s) => s.title).join(" ")}`;
    if (!haystack.toLowerCase().includes(q)) return false;
  }
  return true;
}