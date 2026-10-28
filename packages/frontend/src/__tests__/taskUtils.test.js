import { filterTasks, getProgressStats, isDueToday, isOverdue, sortTasks } from '../utils/taskUtils';

const makeTask = (overrides = {}) => ({
  id: 1,
  title: 'Task',
  notes: null,
  priority: 'Medium',
  dueDate: null,
  completed: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('isOverdue', () => {
  it('returns true for a past due date that is not completed', () => {
    expect(isOverdue(makeTask({ dueDate: '2020-01-01' }))).toBe(true);
  });

  it('returns false when the task is completed', () => {
    expect(isOverdue(makeTask({ dueDate: '2020-01-01', completed: true }))).toBe(false);
  });

  it('returns false when there is no due date', () => {
    expect(isOverdue(makeTask())).toBe(false);
  });
});

describe('isDueToday', () => {
  it('returns true when due date is today', () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(isDueToday(makeTask({ dueDate: today }))).toBe(true);
  });

  it('returns false when there is no due date', () => {
    expect(isDueToday(makeTask())).toBe(false);
  });
});

describe('filterTasks', () => {
  const tasks = [
    makeTask({ id: 1, completed: false, priority: 'High' }),
    makeTask({ id: 2, completed: true, priority: 'Low' }),
  ];

  it('filters by status', () => {
    expect(filterTasks(tasks, { status: 'active' }).map((t) => t.id)).toEqual([1]);
    expect(filterTasks(tasks, { status: 'completed' }).map((t) => t.id)).toEqual([2]);
  });

  it('filters by priority', () => {
    expect(filterTasks(tasks, { priority: 'High' }).map((t) => t.id)).toEqual([1]);
  });

  it('returns all tasks when filters are "all"', () => {
    expect(filterTasks(tasks, { status: 'all', priority: 'all' })).toHaveLength(2);
  });
});

describe('sortTasks', () => {
  it('sorts by priority (High before Medium before Low)', () => {
    const tasks = [makeTask({ id: 1, priority: 'Low' }), makeTask({ id: 2, priority: 'High' })];
    expect(sortTasks(tasks, 'priority').map((t) => t.id)).toEqual([2, 1]);
  });

  it('sorts by title alphabetically', () => {
    const tasks = [makeTask({ id: 1, title: 'Banana' }), makeTask({ id: 2, title: 'Apple' })];
    expect(sortTasks(tasks, 'title').map((t) => t.id)).toEqual([2, 1]);
  });

  it('places tasks without a due date last when sorting by due date', () => {
    const tasks = [makeTask({ id: 1, dueDate: null }), makeTask({ id: 2, dueDate: '2026-01-01' })];
    expect(sortTasks(tasks, 'dueDate').map((t) => t.id)).toEqual([2, 1]);
  });
});

describe('getProgressStats', () => {
  it('computes completed/total/percent', () => {
    const tasks = [makeTask({ completed: true }), makeTask({ completed: false })];
    expect(getProgressStats(tasks)).toEqual({ total: 2, completed: 1, percent: 50 });
  });

  it('returns 0 percent for an empty list', () => {
    expect(getProgressStats([])).toEqual({ total: 0, completed: 0, percent: 0 });
  });
});
