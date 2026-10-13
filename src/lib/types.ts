export type Status = "todo" | "in-progress" | "done";
export type Priority = "low" | "medium" | "high";
export type LabelColor = "clay" | "moss" | "tide" | "berry" | "ochre" | "stone";

export interface Label {
  id: string;
  name: string;
  color: LabelColor;
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  /** Local date as YYYY-MM-DD, or null when there is no deadline */
  dueDate: string | null;
  labelIds: string[];
  subtasks: Subtask[];
  createdAt: string;
  /** Set if and only if the task sits in the Done column */
  completedAt: string | null;
}

export type TaskInput = Pick<
  Task,
  "title" | "description" | "priority" | "dueDate" | "labelIds" | "subtasks"
>;

/** Ordered task ids per column. A task's status is the column it sits in. */
export type Columns = Record<Status, string[]>;

export interface BoardState {
  tasks: Record<string, Task>;
  columns: Columns;
  labels: Label[];
}

export interface Filters {
  query: string;
  status: Status | "all";
  priority: Priority | "all";
  /** A label id, or "all" */
  label: string;
  overdueOnly: boolean;
}