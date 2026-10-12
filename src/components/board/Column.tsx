import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { StatusMark } from "@/components/ui/StatusMark";
import { cn } from "@/lib/cn";
import { STATUS_META } from "@/lib/constants";
import type { Status, Task } from "@/lib/types";
import { SortableTaskCard } from "./TaskCard";

interface ColumnProps {
  status: Status;
  /** Ids that pass the current filters, in order */
  ids: string[];
  /** Everything in this column, filtered or not */
  total: number;
  tasks: Record<string, Task>;
  today: string;
  highlight: boolean;
  filtered: boolean;
  onAdd: () => void;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function Column({
  status,
  ids,
  total,
  tasks,
  today,
  highlight,
  filtered,
  onAdd,
  onOpen,
  onEdit,
  onDelete,
  onToggle,
}: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });
  const meta = STATUS_META[status];

  return (
    <section
      ref={setNodeRef}
      aria-label={meta.label}
      className={cn(
        "flex min-h-[20rem] w-[84vw] max-w-sm shrink-0 snap-start flex-col rounded-2xl p-2.5 transition-colors lg:w-auto lg:max-w-none",
        highlight ? "bg-accent/10 ring-2 ring-accent/30" : "bg-sunken",
      )}
    >
      <header className="flex items-center gap-2 px-2 pb-3 pt-1.5">
        <StatusMark status={status} className={cn("h-4 w-4", meta.tone)} />
        <h2 className="font-display text-lg leading-none">{meta.label}</h2>
        <span className="rounded-full bg-line/60 px-2 py-0.5 font-mono text-[11px] text-soft">
          {filtered ? `${ids.length}/${total}` : total}
        </span>
        <button
          type="button"
          onClick={onAdd}
          aria-label={`Add task to ${meta.label}`}
          title={`Add to ${meta.label}`}
          className="btn btn-ghost ml-auto h-7 w-7 p-0"
        >
          <Plus size={16} />
        </button>
      </header>

      <SortableContext id={status} items={ids} strategy={verticalListSortingStrategy}>
        <div className="flex flex-1 flex-col gap-2.5">
          {ids.map((id) => {
            const task = tasks[id];
            return task ? (
              <SortableTaskCard
                key={id}
                task={task}
                status={status}
                today={today}
                onOpen={onOpen}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggle={onToggle}
              />
            ) : null;
          })}

          {ids.length === 0 && (
            <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-line px-4 py-8 text-center text-sm text-soft">
              {total === 0 ? meta.empty : "No tasks here match your filters."}
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  );
}