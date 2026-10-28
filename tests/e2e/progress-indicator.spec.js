const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Progress indicator', () => {
  test('updates the completed-task summary as tasks change state', async ({ page }) => {
    const todo = new TodoPage(page);
    const taskTitle = `Progress Task ${Date.now()}`;

    await todo.goto();
    await todo.addTask(taskTitle);

    const summaryBefore = await todo.progressSummary.textContent();

    await todo.toggleComplete(taskTitle);

    await expect(async () => {
      const summaryAfter = await todo.progressSummary.textContent();
      expect(summaryAfter).not.toBe(summaryBefore);
    }).toPass();
  });
});
