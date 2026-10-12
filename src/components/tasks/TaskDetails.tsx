import { Pencil, Trash2, X } from "lucide-react";
import type { ReactNode } from "react";
import { Modal } from "@/components/ui/Modal";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { Segmented } from "@/components/ui/Segmented";
import { StatusMark } from "@/components/ui/StatusMark";
import { cn } from "@/lib/cn";
import { STATUSES, STATUS_META } from "@/lib/constants";
import { dueInfo, formatLong, formatStamp, isOverdue } from "@/lib/dates";
import type { Status, Task } from "@/lib/types";

interface TaskDetailsProps {
  task: Task;
  status: Status;
  today: string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (status: Status) => void;
}

export function TaskDetails({ task, status, today, onClose, onEdit, onDelete, onMove }: TaskDetailsProps) {
  const due = task.dueDate ? dueInfo(task.dueDate, today) : null;
  const late = isOverdue(task, today);

  return (
    <Modal onClose={onClose} labelledBy="task-details-title">
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full bg-sunken px-2.5 py-0.5 text-xs font-medium",
              STATUS_META[status].tone,
            )}
          >
            <StatusMark status={status} className="h-3.5 w-3.5" />
            {STATUS_META[status].label}
          </span>
          <PriorityBadge priority={task.priority} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="btn btn-ghost -mr-2 ml-auto h-8 w-8 p-0"
          >
            <X size={18} />
          </button>
        </div>

        <h2 id="task-details-title" className="break-words font-display text-2xl leading-tight">
          {task.title}
        </h2>

        {task.description ? (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-soft">{task.description}</p>
        ) : (
          <p className="text-sm italic text-faint">No notes on this one.</p>
        )}

        <dl className="grid grid-cols-2 gap-4 rounded-xl bg-sunken p-4 text-sm">
          <Meta label="Due">
            {task.dueDate && due ? (
              <>
                <span>{formatLong(task.dueDate)}</span>
                <span className={cn("block text-xs", late ? "text-berry" : "text-soft")}>{due.label}</span>
              </>
            ) : (
              <span className="text-soft">No deadline</span>
            )}
          </Meta>
          <Meta label="Created">{formatStamp(task.createdAt)}</Meta>
          {task.completedAt && <Meta label="Completed">{formatStamp(task.completedAt)}</Meta>}
        </dl>

        <div>
          <p className="mb-1.5 text-xs font-medium text-soft">Move to</p>
          <Segmented<Status>
            label="Move to column"
            value={status}
            onChange={onMove}
            options={STATUSES.map((s) => ({
              value: s,
              label: s === "in-progress" ? "Doing" : STATUS_META[s].label,
              icon: <StatusMark status={s} className={cn("h-3.5 w-3.5", STATUS_META[s].tone)} />,
            }))}
          />
        </div>

        <div className="flex items-center gap-2 border-t border-line pt-4">
          <button type="button" onClick={onDelete} className="btn btn-danger -ml-2">
            <Trash2 size={15} />
            Delete
          </button>
          <button type="button" onClick={onEdit} className="btn btn-primary ml-auto">
            <Pencil size={15} />
            Edit
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-faint">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}