import { addDays } from "./dates";
import type { BoardState, Priority, Task } from "./types";

export function createSeed(today: string): BoardState {
  const now = new Date().toISOString();

  const make = (
    id: string,
    title: string,
    description: string,
    priority: Priority,
    dueOffset: number | null,
    done = false,
  ): Task => ({
    id,
    title,
    description,
    priority,
    dueDate: dueOffset === null ? null : addDays(today, dueOffset),
    createdAt: now,
    completedAt: done ? now : null,
  });

  const list = [
    make(
      "seed-drag",
      "Drag this card to In progress",
      "Grab any card and drop it in another column, or reorder inside one. On touch screens, press and hold first.",
      "low",
      0,
    ),
    make("seed-first", "Add your first real task", "Hit New task or press N. Give it a priority and a due date.", "high", 1),
    make("seed-theme", "Try the dark theme", "The sun and moon button in the header flips it. Your choice is remembered.", "low", null),
    make("seed-plan", "Plan the week", "Pick three things that actually matter. Everything else can wait.", "medium", 2),
    make("seed-review", "Review the open pull request", "Overdue on purpose, so you can see how late work looks.", "high", -2),
    make("seed-setup", "Set up the project", "", "low", -3, true),
    make("seed-name", "Pick a name for the app", "Cairn: a stack of stones that marks progress on the trail.", "medium", -1, true),
  ];

  return {
    tasks: Object.fromEntries(list.map((t) => [t.id, t])),
    columns: {
      todo: ["seed-drag", "seed-first", "seed-theme"],
      "in-progress": ["seed-plan", "seed-review"],
      done: ["seed-setup", "seed-name"],
    },
  };
}