import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

import FilterToolbar from './components/FilterToolbar';
import ProgressBar from './components/ProgressBar';
import TaskForm from './components/TaskForm';
import TaskRow from './components/TaskRow';
import { useTaskFilters } from './hooks/useTaskFilters';
import { filterTasks, sortTasks } from './utils/taskUtils';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { filters, updateFilter } = useTaskFilters();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setTasks(result);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks: ' + err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (newTask) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to add task');
      }

      const result = await response.json();
      setTasks((prev) => [result, ...prev]);
      setError(null);
    } catch (err) {
      setError('Error adding task: ' + err.message);
      console.error('Error adding task:', err);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to update task');
      }

      const result = await response.json();
      setTasks((prev) => prev.map((task) => (task.id === id ? result : task)));
      setError(null);
    } catch (err) {
      setError('Error updating task: ' + err.message);
      console.error('Error updating task:', err);
    }
  };

  const handleToggleComplete = (id, completed) => updateTask(id, { completed });
  const handleEdit = (id, updates) => updateTask(id, updates);

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      setError(null);
    } catch (err) {
      setError('Error deleting task: ' + err.message);
      console.error('Error deleting task:', err);
    }
  };

  const visibleTasks = useMemo(() => {
    const filtered = filterTasks(tasks, filters);
    return sortTasks(filtered, filters.sortBy);
  }, [tasks, filters]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>To Do</h1>
        <p>Keep track of your tasks</p>
      </header>

      <main>
        <section className="add-task-section">
          <TaskForm onSubmit={handleCreate} submitLabel="Add Task" />
        </section>

        <section className="task-list-section">
          <ProgressBar tasks={tasks} />
          <FilterToolbar filters={filters} onChange={updateFilter} />

          {loading && <p>Loading tasks...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && (
            <ul className="task-list">
              {visibleTasks.length > 0 ? (
                visibleTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <p className="empty-state">No tasks match the current filters.</p>
              )}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
