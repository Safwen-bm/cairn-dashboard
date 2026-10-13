import { LABEL_COLORS, LABEL_NAME_MAX, MAX_SUBTASKS, PRIORITIES, STATUSES } from "./constants";
import { uid } from "./ids";
import type { BoardState, Columns, Label, LabelColor, Priority, Subtask, Task } from "./types";

const KEY = "cairn:board:v1";
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function sanitizeLabels(raw: unknown): Label[] {
  if (!Array.isArray(raw)) return [];
  const ids = new Set<string>();
  const names = new Set<string>();
  const out: Label[] = [];
  for (const item of raw) {
    if (!isObject(item) || typeof item.id !== "string" || typeof item.name !== "string") continue;
    const name = item.name.trim().slice(0, LABEL_NAME_MAX);
    if (!name || ids.has(item.id) || names.has(name.toLowerCase())) continue;
    ids.add(item.id);
    names.add(name.toLowerCase());
    out.push({
      id: item.id,
      name,
      color: LABEL_COLORS.includes(item.color as LabelColor) ? (item.color as LabelColor) : "stone",
    });
  }
  return out;
}

function sanitizeSubtasks(raw: unknown): Subtask[] {
  if (!Array.isArray(raw)) return [];
  const out: Subtask[] = [];
  for (const item of raw) {
    if (!isObject(item) || typeof item.title !== "string" || item.title.trim() === "") continue;
    out.push({
      id: typeof item.id === "string" ? item.id : uid(),
      title: item.title.trim().slice(0, 120),
      done: item.done === true,
    });
    if (out.length >= MAX_SUBTASKS) break;
  }
  return out;
}

function sanitizeTask(id: string, v: unknown, validLabels: Set<string>): Task | null {
  if (!isObject(v) || typeof v.title !== "string" || v.title.trim() === "") return null;
  return {
    id,
    title: v.title,
    description: typeof v.description === "string" ? v.description : "",
    priority: PRIORITIES.includes(v.priority as Priority) ? (v.priority as Priority) : "medium",
    dueDate: typeof v.dueDate === "string" && ISO_DATE.test(v.dueDate) ? v.dueDate : null,
    labelIds: Array.isArray(v.labelIds)
      ? Array.from(new Set(v.labelIds.filter((x: unknown): x is string => typeof x === "string" && validLabels.has(x))))
      : [],
    subtasks: sanitizeSubtasks(v.subtasks),
    createdAt: typeof v.createdAt === "string" ? v.createdAt : new Date().toISOString(),
    completedAt: typeof v.completedAt === "string" ? v.completedAt : null,
  };
}

/** Repairs anything odd in saved or imported data so it can never crash the board. */
export function sanitizeBoard(raw: unknown): BoardState | null {
  if (!isObject(raw) || !isObject(raw.tasks) || !isObject(raw.columns)) return null;

  const labels = sanitizeLabels(raw.labels);
  const validLabels = new Set(labels.map((l) => l.id));

  const tasks: Record<string, Task> = {};
  for (const [id, value] of Object.entries(raw.tasks)) {
    const task = sanitizeTask(id, value, validLabels);
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

  return { tasks, columns, labels };
}

export function loadBoard(): BoardState | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? sanitizeBoard(JSON.parse(raw)) : null;
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