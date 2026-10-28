const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Input validation', () => {
  test('shows an inline error when submitting an empty title', async ({ page }) => {
    const todo = new TodoPage(page);

    await todo.goto();
    await todo.addButton.click();

    await expect(page.getByText('Title is required')).toBeVisible();
  });
});
