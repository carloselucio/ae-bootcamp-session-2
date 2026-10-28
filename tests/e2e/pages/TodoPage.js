/**
 * Page Object Model for the TODO app's single-page task list UI.
 */
class TodoPage {
  constructor(page) {
    this.page = page;
    this.titleInput = page.getByPlaceholder('What needs to be done?');
    this.addButton = page.getByRole('button', { name: 'Add Task' });
    this.moreOptionsButton = page.getByRole('button', { name: /more options/i });
    this.prioritySelect = page.locator('.task-form select').first();
    this.dueDateInput = page.locator('.task-form input[type="date"]');
    this.notesTextarea = page.locator('.task-form textarea');
    this.taskList = page.locator('.task-list');
    this.statusFilter = page.locator('.filter-control', { hasText: 'Status' }).locator('select');
    this.priorityFilter = page.locator('.filter-control', { hasText: 'Priority' }).locator('select');
    this.sortBySelect = page.locator('.filter-control', { hasText: 'Sort by' }).locator('select');
    this.progressSummary = page.locator('.progress-summary');
  }

  async goto() {
    await this.page.goto('/');
  }

  taskRow(title) {
    return this.page.locator('.task-row', { hasText: title });
  }

  async addTask(title) {
    await this.titleInput.fill(title);
    await this.addButton.click();
  }

  async toggleComplete(title) {
    await this.taskRow(title).locator('input[type="checkbox"]').click();
  }

  async deleteTask(title) {
    await this.taskRow(title).getByRole('button', { name: 'Delete' }).click();
  }

  async startEditing(title) {
    await this.taskRow(title).getByRole('button', { name: 'Edit' }).click();
  }
}

module.exports = { TodoPage };
