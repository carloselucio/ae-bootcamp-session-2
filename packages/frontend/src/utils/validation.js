import { PRIORITY_LEVELS, TITLE_MAX_LENGTH, NOTES_MAX_LENGTH } from '../constants';

/**
 * Validates task input fields on the client for immediate feedback.
 * Mirrors packages/backend/src/validation.js so both layers agree.
 *
 * @param {{ title?: string, notes?: string, dueDate?: string, priority?: string }} input
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateTaskInput({ title, notes, dueDate, priority } = {}) {
  const errors = {};

  if (!title || title.trim() === '') {
    errors.title = 'Title is required';
  } else if (title.trim().length > TITLE_MAX_LENGTH) {
    errors.title = `Title must be ${TITLE_MAX_LENGTH} characters or fewer`;
  }

  if (notes && notes.length > NOTES_MAX_LENGTH) {
    errors.notes = `Notes must be ${NOTES_MAX_LENGTH} characters or fewer`;
  }

  if (dueDate) {
    const parsed = new Date(dueDate);
    if (Number.isNaN(parsed.getTime())) {
      errors.dueDate = 'Due date must be a valid date';
    }
  }

  if (priority && !PRIORITY_LEVELS.includes(priority)) {
    errors.priority = `Priority must be one of: ${PRIORITY_LEVELS.join(', ')}`;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
