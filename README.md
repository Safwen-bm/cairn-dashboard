# Cairn

A calm Kanban board that lives in your browser. Stack your tasks, drag them across, finish them.

## Features

- Three columns: To do, In progress, Done
- Add, edit, view and delete tasks with priority and due date
- Drag and drop between columns and reorder inside them (@dnd-kit), mouse, touch and keyboard
- Everything saved in localStorage, no backend, no account
- Search by title, filter by status and priority, overdue filter
- Live stats: total, completed, overdue, due today
- Light and dark themes, responsive layout

## Shortcuts

| Key | Action |
| --- | --- |
| `N` | New task |
| `/` or `Ctrl+K` | Focus search |
| `Space` on a focused card | Pick up / drop with the keyboard |
| `Enter` on a focused card | Open details |

## Stack

Next.js 15, React 19, TypeScript, Tailwind CSS 3, @dnd-kit, lucide-react

## Run it

```bash
npm install
npm run dev
```