"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Built on the native <dialog>: focus trapping, Escape and the backdrop come for free.
 * Mount it to open it, unmount it to close it.
 */
export function Modal({
  onClose,
  labelledBy,
  size = "md",
  children,
}: {
  onClose: () => void;
  labelledBy: string;
  size?: "sm" | "md";
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const pressedBackdrop = useRef(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previous = document.activeElement as HTMLElement | null;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    return () => {
      previous?.focus?.();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onMouseDown={(e) => {
        pressedBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (pressedBackdrop.current && e.target === e.currentTarget) onClose();
      }}
      className={cn(
        "m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] overflow-y-auto rounded-2xl border border-line bg-surface p-0 text-ink shadow-lift open:animate-pop backdrop:bg-[rgb(20_16_12/0.55)]",
        size === "md" ? "max-w-lg" : "max-w-sm",
      )}
    >
      {children}
    </dialog>
  );
}