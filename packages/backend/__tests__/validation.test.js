const { validateTaskInput, PRIORITY_LEVELS, TITLE_MAX_LENGTH, NOTES_MAX_LENGTH } = require('../src/validation');

describe('validateTaskInput', () => {
  it('passes for a valid full task', () => {
    const { valid, errors } = validateTaskInput({
      title: 'Buy groceries',
      notes: 'Milk, eggs, bread',
      dueDate: '2026-12-01',
      priority: 'High',
    });

    expect(valid).toBe(true);
    expect(errors).toEqual({});
  });

  it('requires a title', () => {
    const { valid, errors } = validateTaskInput({ title: '' });

    expect(valid).toBe(false);
    expect(errors.title).toBe('Title is required');
  });

  it('rejects a whitespace-only title', () => {
    const { valid, errors } = validateTaskInput({ title: '   ' });

    expect(valid).toBe(false);
    expect(errors.title).toBe('Title is required');
  });

  it('rejects a title over the max length', () => {
    const { valid, errors } = validateTaskInput({ title: 'a'.repeat(TITLE_MAX_LENGTH + 1) });

    expect(valid).toBe(false);
    expect(errors.title).toMatch(/100 characters or fewer/);
  });

  it('rejects notes over the max length', () => {
    const { valid, errors } = validateTaskInput({
      title: 'Valid title',
      notes: 'a'.repeat(NOTES_MAX_LENGTH + 1),
    });

    expect(valid).toBe(false);
    expect(errors.notes).toMatch(/500 characters or fewer/);
  });

  it('rejects an invalid due date', () => {
    const { valid, errors } = validateTaskInput({ title: 'Valid title', dueDate: 'not-a-date' });

    expect(valid).toBe(false);
    expect(errors.dueDate).toBe('Due date must be a valid date');
  });

  it('rejects an invalid priority', () => {
    const { valid, errors } = validateTaskInput({ title: 'Valid title', priority: 'Urgent' });

    expect(valid).toBe(false);
    expect(errors.priority).toMatch(new RegExp(PRIORITY_LEVELS.join('|')));
  });

  it('only validates provided fields in partial mode', () => {
    const { valid, errors } = validateTaskInput({ notes: 'Updated notes' }, { partial: true });

    expect(valid).toBe(true);
    expect(errors).toEqual({});
  });

  it('still rejects an invalid field in partial mode when provided', () => {
    const { valid, errors } = validateTaskInput({ priority: 'Nope' }, { partial: true });

    expect(valid).toBe(false);
    expect(errors.priority).toBeDefined();
  });
});
