const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Filtering and sorting persistence', () => {
  test('persists the selected status filter across a page reload', async ({ page }) => {
    const todo = new TodoPage(page);

    await todo.goto();
    await todo.statusFilter.selectOption('completed');
    await expect(todo.statusFilter).toHaveValue('completed');

    await page.reload();

    await expect(todo.statusFilter).toHaveValue('completed');
  });
});
