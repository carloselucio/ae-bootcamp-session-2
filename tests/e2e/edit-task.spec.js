const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Editing a task', () => {
  test('updates title, priority, and due date of an active task', async ({ page }) => {
    const todo = new TodoPage(page);
    const originalTitle = `Editable Task ${Date.now()}`;
    const updatedTitle = `${originalTitle} (updated)`;

    await todo.goto();
    await todo.addTask(originalTitle);
    await expect(todo.taskRow(originalTitle)).toBeVisible();

    await todo.startEditing(originalTitle);
    const editForm = page.locator('.task-row-editing');
    await editForm.locator('input[type="text"]').fill(updatedTitle);
    await editForm.getByRole('button', { name: 'Save' }).click();

    await expect(todo.taskRow(updatedTitle)).toBeVisible();
  });
});
