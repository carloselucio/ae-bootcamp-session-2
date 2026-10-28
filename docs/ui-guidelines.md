# UI Guidelines

## Introduction

This document defines the core UI/UX guidelines for the TODO application. The goal is a clean, minimalist, modern interface that feels effortless to use while clearly surfacing task status, priority, and progress.

## Design Principles

- **Clarity over decoration**: Every visual element should communicate information (status, priority, due date) — avoid purely decorative clutter.
- **Minimalism**: Favor whitespace, simple shapes, and a limited set of UI components over dense, busy layouts.
- **Consistency**: Reuse the same spacing scale, typography, and color tokens across all components.
- **Fast feedback**: Actions (complete, edit, delete, filter) must give immediate visual feedback (e.g., subtle transitions, state changes).
- **Accessibility first**: Sufficient color contrast, keyboard navigability, and clear focus states are non-negotiable.

## Color Palette

Use a modern, muted palette with a single accent color for primary actions and status colors reserved for meaning (not decoration).

| Role | Color | Usage |
|---|---|---|
| Background | `#F8F9FB` (light) / `#121417` (dark) | Page background |
| Surface | `#FFFFFF` (light) / `#1C1F24` (dark) | Cards, task rows, modals |
| Primary / Accent | `#4F46E5` (indigo) | Primary buttons, links, focus rings |
| Text Primary | `#111827` (light) / `#F3F4F6` (dark) | Headings, task titles |
| Text Secondary | `#6B7280` | Notes, metadata, timestamps |
| Success | `#10B981` | Completed state, success messages |
| Warning | `#F59E0B` | Due today / upcoming |
| Danger | `#EF4444` | Overdue, destructive actions (delete) |
| Border / Divider | `#E5E7EB` (light) / `#2A2E35` (dark) | Dividers, input borders |

- Support light and dark mode using the same semantic tokens above.
- Priority levels should use color sparingly as an accent (e.g., a small dot or left border), not full-row background fills:
  - Low: `#6B7280` (neutral gray)
  - Medium: `#F59E0B` (amber)
  - High: `#EF4444` (red)

## Typography

- Use a single modern sans-serif font family (e.g., system font stack: `-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`).
- Limit to 3 font sizes for most views: heading, body, and caption/meta text.
- Task titles should be visually dominant; metadata (due date, priority, notes preview) should be smaller and muted (Text Secondary color).
- Use medium/semibold weight for emphasis instead of introducing new colors.

## Layout & Spacing

- Use a consistent spacing scale (e.g., 4px base unit: 4, 8, 12, 16, 24, 32).
- Keep the task list single-column and centered with a comfortable max-width (e.g., 640–720px) on larger screens.
- Progress indicator and filter/sort controls should sit in a sticky header above the task list so they remain visible while scrolling.
- Each task row should have generous vertical padding (at least 12px) to keep touch targets comfortable and the list from feeling cramped.

## Components

### Task List & Rows
- Each task row shows: completion checkbox, title, priority indicator, due date (if set), and quick actions (edit, delete) revealed on hover/focus.
- Completed tasks: strikethrough title, muted text color, reduced opacity — but still legible.
- Overdue tasks: due date rendered in the Danger color with a small warning icon.

### Progress Indicator
- Positioned at the top of the task list.
- Combine a short text summary (e.g., "3 of 10 tasks complete") with a slim horizontal progress bar using the Primary/Success color.
- Should update with a smooth transition rather than an abrupt jump.

### Forms (Add / Edit Task)
- Keep the add-task form minimal by default (title + quick-add), with priority, due date, and notes available via a simple "more options" expansion or modal.
- Edit should reuse the same form layout as create, pre-filled with existing values.
- Inline validation messages should appear directly below the relevant field in the Danger color, without blocking the rest of the form.

### Sorting & Filtering Controls
- Present as a compact toolbar (dropdowns or segmented controls) above the task list, not a separate page.
- Active filters/sort should be visually indicated (e.g., filled/active button state) so users always know the current view state.

### Buttons & Actions
- One primary action per view (e.g., "Add Task") styled with the Accent color; all other actions should be secondary/ghost style to reduce visual noise.
- Destructive actions (delete) require a lightweight confirmation (e.g., inline confirm or undo toast) rather than a heavy modal.

## Motion & Feedback

- Use short, subtle transitions (150–250ms ease) for state changes: completing a task, expanding the edit form, applying a filter.
- Avoid large or bouncy animations; motion should feel quiet and functional, not playful.
- Provide non-blocking feedback (e.g., toast/snackbar) for background actions like save, delete, and undo.

## Responsiveness

- The layout must adapt gracefully from mobile to desktop; the single-column task list pattern scales naturally.
- On small screens, collapse secondary task metadata (notes preview, created date) and quick actions behind a tap-to-expand or menu affordance.
- Ensure touch targets (checkboxes, buttons) are at least 44x44px on mobile.

## Accessibility

- Maintain a minimum contrast ratio of 4.5:1 for text against its background.
- All interactive elements must have visible focus states using the Accent color.
- Icons conveying status (priority, overdue) must be paired with text or an accessible label, not color alone.
- Forms must have properly associated labels for all inputs.
