import { X } from "lucide-react";

export interface ToastData {
  message: string;
  action?: { label: string; run: () => void };
}

export function Toast({ message, action, onDismiss }: ToastData & { onDismiss: () => void }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
    >
      <div className="pointer-events-auto flex animate-pop items-center gap-3 rounded-xl bg-ink px-4 py-2.5 text-sm text-paper shadow-lift">
        <span>{message}</span>
        {action && (
          <button
            type="button"
            onClick={() => {
              action.run();
              onDismiss();
            }}
            className="font-semibold underline underline-offset-4"
          >
            {action.label}
          </button>
        )}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="-mr-1 rounded p-1 opacity-70 hover:opacity-100"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}