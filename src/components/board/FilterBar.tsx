import { X } from "lucide-react";
import { PRIORITY_META, STATUS_META } from "@/lib/constants";
import { hasActiveFilters } from "@/lib/filters";
import type { Filters } from "@/lib/types";

export function FilterBar({
  filters,
  shown,
  total,
  onChange,
  onClear,
}: {
  filters: Filters;
  shown: number;
  total: number;
  onChange: (patch: Partial<Filters>) => void;
  onClear: () => void;
}) {
  if (!hasActiveFilters(filters)) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-mono text-xs text-soft">
        {shown} of {total} shown
      </span>
      {filters.query.trim() && <Chip label={`Search: "${filters.query.trim()}"`} onRemove={() => onChange({ query: "" })} />}
      {filters.status !== "all" && (
        <Chip label={`Status: ${STATUS_META[filters.status].label}`} onRemove={() => onChange({ status: "all" })} />
      )}
      {filters.priority !== "all" && (
        <Chip label={`Priority: ${PRIORITY_META[filters.priority].label}`} onRemove={() => onChange({ priority: "all" })} />
      )}
      {filters.overdueOnly && <Chip label="Overdue only" onRemove={() => onChange({ overdueOnly: false })} />}
      <button type="button" onClick={onClear} className="px-2 text-xs text-accent underline-offset-4 hover:underline">
        Clear all
      </button>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove filter: ${label}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface py-1 pl-3 pr-2 text-xs text-soft transition hover:text-ink"
    >
      {label}
      <X size={12} />
    </button>
  );
}