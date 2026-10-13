import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/** Visual checkbox only. Wrap it in a button that carries role="checkbox". */
export function SubtaskCheck({ checked, className }: { checked: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition",
        checked ? "border-moss bg-moss text-accent-fg" : "border-faint bg-surface",
        className,
      )}
    >
      {checked && <Check size={12} strokeWidth={3} />}
    </span>
  );
}