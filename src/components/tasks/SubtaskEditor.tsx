import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { MAX_SUBTASKS } from "@/lib/constants";
import { uid } from "@/lib/ids";
import type { Subtask } from "@/lib/types";
import { SubtaskCheck } from "./SubtaskCheck";

export function SubtaskEditor({
  subtasks,
  onChange,
}: {
  subtasks: Subtask[];
  onChange: (subtasks: Subtask[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const addRef = useRef<HTMLInputElement>(null);
  const done = subtasks.filter((s) => s.done).length;
  const full = subtasks.length >= MAX_SUBTASKS;

  const add = () => {
    const title = draft.trim();
    if (!title || full) return;
    onChange([...subtasks, { id: uid(), title, done: false }]);
    setDraft("");
  };

  const patch = (id: string, change: Partial<Subtask>) =>
    onChange(subtasks.map((s) => (s.id === id ? { ...s, ...change } : s)));

  const remove = (id: string) => onChange(subtasks.filter((s) => s.id !== id));

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-xs font-medium text-soft">Subtasks</p>
        {subtasks.length > 0 && (
          <span className="font-mono text-xs text-faint">
            {done}/{subtasks.length}
          </span>
        )}
      </div>

      {subtasks.length > 0 && (
        <ul className="mb-2 space-y-1">
          {subtasks.map((subtask) => (
            <li key={subtask.id} className="flex items-center gap-1">
              <button
                type="button"
                role="checkbox"
                aria-checked={subtask.done}
                aria-label={`Mark "${subtask.title}" as ${subtask.done ? "not done" : "done"}`}
                onClick={() => patch(subtask.id, { done: !subtask.done })}
                className="flex h-8 w-7 shrink-0 items-center justify-center"
              >
                <SubtaskCheck checked={subtask.done} />
              </button>
              <input
                value={subtask.title}
                maxLength={120}
                aria-label="Subtask title"
                onChange={(e) => patch(subtask.id, { title: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addRef.current?.focus();
                  }
                }}
                className={cn(
                  "min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm hover:border-line focus:border-accent focus:outline-none",
                  subtask.done && "text-faint line-through",
                )}
              />
              <button
                type="button"
                aria-label={`Remove subtask ${subtask.title}`}
                onClick={() => remove(subtask.id)}
                className="rounded-md p-1.5 text-faint transition hover:bg-berry/10 hover:text-berry"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {full ? (
        <p className="text-xs text-faint">Subtask limit reached ({MAX_SUBTASKS}).</p>
      ) : (
        <div className="flex items-center gap-2">
          <Plus size={14} className="ml-2 shrink-0 text-faint" />
          <input
            ref={addRef}
            value={draft}
            maxLength={120}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            placeholder="Add a subtask, press Enter"
            aria-label="New subtask"
            className="field py-1.5"
          />
        </div>
      )}
    </div>
  );
}