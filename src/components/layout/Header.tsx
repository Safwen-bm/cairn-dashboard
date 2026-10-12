import { Menu, Plus, Search, X } from "lucide-react";
import type { RefObject } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  greeting: string;
  subtitle: string;
  query: string;
  onQuery: (value: string) => void;
  searchRef: RefObject<HTMLInputElement | null>;
  onNew: () => void;
  onMenu: () => void;
}

export function Header({ greeting, subtitle, query, onQuery, searchRef, onNew, onMenu }: HeaderProps) {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-3 gap-y-3 px-4 py-4 md:px-8">
        <button
          type="button"
          onClick={onMenu}
          className="btn btn-ghost -ml-2 h-9 w-9 p-0 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-2xl leading-tight tracking-tight md:text-3xl">
            {greeting}
          </h1>
          <p className="truncate text-sm text-soft">{subtitle}</p>
        </div>

        <div className="relative order-last w-full md:order-none md:w-72">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                onQuery("");
                e.currentTarget.blur();
              }
            }}
            placeholder="Search tasks"
            aria-label="Search tasks"
            className="field appearance-none pl-9 pr-16 [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                onQuery("");
                searchRef.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-faint hover:text-ink"
            >
              <X size={14} />
            </button>
          ) : (
            <span className="kbd absolute right-2 top-1/2 -translate-y-1/2">/</span>
          )}
        </div>

        <ThemeToggle />

        <button type="button" onClick={onNew} className="btn btn-primary" title="New task (N)">
          <Plus size={16} />
          <span className="hidden sm:inline">New task</span>
        </button>
      </div>
    </header>
  );
}