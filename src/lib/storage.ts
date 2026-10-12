import { PRIORITIES, STATUSES } from "./constants";
import type { BoardState, Columns, Priority, Task } from "./types";

const KEY = "cairn:board:v1";
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function sanitizeTask(id: string, v: unknown): Task | null {
  if (!isObject(v) || typeof v.title !== "string" || v.title.trim() === "") return null;
  return {
    id,
    title: v.title,
    description: typeof v.description === "string" ? v.description : "",
    priority: PRIORITIES.includes(v.priority as Priority) ? (v.priority as Priority) : "medium",
    dueDate: typeof v.dueDate === "string" && ISO_DATE.test(v.dueDate) ? v.dueDate : null,
    createdAt: typeof v.createdAt === "string" ? v.createdAt : new Date().toISOString(),
    completedAt: typeof v.completedAt === "string" ? v.completedAt : null,
  };
}

/** Repairs anything odd in saved data so a bad save can never crash the board. */
function sanitize(raw: unknown): BoardState | null {
  if (!isObject(raw) || !isObject(raw.tasks) || !isObject(raw.columns)) return null;

  const tasks: Record<string, Task> = {};
  for (const [id, value] of Object.entries(raw.tasks)) {
    const task = sanitizeTask(id, value);
    if (task) tasks[id] = task;
  }

  const columns: Columns = { todo: [], "in-progress": [], done: [] };
  const placed = new Set<string>();
  for (const status of STATUSES) {
    const list = raw.columns[status];
    if (!Array.isArray(list)) continue;
    for (const id of list) {
      if (typeof id === "string" && tasks[id] && !placed.has(id)) {
        columns[status].push(id);
        placed.add(id);
      }
    }
  }
  for (const id of Object.keys(tasks)) {
    if (!placed.has(id)) columns.todo.push(id);
  }

  for (const status of STATUSES) {
    for (const id of columns[status]) {
      const task = tasks[id];
      if (status === "done" && !task.completedAt) task.completedAt = task.createdAt;
      if (status !== "done" && task.completedAt) task.completedAt = null;
    }
  }

  return { tasks, columns };
}

export function loadBoard(): BoardState | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? sanitize(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function saveBoard(state: BoardState): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked. The board keeps working in memory.
  }
}