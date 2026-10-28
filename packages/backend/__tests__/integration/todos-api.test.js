const request = require('supertest');
const { app, db } = require('../../src/app');

afterAll(() => {
  if (db) {
    db.close();
  }
});

const createTask = async (overrides = {}) => {
  const response = await request(app)
    .post('/api/tasks')
    .send({ title: 'Temp Task', ...overrides })
    .set('Accept', 'application/json');

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('id');
  return response.body;
};

describe('Tasks API', () => {
  describe('GET /api/tasks', () => {
    it('returns all tasks with the expected shape', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const task = response.body[0];
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('priority');
      expect(task).toHaveProperty('completed');
      expect(task).toHaveProperty('dueDate');
      expect(task).toHaveProperty('notes');
    });
  });

  describe('POST /api/tasks', () => {
    it('creates a task with defaults applied', async () => {
      const task = await createTask({ title: 'Write docs' });

      expect(task.title).toBe('Write docs');
      expect(task.priority).toBe('Medium');
      expect(task.completed).toBe(false);
    });

    it('creates a task with all fields set', async () => {
      const task = await createTask({
        title: 'Ship feature',
        notes: 'Remember to update the changelog',
        dueDate: '2026-12-31',
        priority: 'High',
      });

      expect(task.notes).toBe('Remember to update the changelog');
      expect(task.dueDate).toBe('2026-12-31');
      expect(task.priority).toBe('High');
    });

    it('returns 400 when title is missing', async () => {
      const response = await request(app).post('/api/tasks').send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('returns 400 for an invalid priority', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Bad priority task', priority: 'Urgent' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveProperty('priority');
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('toggles task completion', async () => {
      const task = await createTask({ title: 'Toggle me' });

      const response = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .send({ completed: true });

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(true);
    });

    it('edits title, priority, dueDate, and notes', async () => {
      const task = await createTask({ title: 'Original title' });

      const response = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .send({ title: 'Updated title', priority: 'Low', dueDate: '2026-11-01', notes: 'New notes' });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated title');
      expect(response.body.priority).toBe('Low');
      expect(response.body.dueDate).toBe('2026-11-01');
      expect(response.body.notes).toBe('New notes');
    });

    it('returns 400 for invalid edit input', async () => {
      const task = await createTask({ title: 'Needs valid edit' });

      const response = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .send({ title: '' });

      expect(response.status).toBe(400);
    });

    it('returns 404 when task does not exist', async () => {
      const response = await request(app).patch('/api/tasks/999999').send({ completed: true });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('deletes an existing task', async () => {
      const task = await createTask({ title: 'Delete me' });

      const deleteResponse = await request(app).delete(`/api/tasks/${task.id}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toEqual({ message: 'Task deleted successfully', id: task.id });

      const deleteAgain = await request(app).delete(`/api/tasks/${task.id}`);
      expect(deleteAgain.status).toBe(404);
    });

    it('returns 400 for an invalid id', async () => {
      const response = await request(app).delete('/api/tasks/abc');
      expect(response.status).toBe(400);
    });
  });
});
