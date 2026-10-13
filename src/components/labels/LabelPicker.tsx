import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { LABEL_COLOR_META, LABEL_NAME_MAX } from "@/lib/constants";
import type { Label, LabelColor } from "@/lib/types";
import { ColorSwatches } from "./ColorSwatches";

interface LabelPickerProps {
  labels: Label[];
  selected: string[];
  onChange: (ids: string[]) => void;
  onCreate: (name: string, color: LabelColor) => Label;
}

export function LabelPicker({ labels, selected, onChange, onCreate }: LabelPickerProps) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState<LabelColor>("clay");

  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);

  const create = () => {
    const clean = name.trim();
    if (!clean) return;
    const label = onCreate(clean, color);
    onChange(selected.includes(label.id) ? selected : [...selected, label.id]);
    setName("");
    setCreating(false);
  };

  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-soft">Labels</p>
      <div className="flex flex-wrap items-center gap-1.5">
        {labels.map((label) => {
          const on = selected.includes(label.id);
          const meta = LABEL_COLOR_META[label.color];
          return (
            <button
              key={label.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(label.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition",
                on ? cn("border-transparent font-medium", meta.chip) : "border-line text-soft hover:text-ink",
              )}
            >
              {on ? <Check size={12} /> : <span className={cn("h-2 w-2 rounded-full", meta.dot)} />}
              {label.name}
            </button>
          );
        })}

        {!creating && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-line px-2.5 py-1 text-xs text-soft transition hover:border-accent hover:text-accent"
          >
            <Plus size={12} />
            New label
          </button>
        )}
      </div>

      {creating && (
        <div className="mt-2 space-y-3 rounded-xl bg-sunken p-3">
          <input
            autoFocus
            value={name}
            maxLength={LABEL_NAME_MAX}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                create();
              } else if (e.key === "Escape") {
                e.preventDefault();
                setCreating(false);
              }
            }}
            placeholder="Label name"
            aria-label="New label name"
            className="field py-1.5"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <ColorSwatches value={color} onChange={setColor} />
            <div className="flex gap-2">
              <button type="button" onClick={() => setCreating(false)} className="btn btn-ghost px-3 py-1.5 text-xs">
                Cancel
              </button>
              <button type="button" onClick={create} disabled={!name.trim()} className="btn btn-primary px-3 py-1.5 text-xs">
                Add label
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}