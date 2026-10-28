import { validateTaskInput } from '../utils/validation';

describe('validateTaskInput', () => {
  it('passes for a valid task', () => {
    const { valid, errors } = validateTaskInput({ title: 'Buy milk', priority: 'Low' });
    expect(valid).toBe(true);
    expect(errors).toEqual({});
  });

  it('requires a title', () => {
    const { valid, errors } = validateTaskInput({ title: '' });
    expect(valid).toBe(false);
    expect(errors.title).toBe('Title is required');
  });

  it('rejects an invalid priority', () => {
    const { valid, errors } = validateTaskInput({ title: 'Task', priority: 'Urgent' });
    expect(valid).toBe(false);
    expect(errors.priority).toBeDefined();
  });

  it('rejects an invalid due date', () => {
    const { valid, errors } = validateTaskInput({ title: 'Task', dueDate: 'not-a-date' });
    expect(valid).toBe(false);
    expect(errors.dueDate).toBeDefined();
  });
});
