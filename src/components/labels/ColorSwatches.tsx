import { cn } from "@/lib/cn";
import { LABEL_COLORS, LABEL_COLOR_META } from "@/lib/constants";
import type { LabelColor } from "@/lib/types";

export function ColorSwatches({
  value,
  onChange,
}: {
  value: LabelColor;
  onChange: (color: LabelColor) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Label color" className="flex items-center gap-2">
      {LABEL_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          role="radio"
          aria-checked={value === color}
          aria-label={LABEL_COLOR_META[color].name}
          title={LABEL_COLOR_META[color].name}
          onClick={() => onChange(color)}
          className={cn(
            "h-5 w-5 rounded-full transition",
            LABEL_COLOR_META[color].dot,
            value === color ? "ring-2 ring-ink ring-offset-2 ring-offset-surface" : "opacity-60 hover:opacity-100",
          )}
        />
      ))}
    </div>
  );
}