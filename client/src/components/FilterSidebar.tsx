import { MAX_FILTER_VALUES, type FilterCounts } from '../types';
import { getHobbyIcon } from '../utils/hobbyIcons';

interface FilterSidebarProps {
  hobbies: FilterCounts[];
  nationalities: FilterCounts[];
  selectedHobbies: string[];
  selectedNationalities: string[];
  onHobbyToggle: (hobby: string) => void;
  onNationalityToggle: (nationality: string) => void;
  onClearAll: () => void;
}

export function FilterSidebar({
  hobbies,
  nationalities,
  selectedHobbies,
  selectedNationalities,
  onHobbyToggle,
  onNationalityToggle,
  onClearAll,
}: FilterSidebarProps) {
  const hasActiveFilters = selectedHobbies.length > 0 || selectedNationalities.length > 0;

  return (
    <aside className="w-full max-h-[35%] md:max-h-none md:w-64 md:flex-none bg-white rounded-lg shadow-sm border border-gray-200 p-6 overflow-y-auto md:sticky md:left-0 md:top-0 md:h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            type="button"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Nationalities */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">
          Nationalities <span className="font-normal normal-case">({selectedNationalities.length}/{MAX_FILTER_VALUES})</span>
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {nationalities.length > 0 ? (
            nationalities.map(item => (
              <label key={item.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedNationalities.includes(item.value)}
                  disabled={!selectedNationalities.includes(item.value) && selectedNationalities.length >= MAX_FILTER_VALUES}
                  onChange={() => onNationalityToggle(item.value)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1 truncate">
                  {item.value}
                </span>
                <span className="text-xs text-gray-500 flex-shrink-0">({item.count})</span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500">No nationalities available</p>
          )}
        </div>
      </div>

      {/* Hobbies */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">
          Hobbies <span className="font-normal normal-case">({selectedHobbies.length}/{MAX_FILTER_VALUES})</span>
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {hobbies.length > 0 ? (
            hobbies.map(item => (
              <label key={item.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedHobbies.includes(item.value)}
                  disabled={!selectedHobbies.includes(item.value) && selectedHobbies.length >= MAX_FILTER_VALUES}
                  onChange={() => onHobbyToggle(item.value)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">
                  {getHobbyIcon(item.value)} {item.value}
                </span>
                <span className="text-xs text-gray-500 flex-shrink-0">({item.count})</span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500">No hobbies available</p>
          )}
        </div>
      </div>
    </aside>
  );
}
