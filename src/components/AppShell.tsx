"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Board } from "@/components/board/Board";
import { FilterBar } from "@/components/board/FilterBar";
import { StatsBar } from "@/components/board/StatsBar";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ConfirmDialog } from "@/components/tasks/ConfirmDialog";
import { TaskDetails } from "@/components/tasks/TaskDetails";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { Toast, type ToastData } from "@/components/ui/Toast";
import { useBoard } from "@/hooks/useBoard";
import { useToday } from "@/hooks/useToday";
import { USER_NAME, STATUSES } from "@/lib/constants";
import { formatLong, greeting } from "@/lib/dates";
import { DEFAULT_FILTERS, hasActiveFilters, matchesFilters } from "@/lib/filters";
import { computeStats } from "@/lib/stats";
import type { Filters, Priority, Status, TaskInput } from "@/lib/types";

type EditorState = { mode: "create"; status: Status } | { mode: "edit"; id: string } | null;
type ConfirmState = { title: string; body: string; action: string; run: () => void } | null;

export function AppShell() {
  const board = useBoard();
  const today = useToday();

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [editor, setEditor] = useState<EditorState>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const patchFilters = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch }));
  const notify = (message: string, action?: ToastData["action"]) => setToast({ message, action });

  // Auto-dismiss toasts
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Keyboard shortcuts: / or Ctrl+K to search, N for a new task
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector("dialog[open]")) return;
      const el = e.target as HTMLElement | null;
      const typing =
        !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
        return;
      }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        setEditor({ mode: "create", status: "todo" });
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const stats = useMemo(
    () => computeStats(board.tasks, board.columns, today),
    [board.tasks, board.columns, today],
  );

  const priorityCounts = useMemo(() => {
    const counts: Record<Priority, number> = { low: 0, medium: 0, high: 0 };
    for (const task of Object.values(board.tasks)) counts[task.priority] += 1;
    return counts;
  }, [board.tasks]);

  if (!board.ready) return <BoardSkeleton />;

  const shown: readonly Status[] = filters.status === "all" ? STATUSES : [filters.status];
  const filtered = hasActiveFilters(filters);
  const visibleCount = shown.reduce(
    (sum, status) =>
      sum +
      board.columns[status].filter((id) => {
        const task = board.tasks[id];
        return task ? matchesFilters(task, filters, today) : false;
      }).length,
    0,
  );

  const statusOfId = (id: string): Status | undefined => STATUSES.find((s) => board.columns[s].includes(id));
  const defaultStatus: Status = filters.status === "all" ? "todo" : filters.status;
  const openCreate = (status: Status = defaultStatus) => {
    setMenuOpen(false);
    setEditor({ mode: "create", status });
  };

  const handleSave = (input: TaskInput, status: Status) => {
    if (!editor) return;
    if (editor.mode === "create") {
      const task = board.addTask(input, status);
      const hidden =
        !matchesFilters(task, filters, today) || (filters.status !== "all" && filters.status !== status);
      if (hidden) {
        notify("Task added, but your filters are hiding it.", {
          label: "Clear filters",
          run: () => setFilters(DEFAULT_FILTERS),
        });
      }
    } else {
      board.updateTask(editor.id, input, status);
    }
    setEditor(null);
  };

  const handleDelete = (id: string) => {
    const undo = board.deleteTask(id);
    setEditor(null);
    setViewId(null);
    if (undo) notify("Task deleted.", { label: "Undo", run: undo });
  };

  const toggleDone = (id: string) => {
    board.moveTask(id, statusOfId(id) === "done" ? "todo" : "done");
  };

  const now = new Date();
  const editingTask = editor?.mode === "edit" ? board.tasks[editor.id] : undefined;
  const viewTask = viewId ? board.tasks[viewId] : undefined;
  const viewStatus = viewId ? statusOfId(viewId) : undefined;

  return (
    <div id="app" className="relative z-[1] flex h-dvh overflow-hidden">
      {menuOpen && (
        <div className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}

      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        filters={filters}
        counts={{
          total: stats.total,
          status: { todo: stats.todo, "in-progress": stats.doing, done: stats.done },
          priority: priorityCounts,
        }}
        onStatus={(status) => {
          patchFilters({ status });
          setMenuOpen(false);
        }}
        onPriority={(priority: Priority | "all") => {
          patchFilters({ priority });
          setMenuOpen(false);
        }}
        onNew={() => openCreate()}
        onClearDone={() =>
          setConfirm({
            title: "Clear completed tasks?",
            body: `${stats.done} finished ${stats.done === 1 ? "task" : "tasks"} will be removed for good.`,
            action: "Clear them",
            run: board.clearDone,
          })
        }
        onLoadSamples={() =>
          setConfirm({
            title: "Load sample tasks?",
            body: "This replaces every task on the board with the sample set.",
            action: "Replace board",
            run: board.loadSamples,
          })
        }
        onDeleteAll={() =>
          setConfirm({
            title: "Delete everything?",
            body: "Every task will be removed and the board will start empty. This cannot be undone.",
            action: "Delete all",
            run: board.clearAll,
          })
        }
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          greeting={`${greeting(now.getHours())}, ${USER_NAME}`}
          subtitle={`${formatLong(today)}. ${
            stats.dueToday === 0 ? "Nothing due today." : `${stats.dueToday} due today.`
          }`}
          query={filters.query}
          onQuery={(query) => patchFilters({ query })}
          searchRef={searchRef}
          onNew={() => openCreate()}
          onMenu={() => setMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] space-y-5 px-4 pb-12 pt-5 md:px-8">
            <StatsBar
              stats={stats}
              overdueActive={filters.overdueOnly}
              onToggleOverdue={() => patchFilters({ overdueOnly: !filters.overdueOnly })}
            />

            <FilterBar
              filters={filters}
              shown={visibleCount}
              total={stats.total}
              onChange={patchFilters}
              onClear={() => setFilters(DEFAULT_FILTERS)}
            />

            <Board
              columns={board.columns}
              tasks={board.tasks}
              statuses={shown}
              filters={filters}
              filtered={filtered}
              today={today}
              onColumnsChange={board.setColumns}
              onAdd={openCreate}
              onOpen={setViewId}
              onEdit={(id) => setEditor({ mode: "edit", id })}
              onDelete={handleDelete}
              onToggle={toggleDone}
            />
          </div>
        </main>
      </div>

      {editor && (editor.mode === "create" || editingTask) && (
        <TaskDialog
          mode={editor.mode}
          task={editingTask}
          status={editor.mode === "create" ? editor.status : (statusOfId(editor.id) ?? "todo")}
          today={today}
          onSave={handleSave}
          onDelete={editor.mode === "edit" ? () => handleDelete(editor.id) : undefined}
          onClose={() => setEditor(null)}
        />
      )}

      {viewTask && viewStatus && (
        <TaskDetails
          task={viewTask}
          status={viewStatus}
          today={today}
          onClose={() => setViewId(null)}
          onEdit={() => {
            setEditor({ mode: "edit", id: viewTask.id });
            setViewId(null);
          }}
          onDelete={() => handleDelete(viewTask.id)}
          onMove={(status) => board.moveTask(viewTask.id, status)}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          body={confirm.body}
          action={confirm.action}
          onConfirm={confirm.run}
          onClose={() => setConfirm(null)}
        />
      )}

      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}

function BoardSkeleton() {
  return (
    <div className="relative z-[1] flex h-dvh animate-pulse">
      <div className="hidden w-64 shrink-0 border-r border-line bg-surface/60 lg:block" />
      <div className="flex-1 space-y-5 p-6">
        <div className="h-10 w-64 rounded-lg bg-sunken" />
        <div className="h-28 rounded-2xl bg-sunken" />
        <div className="grid gap-4 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-sunken" />
          ))}
        </div>
      </div>
    </div>
  );
}