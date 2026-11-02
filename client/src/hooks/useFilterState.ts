import { useState, useCallback, useEffect } from 'react';
import { MAX_FILTER_VALUES, type FilterState } from '../types';

export function useFilterState() {
  const [filters, setFilters] = useState<FilterState>(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      search: params.get('search') || '',
      selectedHobbies: params.getAll('hobby'),
      selectedNationalities: params.getAll('nationality'),
      sortField: (params.get('sortField') || 'first_name') as FilterState['sortField'],
      sortDirection: (params.get('sortDirection') || 'asc') as FilterState['sortDirection'],
    };
  });

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    filters.selectedHobbies.forEach(h => params.append('hobby', h));
    filters.selectedNationalities.forEach(n => params.append('nationality', n));
    params.set('sortField', filters.sortField);
    params.set('sortDirection', filters.sortDirection);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [filters]);

  const updateSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
  }, []);

  const toggleHobby = useCallback((hobby: string) => {
    setFilters(prev => ({
      ...prev,
      selectedHobbies: prev.selectedHobbies.includes(hobby)
        ? prev.selectedHobbies.filter(h => h !== hobby)
        : prev.selectedHobbies.length < MAX_FILTER_VALUES
          ? [...prev.selectedHobbies, hobby]
          : prev.selectedHobbies,
    }));
  }, []);

  const toggleNationality = useCallback((nationality: string) => {
    setFilters(prev => ({
      ...prev,
      selectedNationalities: prev.selectedNationalities.includes(nationality)
        ? prev.selectedNationalities.filter(n => n !== nationality)
        : prev.selectedNationalities.length < MAX_FILTER_VALUES
          ? [...prev.selectedNationalities, nationality]
          : prev.selectedNationalities,
    }));
  }, []);

  const setSortField = useCallback((field: FilterState['sortField']) => {
    setFilters(prev => ({ ...prev, sortField: field }));
  }, []);

  const setSortDirection = useCallback((direction: FilterState['sortDirection']) => {
    setFilters(prev => ({ ...prev, sortDirection: direction }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      search: '',
      selectedHobbies: [],
      selectedNationalities: [],
      sortField: 'first_name',
      sortDirection: 'asc',
    });
  }, []);

  return {
    filters,
    updateSearch,
    toggleHobby,
    toggleNationality,
    setSortField,
    setSortDirection,
    clearAllFilters,
  };
}
