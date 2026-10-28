const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

const { validateTaskInput, DEFAULT_PRIORITY } = require('./validation');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    notes TEXT,
    priority TEXT NOT NULL DEFAULT 'Medium',
    due_date TEXT,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert some initial data
const insertStmt = db.prepare(`
  INSERT INTO tasks (title, notes, priority, due_date, completed)
  VALUES (@title, @notes, @priority, @dueDate, @completed)
`);

const initialTasks = [
  { title: 'Write project proposal', notes: null, priority: 'High', dueDate: null, completed: 0 },
  { title: 'Review pull requests', notes: null, priority: 'Medium', dueDate: null, completed: 0 },
  { title: 'Plan team lunch', notes: null, priority: 'Low', dueDate: null, completed: 1 },
];

initialTasks.forEach((task) => insertStmt.run(task));

console.log('In-memory database initialized with sample data');

const getTaskStmt = db.prepare('SELECT * FROM tasks WHERE id = ?');

const serializeTask = (row) => ({
  id: row.id,
  title: row.title,
  notes: row.notes,
  priority: row.priority,
  dueDate: row.due_date,
  completed: Boolean(row.completed),
  createdAt: row.created_at,
});

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend server is running' });
});

// API Routes
app.get('/api/tasks', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
    res.json(rows.map(serializeTask));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', (req, res) => {
  try {
    const { title, notes, dueDate, priority } = req.body;
    const { valid, errors } = validateTaskInput({ title, notes, dueDate, priority });

    if (!valid) {
      return res.status(400).json({ error: Object.values(errors)[0], errors });
    }

    const result = insertStmt.run({
      title: title.trim(),
      notes: notes ? notes.trim() : null,
      priority: priority || DEFAULT_PRIORITY,
      dueDate: dueDate || null,
      completed: 0,
    });

    const newTask = getTaskStmt.get(result.lastInsertRowid);
    res.status(201).json(serializeTask(newTask));
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.patch('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(parseInt(id, 10))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = getTaskStmt.get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { title, notes, dueDate, priority, completed } = req.body;
    const { valid, errors } = validateTaskInput({ title, notes, dueDate, priority }, { partial: true });

    if (!valid) {
      return res.status(400).json({ error: Object.values(errors)[0], errors });
    }

    const updated = {
      title: title !== undefined ? title.trim() : existingTask.title,
      notes: notes !== undefined ? (notes ? notes.trim() : null) : existingTask.notes,
      priority: priority !== undefined ? priority : existingTask.priority,
      due_date: dueDate !== undefined ? (dueDate || null) : existingTask.due_date,
      completed:
        completed !== undefined ? (completed ? 1 : 0) : existingTask.completed,
    };

    db.prepare(
      'UPDATE tasks SET title = @title, notes = @notes, priority = @priority, due_date = @due_date, completed = @completed WHERE id = @id'
    ).run({ ...updated, id });

    const updatedTask = getTaskStmt.get(id);
    res.json(serializeTask(updatedTask));
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(parseInt(id, 10))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = getTaskStmt.get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    res.json({ message: 'Task deleted successfully', id: parseInt(id, 10) });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = { app, db, insertStmt };