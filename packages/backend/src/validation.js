// Shared validation rules and constants for task input.
// Mirrors packages/frontend/src/constants.js so both layers enforce the same rules.

const PRIORITY_LEVELS = ['Low', 'Medium', 'High'];
const DEFAULT_PRIORITY = 'Medium';
const TITLE_MAX_LENGTH = 100;
const NOTES_MAX_LENGTH = 500;

/**
 * Validates task input fields. Supports partial validation (for edits/patches)
 * where only the fields present on `input` are checked.
 *
 * @param {object} input - Candidate task fields: title, notes, dueDate, priority.
 * @param {object} [options]
 * @param {boolean} [options.partial=false] - If true, title is only validated when present.
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
function validateTaskInput(input = {}, { partial = false } = {}) {
  const errors = {};
  const { title, notes, dueDate, priority } = input;

  const titleProvided = title !== undefined;
  if (!partial || titleProvided) {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      errors.title = 'Title is required';
    } else if (title.trim().length > TITLE_MAX_LENGTH) {
      errors.title = `Title must be ${TITLE_MAX_LENGTH} characters or fewer`;
    }
  }

  if (notes !== undefined && notes !== null) {
    if (typeof notes !== 'string') {
      errors.notes = 'Notes must be text';
    } else if (notes.length > NOTES_MAX_LENGTH) {
      errors.notes = `Notes must be ${NOTES_MAX_LENGTH} characters or fewer`;
    }
  }

  if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
    const parsed = new Date(dueDate);
    if (Number.isNaN(parsed.getTime())) {
      errors.dueDate = 'Due date must be a valid date';
    }
  }

  if (priority !== undefined && priority !== null && priority !== '') {
    if (!PRIORITY_LEVELS.includes(priority)) {
      errors.priority = `Priority must be one of: ${PRIORITY_LEVELS.join(', ')}`;
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

module.exports = {
  PRIORITY_LEVELS,
  DEFAULT_PRIORITY,
  TITLE_MAX_LENGTH,
  NOTES_MAX_LENGTH,
  validateTaskInput,
};
