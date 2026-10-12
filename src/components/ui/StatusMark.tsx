import type { Status } from "@/lib/types";

/** Empty circle, half circle, check circle. Color comes from the parent text color. */
export function StatusMark({ status, className }: { status: Status; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {status === "in-progress" && <path d="M8 1.75a6.25 6.25 0 0 1 0 12.5z" fill="currentColor" />}
      {status === "done" && (
        <>
          <circle cx="8" cy="8" r="6.25" fill="currentColor" />
          <path
            d="M5.2 8.2l2 2 3.6-4"
            fill="none"
            stroke="rgb(var(--surface))"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}