import { Download, Eraser, HardDrive, Layers, Plus, RotateCcw, Tags, Trash2, Upload, X } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import { StatusMark } from "@/components/ui/StatusMark";
import { cn } from "@/lib/cn";
import { LABEL_COLOR_META, PRIORITIES, PRIORITY_META, STATUSES, STATUS_META } from "@/lib/constants";
import type { Filters, Label, Priority, Status } from "@/lib/types";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  counts: {
    total: number;
    status: Record<Status, number>;
    priority: Record<Priority, number>;
    label: Record<string, number>;
  };
  labels: Label[];
  onStatus: (status: Status | "all") => void;
  onPriority: (priority: Priority | "all") => void;
  onLabel: (id: string) => void;
  onManageLabels: () => void;
  onNew: () => void;
  onExport: () => void;
  onImport: () => void;
  onClearDone: () => void;
  onLoadSamples: () => void;
  onDeleteAll: () => void;
}

export function Sidebar({
  open,
  onClose,
  filters,
  counts,
  labels,
  onStatus,
  onPriority,
  onLabel,
  onManageLabels,
  onNew,
  onExport,
  onImport,
  onClearDone,
  onLoadSamples,
  onDeleteAll,
}: SidebarProps) {
  return (
    <aside
      aria-label="Sidebar"
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line bg-surface px-4 py-5 transition-[transform,visibility] duration-300 lg:visible lg:static lg:w-64 lg:shrink-0 lg:translate-x-0 lg:bg-surface/60",
        open ? "translate-x-0" : "invisible -translate-x-full",
      )}
    >
      <div className="flex items-center gap-3 px-1">
        <Logo className="h-9 w-9 shrink-0" />
        <div className="leading-tight">
          <p className="font-display text-2xl">Cairn</p>
          <p className="text-xs text-faint">Stack your day</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-ghost ml-auto h-8 w-8 p-0 lg:hidden"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <button type="button" onClick={onNew} className="btn btn-primary mt-6 w-full justify-between">
        <span className="inline-flex items-center gap-2">
          <Plus size={16} />
          New task
        </span>
        <span className="font-mono text-xs opacity-80">N</span>
      </button>

      <div className="-mr-2 mt-7 flex-1 space-y-7 overflow-y-auto pb-2 pr-2">
        <nav aria-label="Filters" className="space-y-7">
          <Section title="Board">
            <NavItem
              active={filters.status === "all"}
              onClick={() => onStatus("all")}
              icon={<Layers size={16} />}
              label="All tasks"
              count={counts.total}
            />
            {STATUSES.map((status) => (
              <NavItem
                key={status}
                active={filters.status === status}
                onClick={() => onStatus(status)}
                icon={<StatusMark status={status} className={cn("h-4 w-4", STATUS_META[status].tone)} />}
                label={STATUS_META[status].label}
                count={counts.status[status]}
              />
            ))}
          </Section>

          <Section title="Priority">
            <NavItem
              active={filters.priority === "all"}
              onClick={() => onPriority("all")}
              icon={<span className="h-2.5 w-2.5 rounded-full border border-faint" />}
              label="Any priority"
              count={counts.total}
            />
            {[...PRIORITIES].reverse().map((priority) => (
              <NavItem
                key={priority}
                active={filters.priority === priority}
                onClick={() => onPriority(priority)}
                icon={<span className={cn("h-2.5 w-2.5 rounded-full", PRIORITY_META[priority].dot)} />}
                label={PRIORITY_META[priority].label}
                count={counts.priority[priority]}
              />
            ))}
          </Section>

          <Section
            title="Labels"
            action={
              <button
                type="button"
                onClick={onManageLabels}
                className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] normal-case tracking-normal text-soft transition hover:bg-sunken hover:text-ink"
              >
                <Tags size={12} />
                Manage
              </button>
            }
          >
            {labels.length === 0 ? (
              <p className="px-3 py-1 text-[13px] text-faint">No labels yet.</p>
            ) : (
              labels.map((label) => (
                <NavItem
                  key={label.id}
                  active={filters.label === label.id}
                  onClick={() => onLabel(label.id)}
                  icon={<span className={cn("h-2.5 w-2.5 rounded-full", LABEL_COLOR_META[label.color].dot)} />}
                  label={label.name}
                  count={counts.label[label.id] ?? 0}
                />
              ))
            )}
          </Section>
        </nav>

        <Section title="Backup">
          <ActionButton icon={<Download size={15} />} label="Export backup" onClick={onExport} />
          <ActionButton icon={<Upload size={15} />} label="Import backup" onClick={onImport} />
        </Section>

        <Section title="Tidy up">
          <ActionButton
            icon={<Eraser size={15} />}
            label={`Clear done (${counts.status.done})`}
            onClick={onClearDone}
            disabled={counts.status.done === 0}
          />
          <ActionButton icon={<RotateCcw size={15} />} label="Load sample tasks" onClick={onLoadSamples} />
          <ActionButton icon={<Trash2 size={15} />} label="Delete everything" onClick={onDeleteAll} danger />
        </Section>
      </div>

      <p className="mt-3 flex items-center gap-2 border-t border-line px-3 pt-3 text-xs text-faint">
        <HardDrive size={13} />
        Saved on this device only
      </p>
    </aside>
  );
}

function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between px-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-faint">{title}</h2>
        {action}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function NavItem({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition",
        active ? "bg-sunken font-medium text-ink" : "text-soft hover:bg-sunken/70 hover:text-ink",
      )}
    >
      {active && <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-accent" />}
      <span className="flex h-4 w-4 items-center justify-center">{icon}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className="font-mono text-xs tabular-nums text-faint">{count}</span>
    </button>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  disabled,
  danger,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "btn btn-ghost w-full justify-start px-3 py-1.5 text-[13px]",
        danger && "hover:bg-berry/10 hover:text-berry",
      )}
    >
      {icon}
      {label}
    </button>
  );
}