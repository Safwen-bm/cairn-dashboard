import { isOverdue } from "./dates";
import type { Columns, Task } from "./types";

export function computeStats(tasks: Record<string, Task>, columns: Columns, today: string) {
  const todo = columns.todo.length;
  const doing = columns["in-progress"].length;
  const done = columns.done.length;

  let overdue = 0;
  let dueToday = 0;
  for (const status of ["todo", "in-progress"] as const) {
    for (const id of columns[status]) {
      const task = tasks[id];
      if (!task) continue;
      if (isOverdue(task, today)) overdue += 1;
      else if (task.dueDate === today) dueToday += 1;
    }
  }

  const total = todo + doing + done;
  return {
    total,
    todo,
    doing,
    done,
    overdue,
    dueToday,
    pct: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}