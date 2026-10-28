// Shared task-related constants, mirrored from packages/backend/src/validation.js
// so frontend validation/UX stays in sync with backend rules.

export const PRIORITY_LEVELS = ['Low', 'Medium', 'High'];
export const DEFAULT_PRIORITY = 'Medium';
export const TITLE_MAX_LENGTH = 100;
export const NOTES_MAX_LENGTH = 500;

export const SORT_OPTIONS = [
  { value: 'dueDate', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
  { value: 'createdAt', label: 'Created date' },
  { value: 'title', label: 'Title (A-Z)' },
];

export const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export const DUE_DATE_FILTERS = [
  { value: 'all', label: 'Any time' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Today' },
  { value: 'upcoming', label: 'Upcoming' },
];

export const FILTERS_STORAGE_KEY = 'todo-app:filters';
