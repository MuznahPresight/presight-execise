import type { FilterState } from '../types';

interface SortControlsProps {
  sortField: FilterState['sortField'];
  sortDirection: FilterState['sortDirection'];
  onSortFieldChange: (field: FilterState['sortField']) => void;
  onSortDirectionChange: (direction: FilterState['sortDirection']) => void;
}

const sortFieldOptions = [
  { value: 'first_name', label: 'First Name' },
  { value: 'last_name', label: 'Last Name' },
  { value: 'age', label: 'Age' },
  { value: 'nationality', label: 'Nationality' },
] as const;

export function SortControls({
  sortField,
  sortDirection,
  onSortFieldChange,
  onSortDirectionChange,
}: SortControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
        <select
          value={sortField}
          onChange={e => onSortFieldChange(e.target.value as FilterState['sortField'])}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortFieldOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
        <div className="flex gap-2">
          <button
            onClick={() => onSortDirectionChange('asc')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortDirection === 'asc'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            type="button"
          >
            ↑ Asc
          </button>
          <button
            onClick={() => onSortDirectionChange('desc')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortDirection === 'desc'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            type="button"
          >
            ↓ Desc
          </button>
        </div>
      </div>
    </div>
  );
}
