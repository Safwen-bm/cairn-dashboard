import { Trash2, X } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import { LABEL_COLOR_META, LABEL_NAME_MAX } from "@/lib/constants";
import type { Label, LabelColor } from "@/lib/types";
import { ColorSwatches } from "./ColorSwatches";

interface LabelsDialogProps {
  labels: Label[];
  counts: Record<string, number>;
  onAdd: (name: string, color: LabelColor) => void;
  onUpdate: (id: string, patch: { name?: string; color?: LabelColor }) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function LabelsDialog({ labels, counts, onAdd, onUpdate, onDelete, onClose }: LabelsDialogProps) {
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState<LabelColor>("clay");
  const [error, setError] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const exists = (name: string, exceptId?: string) =>
    labels.some((l) => l.id !== exceptId && l.name.toLowerCase() === name.toLowerCase());

  const add = () => {
    const clean = newName.trim();
    if (!clean) return;
    if (exists(clean)) {
      setError(`"${clean}" already exists.`);
      return;
    }
    setError("");
    onAdd(clean, newColor);
    setNewName("");
  };

  const rename = (label: Label, input: HTMLInputElement) => {
    const clean = input.value.trim();
    if (clean === label.name) return;
    if (!clean) {
      input.value = label.name;
      return;
    }
    if (exists(clean, label.id)) {
      setError(`"${clean}" already exists.`);
      input.value = label.name;
      return;
    }
    setError("");
    onUpdate(label.id, { name: clean });
  };

  return (
    <Modal onClose={onClose} labelledBy="labels-title">
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div>
            <h2 id="labels-title" className="font-display text-2xl leading-tight">
              Labels
            </h2>
            <p className="mt-1 text-sm text-soft">Rename, recolor or remove them. Changes apply to every task.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="btn btn-ghost -mr-2 ml-auto h-8 w-8 shrink-0 p-0">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 rounded-xl bg-sunken p-3">
          <input
            data-autofocus
            value={newName}
            maxLength={LABEL_NAME_MAX}
            onChange={(e) => {
              setNewName(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            placeholder="New label name"
            aria-label="New label name"
            className="field py-1.5"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <ColorSwatches value={newColor} onChange={setNewColor} />
            <button type="button" onClick={add} disabled={!newName.trim()} className="btn btn-primary px-3 py-1.5 text-xs">
              Add label
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="-mt-2 text-sm text-berry">
            {error}
          </p>
        )}

        {labels.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-soft">
            No labels yet. Create one above, then attach it to tasks.
          </p>
        ) : (
          <ul className="space-y-2">
            {labels.map((label) => {
              const used = counts[label.id] ?? 0;
              return (
                <li key={label.id} className="rounded-xl border border-line p-3">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-3 w-3 shrink-0 rounded-full", LABEL_COLOR_META[label.color].dot)} />
                    <input
                      key={label.id}
                      defaultValue={label.name}
                      maxLength={LABEL_NAME_MAX}
                      aria-label={`Rename label ${label.name}`}
                      onBlur={(e) => rename(label, e.currentTarget)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.currentTarget.blur();
                      }}
                      className="field py-1.5"
                    />
                    <button
                      type="button"
                      aria-label={`Delete label ${label.name}`}
                      onClick={() => setConfirmingId(label.id)}
                      className="btn btn-danger h-8 w-8 shrink-0 p-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <ColorSwatches value={label.color} onChange={(color) => onUpdate(label.id, { color })} />
                    <span className="text-xs text-faint">
                      {used} {used === 1 ? "task" : "tasks"}
                    </span>
                  </div>

                  {confirmingId === label.id && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-berry/10 px-3 py-2 text-sm">
                      <span className="mr-auto text-berry">
                        Delete this label{used > 0 ? ` and remove it from ${used} ${used === 1 ? "task" : "tasks"}` : ""}?
                      </span>
                      <button type="button" onClick={() => setConfirmingId(null)} className="btn btn-ghost px-3 py-1 text-xs">
                        Keep
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onDelete(label.id);
                          setConfirmingId(null);
                        }}
                        className="btn bg-berry px-3 py-1 text-xs text-accent-fg hover:brightness-110"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex justify-end border-t border-line pt-4">
          <button type="button" onClick={onClose} className="btn btn-primary">
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
}