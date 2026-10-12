export type Status = "todo" | "in-progress" | "done";
export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  /** Local date as YYYY-MM-DD, or null when there is no deadline */
  dueDate: string | null;
  createdAt: string;
  /** Set if and only if the task sits in the Done column */
  completedAt: string | null;
}

export type TaskInput = Pick<Task, "title" | "description" | "priority" | "dueDate">;

/** Ordered task ids per column. A task's status is the column it sits in. */
export type Columns = Record<Status, string[]>;

export interface BoardState {
  tasks: Record<string, Task>;
  columns: Columns;
}

export interface Filters {
  query: string;
  status: Status | "all";
  priority: Priority | "all";
  overdueOnly: boolean;
}