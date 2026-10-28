const PRIORITY_WEIGHT = { High: 0, Medium: 1, Low: 2 };

/**
 * Returns true when the task has a due date in the past and is not completed.
 */
export function isOverdue(task) {
  if (!task.dueDate || task.completed) {
    return false;
  }
  const due = new Date(task.dueDate);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return due < startOfToday;
}

/**
 * Returns true when the task's due date falls on today's calendar date.
 */
export function isDueToday(task) {
  if (!task.dueDate) return false;
  const due = new Date(task.dueDate);
  const today = new Date();
  return (
    due.getFullYear() === today.getFullYear() &&
    due.getMonth() === today.getMonth() &&
    due.getDate() === today.getDate()
  );
}

/**
 * Filters tasks by completion status, priority, and due date range.
 *
 * @param {Array} tasks
 * @param {{ status: string, priority: string, dueDateRange: string }} filters
 */
export function filterTasks(tasks, { status = 'all', priority = 'all', dueDateRange = 'all' } = {}) {
  return tasks.filter((task) => {
    if (status === 'active' && task.completed) return false;
    if (status === 'completed' && !task.completed) return false;

    if (priority !== 'all' && task.priority !== priority) return false;

    if (dueDateRange === 'overdue' && !isOverdue(task)) return false;
    if (dueDateRange === 'today' && !isDueToday(task)) return false;
    if (dueDateRange === 'upcoming') {
      if (!task.dueDate) return false;
      const due = new Date(task.dueDate);
      const startOfTomorrow = new Date();
      startOfTomorrow.setHours(0, 0, 0, 0);
      startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
      if (due < startOfTomorrow) return false;
    }

    return true;
  });
}

/**
 * Sorts tasks by the given field. Returns a new array; does not mutate input.
 *
 * @param {Array} tasks
 * @param {'dueDate'|'priority'|'createdAt'|'title'} sortBy
 */
export function sortTasks(tasks, sortBy = 'createdAt') {
  const sorted = [...tasks];

  sorted.sort((a, b) => {
    switch (sortBy) {
      case 'dueDate': {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      case 'priority':
        return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
      case 'title':
        return a.title.localeCompare(b.title);
      case 'createdAt':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return sorted;
}

/**
 * Computes progress summary stats for a list of tasks.
 */
export function getProgressStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, percent };
}
