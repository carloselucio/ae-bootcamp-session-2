import React from 'react';

import { DUE_DATE_FILTERS, PRIORITY_LEVELS, SORT_OPTIONS, STATUS_FILTERS } from '../constants';

function FilterToolbar({ filters, onChange }) {
  return (
    <div className="filter-toolbar">
      <label className="filter-control">
        <span>Status</span>
        <select
          value={filters.status}
          onChange={(e) => onChange('status', e.target.value)}
        >
          {STATUS_FILTERS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-control">
        <span>Priority</span>
        <select
          value={filters.priority}
          onChange={(e) => onChange('priority', e.target.value)}
        >
          <option value="all">All</option>
          {PRIORITY_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-control">
        <span>Due</span>
        <select
          value={filters.dueDateRange}
          onChange={(e) => onChange('dueDateRange', e.target.value)}
        >
          {DUE_DATE_FILTERS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-control">
        <span>Sort by</span>
        <select
          value={filters.sortBy}
          onChange={(e) => onChange('sortBy', e.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default FilterToolbar;
