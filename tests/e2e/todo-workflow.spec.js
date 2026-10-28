const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Core task workflow', () => {
  test('adds, completes, and deletes a task', async ({ page }) => {
    const todo = new TodoPage(page);
    const taskTitle = `E2E Task ${Date.now()}`;

    await todo.goto();

    await todo.addTask(taskTitle);
    await expect(todo.taskRow(taskTitle)).toBeVisible();

    await todo.toggleComplete(taskTitle);
    await expect(todo.taskRow(taskTitle)).toHaveClass(/task-row-completed/);

    await todo.deleteTask(taskTitle);
    await expect(todo.taskRow(taskTitle)).toHaveCount(0);
  });
});
