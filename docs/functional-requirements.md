# Functional Requirements

## Introduction

This document outlines the functional requirements for new and enhanced features of the TODO application. These requirements build on the existing baseline functionality (add task, delete task) and are intended to guide implementation across both the `packages/backend/` and `packages/frontend/` packages.

## Requirements

### 1. Mark as Complete

- Users must be able to mark an active task as complete and revert a completed task back to active.
- Completed tasks must be visually distinguished from active tasks (e.g., strikethrough, muted styling).
- Task completion state must be persisted via the backend API.
- A dedicated progress indicator must summarize completed vs. total tasks (see [Progress Indicators](#7-progress-indicators)).

### 2. Due Dates (Optional Field)

- Users must be able to optionally set a due date when creating or editing a task.
- Due date is not required; tasks without a due date must remain valid.
- Tasks with a due date in the past (and not yet completed) must be flagged as "overdue" in the UI.
- Due dates must be stored and returned by the backend in a consistent format (e.g., ISO 8601).

### 3. Edit Existing Active Task

- Users must be able to edit the title, due date, priority, and notes of an existing active task.
- Completed tasks should not be editable unless first reverted to active (clarify desired behavior during implementation).
- Edits must be validated using the same rules as task creation (see [Input Validation Rules](#8-input-validation-rules)).
- Edits must persist via the backend API and reflect immediately in the UI.

### 4. Priority Levels

- Users must be able to assign a priority level to a task: Low, Medium, or High.
- Priority must default to a sensible value (e.g., Medium) when not explicitly set.
- Priority must be visually indicated in the task list (e.g., color coding or icon).
- Priority must be a sortable and filterable field (see [Sorting & Filtering](#6-sorting--filtering-persisted-in-localstorage)).

### 5. Notes

- Users must be able to add optional free-text notes/description to a task.
- Notes must support multi-line text.
- Notes must have a maximum character limit to prevent abuse (see [Input Validation Rules](#8-input-validation-rules)).
- Notes must be editable independently of other task fields.

### 6. Sorting & Filtering (Persisted in localStorage)

- Users must be able to sort tasks by: due date, priority, creation date, or alphabetically (title).
- Users must be able to filter tasks by: completion status (all/active/completed), priority, and due date range (e.g., overdue, today, upcoming).
- The selected sort order and active filters must be persisted in the browser's `localStorage` so they are restored on page reload.
- Sorting and filtering must operate on the client side against the currently loaded task list.

### 7. Progress Indicators

- The app must display a clear summary of progress at the top of the task list (e.g., "3 of 10 tasks complete").
- A visual progress indicator (e.g., progress bar or percentage) must be shown alongside the summary text.
- The progress indicator must update in real time as tasks are completed, added, or deleted.

### 8. Input Validation Rules

- Task title is required and must not be empty or whitespace-only.
- Task title must have a maximum length (e.g., 100 characters).
- Notes must have a maximum length (e.g., 500 characters).
- Due date, if provided, must be a valid date.
- Priority, if provided, must be one of the allowed values: Low, Medium, High.
- Validation errors must be clearly communicated to the user in the UI.
- Validation must be enforced on both frontend (immediate feedback) and backend (data integrity).
