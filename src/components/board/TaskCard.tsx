import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, ListChecks, Pencil, Trash2 } from "lucide-react";
import { LabelChip } from "@/components/labels/LabelChip";
import { useLabelMap } from "@/components/labels/LabelsContext";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { StatusMark } from "@/components/ui/StatusMark";
import { cn } from "@/lib/cn";
import { PRIORITY_META, STATUS_META } from "@/lib/constants";
import { dueInfo, isOverdue } from "@/lib/dates";
import type { Label, Status, Task } from "@/lib/types";

const MAX_VISIBLE_LABELS = 3;

interface BodyProps {
  task: Task;
  status: Status;
  today: string;
  overlay?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggle?: () => void;
}

/** Pure visual card. Used by the sortable wrapper and by the drag overlay. */
export function TaskCardBody({ task, status, today, overlay, onEdit, onDelete, onToggle }: BodyProps) {
  const labelMap = useLabelMap();
  const labels = task.labelIds.map((id) => labelMap[id]).filter((l): l is Label => Boolean(l));

  const done = status === "done";
  const due = task.dueDate ? dueInfo(task.dueDate, today) : null;
  const late = isOverdue(task, today);

  const totalSubs = task.subtasks.length;
  const doneSubs = task.subtasks.filter((s) => s.done).length;

  const dueTone = done
    ? "bg-sunken text-faint"
    : late
      ? "bg-berry/10 text-berry"
      : due?.tone === "today"
        ? "bg-accent/10 text-accent"
        : "bg-sunken text-soft";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl border border-line bg-surface p-3.5 pl-5 shadow-card transition-shadow hover:shadow-lift",
        overlay && "rotate-2 shadow-lift ring-1 ring-accent/30",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("absolute inset-y-0 left-0 w-1.5", PRIORITY_META[task.priority].bar, done && "opacity-40")}
      />

      <div className="flex items-start gap-2.5">
        <button
          type="button"
          aria-label={done ? "Move back to To do" : "Mark as done"}
          title={done ? "Move back to To do" : "Mark as done"}
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
          className={cn("mt-0.5 shrink-0 rounded-full transition hover:scale-110", STATUS_META[status].tone)}
        >
          <StatusMark status={status} className="h-[18px] w-[18px]" />
        </button>

        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "break-words text-[15px] font-medium leading-snug",
              done && "text-soft line-through decoration-faint",
            )}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-soft">{task.description}</p>
          )}
        </div>
      </div>

      {(labels.length > 0 || totalSubs > 0) && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pl-7">
          {labels.slice(0, MAX_VISIBLE_LABELS).map((label) => (
            <LabelChip key={label.id} label={label} />
          ))}
          {labels.length > MAX_VISIBLE_LABELS && (
            <span className="text-[11px] text-faint">+{labels.length - MAX_VISIBLE_LABELS}</span>
          )}
          {totalSubs > 0 && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[11px] font-medium",
                doneSubs === totalSubs ? "text-moss" : "text-soft",
              )}
              title={`${doneSubs} of ${totalSubs} subtasks done`}
            >
              <ListChecks size={13} />
              {doneSubs}/{totalSubs}
              <span className="ml-0.5 h-1 w-8 overflow-hidden rounded-full bg-sunken" aria-hidden="true">
                <span
                  className="block h-full bg-moss"
                  style={{ width: `${(doneSubs / totalSubs) * 100}%` }}
                />
              </span>
            </span>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2 pl-7">
        <PriorityBadge priority={task.priority} />
        {due && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
              dueTone,
            )}
          >
            <CalendarDays size={12} />
            {due.label}
          </span>
        )}

        {!overlay && (
          <div className="ml-auto flex items-center opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
            <button
              type="button"
              aria-label="Edit task"
              title="Edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="rounded-md p-1.5 text-faint transition hover:bg-sunken hover:text-ink"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              aria-label="Delete task"
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="rounded-md p-1.5 text-faint transition hover:bg-berry/10 hover:text-berry"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

interface SortableProps {
  task: Task;
  status: Status;
  today: string;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function SortableTaskCard({ task, status, today, onOpen, onEdit, onDelete, onToggle }: SortableProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(task.id)}
      onKeyDown={(e) => {
        listeners?.onKeyDown?.(e);
        if (e.key === "Enter" && e.target === e.currentTarget) onOpen(task.id);
      }}
      className={cn(
        "cursor-grab touch-manipulation rounded-xl active:cursor-grabbing",
        isDragging && "opacity-30",
      )}
    >
      <TaskCardBody
        task={task}
        status={status}
        today={today}
        onEdit={() => onEdit(task.id)}
        onDelete={() => onDelete(task.id)}
        onToggle={() => onToggle(task.id)}
      />
    </div>
  );
}