import { cn } from "@/lib/cn";
import type { computeStats } from "@/lib/stats";

type Stats = ReturnType<typeof computeStats>;

export function StatsBar({
  stats,
  overdueActive,
  onToggleOverdue,
}: {
  stats: Stats;
  overdueActive: boolean;
  onToggleOverdue: () => void;
}) {
  const { total, todo, doing, done, overdue, dueToday, pct } = stats;
  const share = (n: number) => (total === 0 ? 0 : (n / total) * 100);

  return (
    <section aria-label="Statistics" className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="flex h-1.5 bg-sunken" aria-hidden="true">
        <div className="bg-moss transition-all duration-500" style={{ width: `${share(done)}%` }} />
        <div className="bg-accent transition-all duration-500" style={{ width: `${share(doing)}%` }} />
      </div>

      <div className="grid grid-cols-2 gap-px bg-line md:grid-cols-4">
        <Stat label="Total tasks" value={total} caption={`${todo} to do, ${doing} in progress`} />
        <Stat label="Completed" value={done} caption={`${pct}% of everything`} valueClass="text-moss" />

        <button
          type="button"
          onClick={onToggleOverdue}
          aria-pressed={overdueActive}
          disabled={overdue === 0 && !overdueActive}
          className={cn(
            "bg-surface p-4 text-left transition enabled:hover:bg-sunken/60 disabled:cursor-default",
            overdueActive && "bg-berry/10 enabled:hover:bg-berry/10",
          )}
        >
          <StatBody
            label="Overdue"
            value={overdue}
            valueClass={overdue > 0 ? "text-berry" : undefined}
            caption={overdueActive ? "Showing only these" : overdue > 0 ? "Click to filter" : "All caught up"}
          />
        </button>

        <Stat
          label="Due today"
          value={dueToday}
          caption={dueToday === 0 ? "Nothing pressing" : "On the clock"}
          valueClass={dueToday > 0 ? "text-accent" : undefined}
        />
      </div>
    </section>
  );
}

function Stat(props: { label: string; value: number; caption: string; valueClass?: string }) {
  return (
    <div className="bg-surface p-4">
      <StatBody {...props} />
    </div>
  );
}

function StatBody({
  label,
  value,
  caption,
  valueClass,
}: {
  label: string;
  value: number;
  caption: string;
  valueClass?: string;
}) {
  return (
    <>
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-faint">{label}</p>
      <p className={cn("mt-1 font-display text-4xl leading-none tabular-nums", valueClass)}>{value}</p>
      <p className="mt-2 text-xs text-soft">{caption}</p>
    </>
  );
}