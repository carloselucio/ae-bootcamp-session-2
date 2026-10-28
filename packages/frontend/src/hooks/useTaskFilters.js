import { useCallback, useEffect, useState } from 'react';

import { FILTERS_STORAGE_KEY } from '../constants';

const DEFAULT_FILTERS = {
  status: 'all',
  priority: 'all',
  dueDateRange: 'all',
  sortBy: 'createdAt',
};

function loadPersistedFilters() {
  try {
    const raw = window.localStorage.getItem(FILTERS_STORAGE_KEY);
    if (!raw) return DEFAULT_FILTERS;
    return { ...DEFAULT_FILTERS, ...JSON.parse(raw) };
  } catch (error) {
    console.error('Failed to read persisted filters:', error);
    return DEFAULT_FILTERS;
  }
}

/**
 * Manages sort/filter state for the task list, persisting selections to
 * localStorage so they're restored on reload.
 */
export function useTaskFilters() {
  const [filters, setFilters] = useState(loadPersistedFilters);

  useEffect(() => {
    try {
      window.localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error('Failed to persist filters:', error);
    }
  }, [filters]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  return { filters, updateFilter };
}
