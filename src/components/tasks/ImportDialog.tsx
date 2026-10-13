import { Modal } from "@/components/ui/Modal";
import type { BoardState } from "@/lib/types";

interface ImportDialogProps {
  board: BoardState;
  fileName: string;
  onMerge: () => void;
  onReplace: () => void;
  onClose: () => void;
}

export function ImportDialog({ board, fileName, onMerge, onReplace, onClose }: ImportDialogProps) {
  return (
    <Modal onClose={onClose} labelledBy="import-title" size="sm">
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div>
          <h2 id="import-title" className="font-display text-xl">
            Import this backup?
          </h2>
          <p className="mt-1 break-all font-mono text-xs text-faint">{fileName}</p>
        </div>

        <dl className="grid grid-cols-3 gap-3 rounded-xl bg-sunken p-4 text-center">
          <Count label="Tasks" value={Object.keys(board.tasks).length} />
          <Count label="Done" value={board.columns.done.length} />
          <Count label="Labels" value={board.labels.length} />
        </dl>

        <p className="text-sm leading-relaxed text-soft">
          Merge adds these tasks next to yours, and re-uses labels with the same name. Replace swaps your whole board
          for the backup. You get an Undo for a few seconds either way.
        </p>

        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <button type="button" data-autofocus onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button type="button" onClick={onMerge} className="btn btn-soft">
            Merge
          </button>
          <button type="button" onClick={onReplace} className="btn bg-berry text-accent-fg hover:brightness-110">
            Replace board
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Count({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dd className="font-display text-3xl leading-none tabular-nums">{value}</dd>
      <dt className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-faint">{label}</dt>
    </div>
  );
}