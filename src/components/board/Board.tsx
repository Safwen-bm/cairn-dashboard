"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type Announcements,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useCallback, useState } from "react";
import { cn } from "@/lib/cn";
import { STATUSES, STATUS_META } from "@/lib/constants";
import { matchesFilters } from "@/lib/filters";
import type { Columns, Filters, Status, Task } from "@/lib/types";
import { Column } from "./Column";
import { TaskCardBody } from "./TaskCard";

interface BoardProps {
  columns: Columns;
  tasks: Record<string, Task>;
  statuses: readonly Status[];
  filters: Filters;
  filtered: boolean;
  today: string;
  onColumnsChange: (columns: Columns) => void;
  onAdd: (status: Status) => void;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const isStatus = (id: UniqueIdentifier): id is Status => STATUSES.includes(id as Status);

function containerOf(id: UniqueIdentifier, columns: Columns): Status | null {
  if (isStatus(id)) return id;
  return STATUSES.find((status) => columns[status].includes(String(id))) ?? null;
}

function sameColumns(a: Columns, b: Columns): boolean {
  return STATUSES.every((s) => a[s].length === b[s].length && a[s].every((id, i) => id === b[s][i]));
}

export function Board(props: BoardProps) {
  const { tasks, statuses, filters, filtered, today } = props;

  const [activeId, setActiveId] = useState<string | null>(null);
  // While dragging, cards move between columns in this local copy. It is committed on drop.
  const [draft, setDraft] = useState<Columns | null>(null);
  const columns = draft ?? props.columns;

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      keyboardCodes: { start: ["Space"], cancel: ["Escape"], end: ["Space"] },
    }),
  );

  const collisionDetection = useCallback<CollisionDetection>(
    (args) => {
      const pointerHits = pointerWithin(args);
      const hits = pointerHits.length > 0 ? pointerHits : rectIntersection(args);
      let overId = getFirstCollision(hits, "id");
      if (overId == null) return [];

      // Over a column: resolve to the nearest card inside it, so insertion order feels right.
      if (isStatus(overId)) {
        const items = columns[overId];
        if (items.length > 0) {
          const closest = closestCenter({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (c) => c.id !== overId && items.includes(String(c.id)),
            ),
          });
          if (closest.length > 0) overId = closest[0].id;
        }
      }
      return [{ id: overId }];
    },
    [columns],
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(String(active.id));
    setDraft(props.columns);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    setDraft((previous) => {
      const current = previous ?? props.columns;
      const activeKey = String(active.id);
      const from = containerOf(active.id, current);
      const to = containerOf(over.id, current);
      if (!from || !to || from === to) return previous;

      const target = current[to];
      let index: number;
      if (isStatus(over.id)) {
        index = target.length;
      } else {
        const overIndex = target.indexOf(String(over.id));
        const translated = active.rect.current.translated;
        const below = translated ? translated.top > over.rect.top + over.rect.height : false;
        index = overIndex + (below ? 1 : 0);
      }

      return {
        ...current,
        [from]: current[from].filter((id) => id !== activeKey),
        [to]: [...target.slice(0, index), activeKey, ...target.slice(index)],
      };
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const current = draft ?? props.columns;
    let next = current;

    if (over) {
      const from = containerOf(active.id, current);
      const to = containerOf(over.id, current);
      if (from && to && from === to) {
        const oldIndex = current[to].indexOf(String(active.id));
        const newIndex = isStatus(over.id) ? current[to].length - 1 : current[to].indexOf(String(over.id));
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          next = { ...current, [to]: arrayMove(current[to], oldIndex, newIndex) };
        }
      }
    }

    setActiveId(null);
    setDraft(null);
    if (!sameColumns(next, props.columns)) props.onColumnsChange(next);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setDraft(null);
  };

  const titleOf = (id: UniqueIdentifier) => tasks[String(id)]?.title ?? "task";
  const placeOf = (id: UniqueIdentifier) => {
    const status = containerOf(id, columns);
    return status ? STATUS_META[status].label : "the board";
  };
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${titleOf(active.id)}.`,
    onDragOver: ({ active, over }) => (over ? `${titleOf(active.id)} is over ${placeOf(over.id)}.` : undefined),
    onDragEnd: ({ active, over }) =>
      over ? `Dropped ${titleOf(active.id)} in ${placeOf(over.id)}.` : `Dropped ${titleOf(active.id)}.`,
    onDragCancel: ({ active }) => `Cancelled. ${titleOf(active.id)} went back.`,
  };

  const activeTask = activeId ? tasks[activeId] : undefined;
  const activeStatus = activeId ? containerOf(activeId, columns) : null;

  return (
    <DndContext
      id="board"
      sensors={sensors}
      collisionDetection={collisionDetection}
      accessibility={{ announcements }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div
        className={cn(
          "-mx-4 flex snap-x snap-proximity gap-3 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8",
          "lg:mx-0 lg:grid lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0",
          statuses.length === 1 ? "lg:max-w-xl lg:grid-cols-1" : "lg:grid-cols-3",
        )}
      >
        {statuses.map((status) => {
          const ids = columns[status].filter((id) => {
            const task = tasks[id];
            return task ? matchesFilters(task, filters, today) : false;
          });
          return (
            <Column
              key={status}
              status={status}
              ids={ids}
              total={columns[status].length}
              tasks={tasks}
              today={today}
              highlight={activeId !== null && activeStatus === status}
              filtered={filtered}
              onAdd={() => props.onAdd(status)}
              onOpen={props.onOpen}
              onEdit={props.onEdit}
              onDelete={props.onDelete}
              onToggle={props.onToggle}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeTask && activeStatus ? (
          <TaskCardBody task={activeTask} status={activeStatus} today={today} overlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}