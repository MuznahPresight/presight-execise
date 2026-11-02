import { useFilterState, useUsers } from './hooks';
import { SearchBar, SortControls, FilterSidebar, VirtualizedUserList } from './components';

export default function App() {
  const {
    filters,
    updateSearch,
    toggleHobby,
    toggleNationality,
    setSortField,
    setSortDirection,
    clearAllFilters,
  } = useFilterState();

  const {
    data,
    loading,
    error,
    retry,
    hasMore,
    loadMore,
    isLoadingMore,
    isRefreshing,
  } = useUsers(filters);
  const queryKey = JSON.stringify(filters);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="flex-none bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">User Explorer</h1>
            <p className="text-sm text-gray-600 mt-1">Browse and filter users by nationality and hobbies</p>
          </div>
          <div className="bg-white">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-1">
                <SearchBar value={filters.search} onChange={updateSearch} />
              </div>
              <SortControls
                sortField={filters.sortField}
                sortDirection={filters.sortDirection}
                onSortFieldChange={setSortField}
                onSortDirectionChange={setSortDirection}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-1 min-h-0 w-full max-w-7xl mx-auto flex-col px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-1 min-h-0 flex-col md:flex-row gap-6">
          <FilterSidebar
            hobbies={data?.hobbies || []}
            nationalities={data?.nationalities || []}
            selectedHobbies={filters.selectedHobbies}
            selectedNationalities={filters.selectedNationalities}
            onHobbyToggle={toggleHobby}
            onNationalityToggle={toggleNationality}
            onClearAll={clearAllFilters}
          />

          <div className="flex flex-1 min-h-0 flex-col">
            <VirtualizedUserList
              queryKey={queryKey}
              users={data?.items || []}
              total={data?.total || 0}
              loading={loading}
              isRefreshing={isRefreshing}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              onLoadMore={loadMore}
              error={error}
              onRetry={retry}
              onResetFilters={clearAllFilters}
            />
          </div>
        </div>
      </main>
    </div>
  );
}