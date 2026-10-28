# Coding Guidelines

## Introduction

This document describes the coding style and quality principles for the TODO application. It applies to both the `packages/frontend/` (React) and `packages/backend/` (Express) packages. The goal is consistent, readable, and maintainable code that is easy for both humans and Copilot to extend safely.

## General Principles

- **Readability over cleverness**: Prefer clear, explicit code over compact but obscure one-liners. Code is read far more often than it is written.
- **DRY (Don't Repeat Yourself)**: Extract shared logic (validation rules, formatting helpers, API request helpers) into reusable functions/modules rather than duplicating it across components or routes. A small amount of duplication is acceptable if abstracting it too early would add unnecessary indirection.
- **Single Responsibility**: Keep functions and components focused on one concern. If a function needs a "and" in its description, consider splitting it.
- **Fail fast, fail clearly**: Validate inputs early and return/throw clear errors rather than letting invalid data propagate silently.
- **YAGNI**: Don't build configurability or abstractions for requirements that don't exist yet. Build for the current functional requirements, not speculative future ones.

## Formatting

- Use consistent indentation (2 spaces) and let the linter/formatter enforce style rather than manual judgment calls.
- Keep lines reasonably short (~100 chars) to keep diffs and reviews easy to read.
- Always use semicolons and consistent quote style (single quotes for JS/JSX strings) to match the existing codebase.
- Use trailing commas in multiline object/array literals to keep diffs minimal when adding new entries.
- Prefer `const` by default, `let` only when reassignment is needed, and avoid `var` entirely.

## Import Organization

- Group imports in this order, separated by a blank line:
  1. External/third-party packages (e.g., `react`, `express`, `supertest`)
  2. Internal modules/absolute imports (shared utils, services)
  3. Relative imports (`./`, `../`)
- Avoid deep relative paths (`../../../..`) where possible — favor a flatter package structure instead.
- Only import what you use; remove unused imports before committing (the linter should catch these).
- Avoid default-exporting anonymous objects/functions when a named export better communicates intent, especially for shared utilities.

## Linting & Static Analysis

- ESLint is the source of truth for style and common error patterns — run it locally (and via CI) before considering a change complete.
- Do not disable lint rules inline (`eslint-disable`) without a clear comment explaining why; treat this as an exception, not a habit.
- Fix lint warnings as part of the change that introduces them rather than letting them accumulate.
- Keep configuration (`.eslintrc`, formatter config) centralized at the appropriate package or repo root level rather than duplicating per-file overrides.

## Naming Conventions

- Use descriptive, intention-revealing names: `isOverdue`, `filterByPriority`, `toggleTaskComplete` rather than abbreviations like `flg` or `tmp`.
- React components: `PascalCase` (e.g., `TaskRow.js`), hooks: `camelCase` prefixed with `use` (e.g., `useTaskFilters`).
- Backend route/handler files and functions: `camelCase`, named after the resource/action they handle (e.g., `tasksRouter`, `validateTaskInput`).
- Constants that are truly fixed (enum-like values such as priority levels) should be declared once in a shared location and reused, not re-typed as string literals throughout the codebase.

## Functions & Components

- Keep functions small and composable; extract helper functions when a function grows past a single clear responsibility.
- Prefer pure functions for logic that doesn't need side effects (validation, sorting, filtering) so they're trivially unit-testable.
- In React, prefer function components with hooks over class components, and keep components focused on presentation — move business logic (validation, sorting/filtering, persistence) into separate utility modules or custom hooks.
- Co-locate related logic (e.g., a component and its styles) but keep cross-cutting logic (API client, validation rules) in shared modules used by both frontend and backend where applicable.

## Error Handling

- Backend: validate input at the API boundary and return consistent error response shapes (e.g., `{ error: string }`) with appropriate HTTP status codes.
- Frontend: surface validation and API errors inline near the relevant field/action (per [UI Guidelines](./ui-guidelines.md)), not just via console logs.
- Never silently swallow errors (empty `catch` blocks); at minimum log them, and surface user-facing errors where relevant.

## Comments & Documentation

- Write code that's self-explanatory through naming first; use comments to explain *why*, not *what*, when the reasoning isn't obvious from the code itself.
- Keep comments up to date — remove or update stale comments when the code they describe changes.
- Avoid large commented-out code blocks; rely on git history instead.

## Consistency with Project Docs

- Follow the [Functional Requirements](./functional-requirements.md) for feature behavior, the [UI Guidelines](./ui-guidelines.md) for presentation, and the [Testing Guidelines](./testing-guidelines.md) for test coverage expectations when implementing or reviewing changes.
- When in doubt between two reasonable approaches, prefer the one that is more consistent with existing patterns already used elsewhere in the codebase.
