import { Pencil, Trash2, X } from "lucide-react";
import type { ReactNode } from "react";
import { LabelChip } from "@/components/labels/LabelChip";
import { useLabelMap } from "@/components/labels/LabelsContext";
import { Modal } from "@/components/ui/Modal";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { Segmented } from "@/components/ui/Segmented";
import { StatusMark } from "@/components/ui/StatusMark";
import { cn } from "@/lib/cn";
import { STATUSES, STATUS_META } from "@/lib/constants";
import { dueInfo, formatLong, formatStamp, isOverdue } from "@/lib/dates";
import type { Label, Status, Task } from "@/lib/types";
import { SubtaskCheck } from "./SubtaskCheck";

interface TaskDetailsProps {
  task: Task;
  status: Status;
  today: string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (status: Status) => void;
  onToggleSubtask: (subtaskId: string) => void;
}

export function TaskDetails({
  task,
  status,
  today,
  onClose,
  onEdit,
  onDelete,
  onMove,
  onToggleSubtask,
}: TaskDetailsProps) {
  const labelMap = useLabelMap();
  const labels = task.labelIds.map((id) => labelMap[id]).filter((l): l is Label => Boolean(l));
  const due = task.dueDate ? dueInfo(task.dueDate, today) : null;
  const late = isOverdue(task, today);

  const totalSubs = task.subtasks.length;
  const doneSubs = task.subtasks.filter((s) => s.done).length;
  const allSubsDone = totalSubs > 0 && doneSubs === totalSubs;

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

        {labels.length > 0 && (
          <div className="-mt-2 flex flex-wrap gap-1.5">
            {labels.map((label) => (
              <LabelChip key={label.id} label={label} className="text-xs" />
            ))}
          </div>
        )}

        {task.description ? (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-soft">{task.description}</p>
        ) : (
          <p className="text-sm italic text-faint">No notes on this one.</p>
        )}

        {totalSubs > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-soft">Subtasks</span>
              <span className="font-mono text-faint">
                {doneSubs}/{totalSubs}
              </span>
            </div>
            <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-sunken">
              <div
                className="h-full bg-moss transition-all duration-300"
                style={{ width: `${(doneSubs / totalSubs) * 100}%` }}
              />
            </div>
            <ul className="space-y-0.5">
              {task.subtasks.map((subtask) => (
                <li key={subtask.id}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={subtask.done}
                    onClick={() => onToggleSubtask(subtask.id)}
                    className="flex w-full items-start gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition hover:bg-sunken"
                  >
                    <SubtaskCheck checked={subtask.done} className="mt-0.5" />
                    <span className={cn("min-w-0 break-words", subtask.done && "text-faint line-through")}>
                      {subtask.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {allSubsDone && status !== "done" && (
              <button type="button" onClick={() => onMove("done")} className="btn btn-soft mt-3 w-full text-moss">
                All subtasks done. Move to Done
              </button>
            )}
          </div>
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