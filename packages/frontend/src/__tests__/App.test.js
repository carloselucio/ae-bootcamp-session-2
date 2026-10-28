import React, { act } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

const sampleTasks = [
  {
    id: 1,
    title: 'Test Task 1',
    notes: null,
    priority: 'High',
    dueDate: null,
    completed: false,
    createdAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'Test Task 2',
    notes: null,
    priority: 'Medium',
    dueDate: null,
    completed: true,
    createdAt: '2023-01-02T00:00:00.000Z',
  },
];

// Mock server to intercept API requests
const server = setupServer(
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(sampleTasks));
  }),

  rest.post('/api/tasks', (req, res, ctx) => {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res(ctx.status(400), ctx.json({ error: 'Title is required' }));
    }

    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        title,
        notes: null,
        priority: 'Medium',
        dueDate: null,
        completed: false,
        createdAt: new Date().toISOString(),
      })
    );
  }),

  rest.patch('/api/tasks/:id', (req, res, ctx) => {
    const { id } = req.params;
    const task = sampleTasks.find((t) => t.id === Number(id));
    return res(ctx.status(200), ctx.json({ ...task, ...req.body }));
  }),

  rest.delete('/api/tasks/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(ctx.status(200), ctx.json({ message: 'Task deleted successfully', id: Number(id) }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  test('renders the header', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('Keep track of your tasks')).toBeInTheDocument();
  });

  test('loads and displays tasks', async () => {
    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  test('shows progress summary based on loaded tasks', async () => {
    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('1 of 2 tasks complete')).toBeInTheDocument();
    });
  });

  test('adds a new task', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('What needs to be done?');
    await act(async () => {
      await user.type(input, 'New Test Task');
    });

    const submitButton = screen.getByText('Add Task');
    await act(async () => {
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('New Test Task')).toBeInTheDocument();
    });
  });

  test('toggles task completion', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const checkbox = screen.getByLabelText('Mark "Test Task 1" as complete');
    await act(async () => {
      await user.click(checkbox);
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Mark "Test Task 1" as active')).toBeInTheDocument();
    });
  });

  test('deletes a task', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    const task1Row = screen.getByText('Test Task 1').closest('li');
    const deleteButtonForTask1 = within(task1Row).getByText('Delete');
    await act(async () => {
      await user.click(deleteButtonForTask1);
    });

    await waitFor(() => {
      expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument();
    });
  });
});
