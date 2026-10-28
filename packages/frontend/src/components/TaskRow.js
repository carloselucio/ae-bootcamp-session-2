import React, { useState } from 'react';

import TaskForm from './TaskForm';
import { isOverdue } from '../utils/taskUtils';

const PRIORITY_CLASS = { Low: 'priority-low', Medium: 'priority-medium', High: 'priority-high' };

function formatDueDate(dueDate) {
  if (!dueDate) return null;
  return new Date(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function TaskRow({ task, onToggleComplete, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const overdue = isOverdue(task);

  if (isEditing) {
    return (
      <li className="task-row task-row-editing">
        <TaskForm
          initialTask={task}
          submitLabel="Save"
          onCancel={() => setIsEditing(false)}
          onSubmit={(updatedTask) => {
            onEdit(task.id, updatedTask);
            setIsEditing(false);
          }}
        />
      </li>
    );
  }

  return (
    <li className={`task-row ${task.completed ? 'task-row-completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id, !task.completed)}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'active' : 'complete'}`}
      />

      <div className="task-row-content">
        <div className="task-row-title-line">
          <span className={`priority-dot ${PRIORITY_CLASS[task.priority]}`} title={`${task.priority} priority`} />
          <span className="task-title">{task.title}</span>
        </div>
        {(task.dueDate || task.notes) && (
          <div className="task-row-meta">
            {task.dueDate && (
              <span className={overdue ? 'due-date overdue' : 'due-date'}>
                {overdue && '⚠ '}
                {formatDueDate(task.dueDate)}
              </span>
            )}
            {task.notes && <span className="notes-preview">{task.notes}</span>}
          </div>
        )}
      </div>

      <div className="task-row-actions">
        <button type="button" className="btn-ghost" onClick={() => setIsEditing(true)} disabled={task.completed}>
          Edit
        </button>
        <button type="button" className="btn-ghost btn-danger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskRow;
