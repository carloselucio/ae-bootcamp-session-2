# Testing Guidelines

## Introduction

This document defines the testing principles and conventions for the TODO application. The goal is "just enough" testing: solid confidence in critical behavior (validation, persistence, core workflows) without over-testing simple, low-risk code. Favor a small number of meaningful tests over exhaustive coverage of every edge case.

## Testing Pyramid

- **Unit tests**: Most of the test suite. Fast, isolated, cover logic-heavy pieces (validation rules, sorting/filtering helpers, reducers, utility functions) and individual React components.
- **Integration tests**: A focused set covering backend API endpoints end-to-end (request → response), especially around the new features (tasks CRUD, completion, priority, due dates).
- **E2E tests**: A small, curated set (5–8) covering critical user journeys only. Not a substitute for unit/integration coverage.

Prioritize testing new/changed behavior from the functional requirements (completion, due dates, editing, priority, notes, sorting/filtering, validation) over re-testing framework or library behavior.

## Unit Tests

- Use **Jest** to test individual functions and React components in isolation.
- Naming convention: `*.test.js` or `*.test.ts`.
- Location:
  - Backend: `packages/backend/__tests__/`
  - Frontend: `packages/frontend/src/__tests__/`
- Name test files to match what they're testing (e.g., `app.test.js` for `app.js`).
- Focus on:
  - Input validation logic (title/notes length, due date format, priority enum).
  - Sorting/filtering logic and localStorage persistence helpers.
  - Component rendering and interaction for stateful UI (task row, progress indicator, forms).
- Skip unit tests for trivial pass-through code (e.g., simple presentational components with no logic) — not every file needs a dedicated test.

## Integration Tests

- Use **Jest + Supertest** to test backend API endpoints with real HTTP requests.
- Naming convention: `*.test.js` or `*.test.ts`.
- Location: `packages/backend/__tests__/integration/`.
- Name files intelligently based on what they test (e.g., `todos-api.test.js` for TODO API endpoints).
- Cover the primary request/response contract for each endpoint (success path + key validation error paths), not every possible input combination.
- Each test must set up and clean up its own data; do not depend on ordering or state from other tests.

## End-to-End (E2E) Tests

- Use **Playwright** (required framework) to test complete UI workflows through browser automation.
- Location: `tests/e2e/`.
- Naming convention: `*.spec.js` or `*.spec.ts`.
- Name files based on the user journey they test (e.g., `todo-workflow.spec.js`).
- Must use **one browser only** (e.g., Chromium) to keep the suite fast and simple.
- Must follow the **Page Object Model (POM)** pattern for maintainability.
- Limit to **5–8 critical user journeys**, focused on happy paths and key edge cases (e.g., add/complete/edit/delete a task, filter/sort persistence, overdue indicator) — not exhaustive coverage of every requirement.

## Test Isolation & Reliability

- All tests must be **isolated and independent**: each test sets up its own data and does not rely on other tests having run first or in a specific order.
- Use setup/teardown hooks (`beforeEach`/`afterEach`, or equivalent) so tests succeed consistently across multiple runs.
- Avoid shared mutable state between tests (e.g., reset in-memory stores, clear `localStorage` between E2E tests).

## Port Configuration

- Always use environment variables with sensible defaults so CI/CD workflows can dynamically detect ports:
  - Backend: `const PORT = process.env.PORT || 3030;`
  - Frontend: React's default port is `3000`, overridable via the `PORT` environment variable.

## General Expectations

- All new features (per the [Functional Requirements](./functional-requirements.md)) should include appropriate unit and/or integration tests; add an E2E test only if the feature represents a new critical user journey.
- Tests should be readable and maintainable: prefer clear test names, arrange/act/assert structure, and minimal setup boilerplate over clever abstractions.
- Don't chase 100% coverage — prioritize correctness of validation, persistence, and core user workflows over testing every trivial branch.
