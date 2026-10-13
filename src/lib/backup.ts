import { STATUSES } from "./constants";
import { todayISO } from "./dates";
import { uid } from "./ids";
import { sanitizeBoard } from "./storage";
import type { BoardState, Columns } from "./types";

export const BACKUP_VERSION = 2;

export function serializeBoard(state: BoardState): string {
  return JSON.stringify(
    {
      app: "cairn",
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      labels: state.labels,
      tasks: state.tasks,
      columns: state.columns,
    },
    null,
    2,
  );
}

/** Returns a cleaned board, or null when the text is not a usable backup. */
export function parseBackup(text: string): BoardState | null {
  try {
    return sanitizeBoard(JSON.parse(text));
  } catch {
    return null;
  }
}

export function backupFilename(): string {
  return `cairn-backup-${todayISO()}.json`;
}

export function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * Adds every imported task next to the current ones with fresh ids.
 * Labels are matched by name (case-insensitive), so you never get two "Work" labels.
 */
export function mergeBoards(current: BoardState, incoming: BoardState): BoardState {
  const labels = [...current.labels];
  const labelMap = new Map<string, string>();
  for (const label of incoming.labels) {
    const existing = labels.find((l) => l.name.toLowerCase() === label.name.toLowerCase());
    if (existing) {
      labelMap.set(label.id, existing.id);
    } else {
      const created = { ...label, id: uid() };
      labels.push(created);
      labelMap.set(label.id, created.id);
    }
  }

  const tasks = { ...current.tasks };
  const columns: Columns = {
    todo: [...current.columns.todo],
    "in-progress": [...current.columns["in-progress"]],
    done: [...current.columns.done],
  };

  for (const status of STATUSES) {
    for (const oldId of incoming.columns[status]) {
      const task = incoming.tasks[oldId];
      if (!task) continue;
      const id = uid();
      tasks[id] = {
        ...task,
        id,
        labelIds: task.labelIds.map((x) => labelMap.get(x)).filter((x): x is string => Boolean(x)),
        subtasks: task.subtasks.map((s) => ({ ...s, id: uid() })),
      };
      columns[status].push(id);
    }
  }

  return { tasks, columns, labels };
}