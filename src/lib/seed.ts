import { addDays } from "./dates";
import type { BoardState, Label, Priority, Task } from "./types";

interface Extra {
  done?: boolean;
  labels?: string[];
  subtasks?: Array<[string, boolean]>;
}

export function createSeed(today: string): BoardState {
  const now = new Date().toISOString();

  const labels: Label[] = [
    { id: "seed-label-work", name: "Work", color: "tide" },
    { id: "seed-label-personal", name: "Personal", color: "moss" },
    { id: "seed-label-learning", name: "Learning", color: "ochre" },
  ];

  const make = (
    id: string,
    title: string,
    description: string,
    priority: Priority,
    dueOffset: number | null,
    extra: Extra = {},
  ): Task => ({
    id,
    title,
    description,
    priority,
    dueDate: dueOffset === null ? null : addDays(today, dueOffset),
    labelIds: extra.labels ?? [],
    subtasks: (extra.subtasks ?? []).map(([title, done], i) => ({ id: `${id}-s${i}`, title, done })),
    createdAt: now,
    completedAt: extra.done ? now : null,
  });

  const list = [
    make(
      "seed-drag",
      "Drag this card to In progress",
      "Grab any card and drop it in another column, or reorder inside one. On touch screens, press and hold first.",
      "low",
      0,
    ),
    make(
      "seed-first",
      "Add your first real task",
      "Hit New task or press N. Give it a priority and a due date.",
      "high",
      1,
      { labels: ["seed-label-personal"] },
    ),
    make(
      "seed-labels",
      "Try labels and subtasks",
      "Open a card, add a label and a checklist. Progress shows right on the card.",
      "medium",
      4,
      {
        labels: ["seed-label-learning"],
        subtasks: [
          ["Create a label", false],
          ["Add a subtask", false],
        ],
      },
    ),
    make(
      "seed-backup",
      "Export a backup",
      "Use Export backup in the sidebar. Import it later to restore everything.",
      "low",
      null,
      { labels: ["seed-label-personal"] },
    ),
    make("seed-theme", "Try the dark theme", "The sun and moon button in the header flips it. Your choice is remembered.", "low", null),
    make("seed-plan", "Plan the week", "Pick three things that actually matter. Everything else can wait.", "medium", 2, {
      labels: ["seed-label-work"],
      subtasks: [
        ["List the top three goals", true],
        ["Block time on the calendar", false],
        ["Share the plan", false],
      ],
    }),
    make("seed-review", "Review the open pull request", "Overdue on purpose, so you can see how late work looks.", "high", -2, {
      labels: ["seed-label-work"],
    }),
    make("seed-setup", "Set up the project", "", "low", -3, { done: true }),
    make("seed-name", "Pick a name for the app", "Cairn: a stack of stones that marks progress on the trail.", "medium", -1, {
      done: true,
    }),
  ];

  return {
    tasks: Object.fromEntries(list.map((t) => [t.id, t])),
    columns: {
      todo: ["seed-drag", "seed-first", "seed-labels", "seed-backup", "seed-theme"],
      "in-progress": ["seed-plan", "seed-review"],
      done: ["seed-setup", "seed-name"],
    },
    labels,
  };
}