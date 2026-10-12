import { Modal } from "@/components/ui/Modal";

export function ConfirmDialog({
  title,
  body,
  action,
  onConfirm,
  onClose,
}: {
  title: string;
  body: string;
  action: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose} labelledBy="confirm-title" size="sm">
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <h2 id="confirm-title" className="font-display text-xl">
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-soft">{body}</p>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" data-autofocus onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="btn bg-berry text-accent-fg hover:brightness-110"
          >
            {action}
          </button>
        </div>
      </div>
    </Modal>
  );
}