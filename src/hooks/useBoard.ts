"use client";

import { useCallback, useEffect, useReducer, useState } from "react";
import { LABEL_NAME_MAX, STATUSES } from "@/lib/constants";
import { todayISO } from "@/lib/dates";
import { uid } from "@/lib/ids";
import { createSeed } from "@/lib/seed";
import { loadBoard, saveBoard } from "@/lib/storage";
import type { BoardState, Columns, Label, LabelColor, Status, Task, TaskInput } from "@/lib/types";

const emptyColumns = (): Columns => ({ todo: [], "in-progress": [], done: [] });
const EMPTY: BoardState = { tasks: {}, columns: emptyColumns(), labels: [] };

type Action =
  | { type: "hydrate"; state: BoardState }
  | { type: "add"; task: Task; status: Status }
  | { type: "update"; id: string; input: TaskInput; status: Status; now: string }
  | { type: "delete"; id: string }
  | { type: "restore"; task: Task; status: Status; index: number }
  | { type: "setColumns"; columns: Columns; now: string }
  | { type: "move"; id: string; status: Status; now: string }
  | { type: "clearDone" }
  | { type: "toggleSubtask"; taskId: string; subtaskId: string }
  | { type: "addLabel"; label: Label }
  | { type: "updateLabel"; id: string; patch: { name?: string; color?: LabelColor } }
  | { type: "deleteLabel"; id: string };

function statusOf(columns: Columns, id: string): Status | null {
  for (const status of STATUSES) {
    if (columns[status].includes(id)) return status;
  }
  return null;
}

function without(columns: Columns, id: string): Columns {
  return {
    todo: columns.todo.filter((x) => x !== id),
    "in-progress": columns["in-progress"].filter((x) => x !== id),
    done: columns.done.filter((x) => x !== id),
  };
}

/** Keeps completedAt in sync with the column: set in Done, null everywhere else. */
function settle(task: Task, status: Status, now: string): Task {
  if (status === "done") return task.completedAt ? task : { ...task, completedAt: now };
  return task.completedAt ? { ...task, completedAt: null } : task;
}

function reducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
    case "hydrate":
      return action.state;

    case "add": {
      const { task, status } = action;
      return {
        ...state,
        tasks: { ...state.tasks, [task.id]: settle(task, status, task.createdAt) },
        columns: { ...state.columns, [status]: [task.id, ...state.columns[status]] },
      };
    }

    case "update": {
      const previous = state.tasks[action.id];
      if (!previous) return state;
      const from = statusOf(state.columns, action.id);
      const next = settle({ ...previous, ...action.input }, action.status, action.now);

      let columns = state.columns;
      if (from !== action.status) {
        columns = without(state.columns, action.id);
        columns = { ...columns, [action.status]: [...columns[action.status], action.id] };
      }
      return { ...state, tasks: { ...state.tasks, [action.id]: next }, columns };
    }

    case "delete": {
      const tasks = { ...state.tasks };
      delete tasks[action.id];
      return { ...state, tasks, columns: without(state.columns, action.id) };
    }

    case "restore": {
      const list = [...state.columns[action.status]];
      list.splice(Math.min(action.index, list.length), 0, action.task.id);
      return {
        ...state,
        tasks: { ...state.tasks, [action.task.id]: action.task },
        columns: { ...state.columns, [action.status]: list },
      };
    }

    case "setColumns": {
      const tasks = { ...state.tasks };
      for (const status of STATUSES) {
        for (const id of action.columns[status]) {
          const task = tasks[id];
          if (task) tasks[id] = settle(task, status, action.now);
        }
      }
      return { ...state, tasks, columns: action.columns };
    }

    case "move": {
      const task = state.tasks[action.id];
      if (!task) return state;
      const base = without(state.columns, action.id);
      const list =
        action.status === "done" ? [action.id, ...base.done] : [...base[action.status], action.id];
      return {
        ...state,
        tasks: { ...state.tasks, [action.id]: settle(task, action.status, action.now) },
        columns: { ...base, [action.status]: list },
      };
    }

    case "clearDone": {
      const tasks = { ...state.tasks };
      for (const id of state.columns.done) delete tasks[id];
      return { ...state, tasks, columns: { ...state.columns, done: [] } };
    }

    case "toggleSubtask": {
      const task = state.tasks[action.taskId];
      if (!task) return state;
      const subtasks = task.subtasks.map((s) => (s.id === action.subtaskId ? { ...s, done: !s.done } : s));
      return { ...state, tasks: { ...state.tasks, [task.id]: { ...task, subtasks } } };
    }

    case "addLabel":
      return { ...state, labels: [...state.labels, action.label] };

    case "updateLabel": {
      const name = action.patch.name?.trim().slice(0, LABEL_NAME_MAX);
      if (name !== undefined) {
        const clash = state.labels.some((l) => l.id !== action.id && l.name.toLowerCase() === name.toLowerCase());
        if (name === "" || clash) return state;
      }
      return {
        ...state,
        labels: state.labels.map((l) =>
          l.id === action.id
            ? { ...l, ...(name !== undefined ? { name } : {}), ...(action.patch.color ? { color: action.patch.color } : {}) }
            : l,
        ),
      };
    }

    case "deleteLabel": {
      const tasks: Record<string, Task> = {};
      for (const [id, task] of Object.entries(state.tasks)) {
        tasks[id] = task.labelIds.includes(action.id)
          ? { ...task, labelIds: task.labelIds.filter((x) => x !== action.id) }
          : task;
      }
      return { ...state, tasks, labels: state.labels.filter((l) => l.id !== action.id) };
    }
  }
}

export function useBoard() {
  const [state, dispatch] = useReducer(reducer, EMPTY);
  const [ready, setReady] = useState(false);

  // Load once on the client. Until then the UI shows a skeleton, which avoids hydration mismatches.
  useEffect(() => {
    dispatch({ type: "hydrate", state: loadBoard() ?? createSeed(todayISO()) });
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveBoard(state);
  }, [state, ready]);

  const addTask = useCallback((input: TaskInput, status: Status): Task => {
    const task: Task = { id: uid(), ...input, createdAt: new Date().toISOString(), completedAt: null };
    dispatch({ type: "add", task, status });
    return task;
  }, []);

  const updateTask = useCallback((id: string, input: TaskInput, status: Status) => {
    dispatch({ type: "update", id, input, status, now: new Date().toISOString() });
  }, []);

  /** Returns an undo function, or null if the task does not exist. */
  const deleteTask = useCallback(
    (id: string): (() => void) | null => {
      const task = state.tasks[id];
      const status = statusOf(state.columns, id);
      if (!task || !status) return null;
      const index = state.columns[status].indexOf(id);
      dispatch({ type: "delete", id });
      return () => dispatch({ type: "restore", task, status, index });
    },
    [state],
  );

  const moveTask = useCallback((id: string, status: Status) => {
    dispatch({ type: "move", id, status, now: new Date().toISOString() });
  }, []);

  const setColumns = useCallback((columns: Columns) => {
    dispatch({ type: "setColumns", columns, now: new Date().toISOString() });
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    dispatch({ type: "toggleSubtask", taskId, subtaskId });
  }, []);

  /** Creates a label, or returns the existing one when the name is already taken. */
  const addLabel = useCallback(
    (name: string, color: LabelColor): Label => {
      const clean = name.trim().slice(0, LABEL_NAME_MAX);
      const existing = state.labels.find((l) => l.name.toLowerCase() === clean.toLowerCase());
      if (existing) return existing;
      const label: Label = { id: uid(), name: clean, color };
      dispatch({ type: "addLabel", label });
      return label;
    },
    [state.labels],
  );

  const updateLabel = useCallback((id: string, patch: { name?: string; color?: LabelColor }) => {
    dispatch({ type: "updateLabel", id, patch });
  }, []);

  const deleteLabel = useCallback((id: string) => dispatch({ type: "deleteLabel", id }), []);

  const clearDone = useCallback(() => dispatch({ type: "clearDone" }), []);
  const replaceBoard = useCallback((next: BoardState) => dispatch({ type: "hydrate", state: next }), []);
  const loadSamples = useCallback(() => dispatch({ type: "hydrate", state: createSeed(todayISO()) }), []);
  const clearAll = useCallback(() => dispatch({ type: "hydrate", state: EMPTY }), []);

  return {
    ready,
    tasks: state.tasks,
    columns: state.columns,
    labels: state.labels,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    setColumns,
    toggleSubtask,
    addLabel,
    updateLabel,
    deleteLabel,
    clearDone,
    replaceBoard,
    loadSamples,
    clearAll,
  };
}