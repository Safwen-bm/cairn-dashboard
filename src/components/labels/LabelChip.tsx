import { cn } from "@/lib/cn";
import { LABEL_COLOR_META } from "@/lib/constants";
import type { Label } from "@/lib/types";

export function LabelChip({ label, className }: { label: Label; className?: string }) {
  const meta = LABEL_COLOR_META[label.color];
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
        meta.chip,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", meta.dot)} />
      <span className="truncate">{label.name}</span>
    </span>
  );
}