const request = require('supertest');
const { app, db } = require('../src/app');

// Close the database connection after all tests
afterAll(() => {
  if (db) {
    db.close();
  }
});

// Test helpers
const createTask = async (overrides = {}) => {
  const response = await request(app)
    .post('/api/tasks')
    .send({ title: 'Temp Task', ...overrides })
    .set('Accept', 'application/json');

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('id');
  return response.body;
};

describe('API Endpoints', () => {
  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Check if tasks have the expected structure
      const task = response.body[0];
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('notes');
      expect(task).toHaveProperty('priority');
      expect(task).toHaveProperty('dueDate');
      expect(task).toHaveProperty('completed');
      expect(task).toHaveProperty('createdAt');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with default priority', async () => {
      const newTask = { title: 'Test Task' };
      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newTask.title);
      expect(response.body.priority).toBe('Medium');
      expect(response.body.completed).toBe(false);
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should create a task with all fields set', async () => {
      const task = await createTask({
        title: 'Full Task',
        notes: 'Some notes',
        dueDate: '2026-12-31',
        priority: 'High',
      });

      expect(task.notes).toBe('Some notes');
      expect(task.dueDate).toBe('2026-12-31');
      expect(task.priority).toBe('High');
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({})
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if title is empty', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for an invalid priority', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Bad priority', priority: 'Urgent' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveProperty('priority');
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('should toggle task completion', async () => {
      const task = await createTask({ title: 'Toggle me' });

      const response = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .send({ completed: true });

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(true);
    });

    it('should edit title, priority, dueDate, and notes', async () => {
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

    it('should return 400 for invalid edit input', async () => {
      const task = await createTask({ title: 'Needs valid edit' });

      const response = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .send({ title: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 when task does not exist', async () => {
      const response = await request(app).patch('/api/tasks/999999').send({ completed: true });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app).patch('/api/tasks/abc').send({ completed: true });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Valid task ID is required');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task', async () => {
      const task = await createTask({ title: 'Task To Be Deleted' });

      const deleteResponse = await request(app).delete(`/api/tasks/${task.id}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toEqual({ message: 'Task deleted successfully', id: task.id });

      const deleteAgain = await request(app).delete(`/api/tasks/${task.id}`);
      expect(deleteAgain.status).toBe(404);
      expect(deleteAgain.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 404 when task does not exist', async () => {
      const response = await request(app).delete('/api/tasks/999999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app).delete('/api/tasks/abc');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Valid task ID is required');
    });
  });
});
