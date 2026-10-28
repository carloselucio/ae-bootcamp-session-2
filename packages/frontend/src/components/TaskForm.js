import React, { useState } from 'react';

import { DEFAULT_PRIORITY, NOTES_MAX_LENGTH, PRIORITY_LEVELS, TITLE_MAX_LENGTH } from '../constants';
import { validateTaskInput } from '../utils/validation';

const EMPTY_TASK = { title: '', notes: '', dueDate: '', priority: DEFAULT_PRIORITY };

/**
 * Reusable form for creating and editing tasks. When `initialTask` is
 * provided, the form behaves as an edit form pre-filled with existing values.
 */
function TaskForm({ initialTask, onSubmit, onCancel, submitLabel = 'Add Task' }) {
  const [task, setTask] = useState(initialTask ? { ...EMPTY_TASK, ...initialTask } : EMPTY_TASK);
  const [expanded, setExpanded] = useState(Boolean(initialTask));
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { valid, errors: validationErrors } = validateTaskInput(task);

    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSubmit(task);

    if (!initialTask) {
      setTask(EMPTY_TASK);
      setExpanded(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="task-form-row">
        <input
          type="text"
          value={task.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="What needs to be done?"
          maxLength={TITLE_MAX_LENGTH}
          aria-label="Task title"
        />
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
        {!initialTask && (
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? 'Fewer options' : 'More options'}
          </button>
        )}
      </div>
      {errors.title && <p className="field-error">{errors.title}</p>}

      {expanded && (
        <div className="task-form-details">
          <label className="field">
            <span>Priority</span>
            <select
              value={task.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
            >
              {PRIORITY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Due date</span>
            <input
              type="date"
              value={task.dueDate || ''}
              onChange={(e) => handleChange('dueDate', e.target.value)}
            />
            {errors.dueDate && <p className="field-error">{errors.dueDate}</p>}
          </label>

          <label className="field field-notes">
            <span>Notes</span>
            <textarea
              value={task.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              maxLength={NOTES_MAX_LENGTH}
              rows={3}
            />
            {errors.notes && <p className="field-error">{errors.notes}</p>}
          </label>

          {initialTask && onCancel && (
            <button type="button" className="btn-ghost" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      )}
    </form>
  );
}

export default TaskForm;
