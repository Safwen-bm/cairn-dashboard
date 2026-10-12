import { Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Segmented } from "@/components/ui/Segmented";
import { StatusMark } from "@/components/ui/StatusMark";
import { cn } from "@/lib/cn";
import { PRIORITIES, PRIORITY_META, STATUSES, STATUS_META } from "@/lib/constants";
import { addDays } from "@/lib/dates";
import type { Priority, Status, Task, TaskInput } from "@/lib/types";

interface TaskDialogProps {
  mode: "create" | "edit";
  task?: Task;
  status: Status;
  today: string;
  onSave: (input: TaskInput, status: Status) => void;
  onDelete?: () => void;
  onClose: () => void;
}

export function TaskDialog({ mode, task, status, today, onSave, onDelete, onClose }: TaskDialogProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<Priority>(task?.priority ?? "medium");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [column, setColumn] = useState<Status>(status);
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const clean = title.trim();
    if (!clean) {
      setError("Give the task a title first.");
      return;
    }
    onSave({ title: clean, description: description.trim(), priority, dueDate: dueDate || null }, column);
  };

  return (
    <Modal onClose={onClose} labelledBy="task-dialog-label">
      <form onSubmit={submit} noValidate className="flex flex-col gap-5 p-5 sm:p-6">
        <div>
          <p
            id="task-dialog-label"
            className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-faint"
          >
            {mode === "create" ? "New task" : "Edit task"}
          </p>
          <input
            data-autofocus
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            maxLength={120}
            placeholder="What needs doing?"
            aria-label="Title"
            aria-invalid={error ? true : undefined}
            className="w-full border-0 border-b border-line bg-transparent pb-2 font-display text-2xl placeholder:text-faint focus:border-accent focus:outline-none"
          />
          {error && (
            <p role="alert" className="mt-2 text-sm text-berry">
              {error}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="task-description" className="mb-1.5 block text-xs font-medium text-soft">
            Notes
          </label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={600}
            placeholder="Details, links, context (optional)"
            className="field resize-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-xs font-medium text-soft">Priority</p>
            <Segmented<Priority>
              label="Priority"
              value={priority}
              onChange={setPriority}
              options={PRIORITIES.map((p) => ({
                value: p,
                label: PRIORITY_META[p].label,
                icon: <span className={cn("h-2 w-2 rounded-full", PRIORITY_META[p].dot)} />,
              }))}
            />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-soft">Column</p>
            <Segmented<Status>
              label="Column"
              value={column}
              onChange={setColumn}
              options={STATUSES.map((s) => ({
                value: s,
                label: s === "in-progress" ? "Doing" : STATUS_META[s].label,
                icon: <StatusMark status={s} className={cn("h-3.5 w-3.5", STATUS_META[s].tone)} />,
              }))}
            />
          </div>
        </div>

        <div>
          <label htmlFor="task-due" className="mb-1.5 block text-xs font-medium text-soft">
            Due date
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="field w-auto"
            />
            <QuickDate label="Today" onClick={() => setDueDate(today)} />
            <QuickDate label="Tomorrow" onClick={() => setDueDate(addDays(today, 1))} />
            <QuickDate label="Next week" onClick={() => setDueDate(addDays(today, 7))} />
            {dueDate && <QuickDate label="Clear" onClick={() => setDueDate("")} />}
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-line pt-4">
          {mode === "edit" && onDelete && (
            <button type="button" onClick={onDelete} className="btn btn-danger -ml-2">
              <Trash2 size={15} />
              Delete
            </button>
          )}
          <div className="ml-auto flex gap-2">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {mode === "create" ? "Add task" : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

function QuickDate({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-line px-2.5 py-1 text-xs text-soft transition hover:border-accent hover:text-accent"
    >
      {label}
    </button>
  );
}