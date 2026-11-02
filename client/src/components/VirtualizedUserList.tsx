import type { User, UsersError } from '../types';
import { UserCard } from './UserCard';
import { FixedSizeList } from 'react-window';
import { useEffect, useRef, useState } from 'react';

interface VirtualizedUserListProps {
  queryKey: string;
  users: User[];
  total: number;
  loading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  error: UsersError | null;
  onRetry: () => void;
  onResetFilters: () => void;
}

const ITEM_HEIGHT = 140;

export function VirtualizedUserList({
  queryKey,
  users,
  total,
  loading,
  isRefreshing,
  isLoadingMore,
  hasMore,
  onLoadMore,
  error,
  onRetry,
  onResetFilters,
}: VirtualizedUserListProps) {
  const listRef = useRef<FixedSizeList>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(() =>
    Math.max(window.innerHeight - 300, ITEM_HEIGHT)
  );

  useEffect(() => {
    const container = listContainerRef.current;
    if (!container) return;

    const updateHeight = () => {
      const height = container.getBoundingClientRect().height;
      if (height > 0) setListHeight(height);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo(0);
  }, [queryKey]);

  const handleScroll = ({
    scrollOffset,
    scrollUpdateWasRequested,
  }: {
    scrollOffset: number;
    scrollUpdateWasRequested: boolean;
  }) => {
    const nearListEnd = scrollOffset + listHeight >= users.length * ITEM_HEIGHT - 5 * ITEM_HEIGHT;
    if (
      !scrollUpdateWasRequested
      && scrollOffset > 0
      && !isLoadingMore
      && hasMore
      && nearListEnd
    ) {
      onLoadMore();
    }
  };

  const errorMessage = error === 'invalid_filters'
    ? 'One or more filter values are invalid. Reset your filters to continue.'
    : error === 'connection'
      ? "Couldn't connect to the user service. Check that the API is running, then try again."
      : error === 'service'
        ? "The user service couldn't complete your request. Please try again."
        : null;

  if (error && users.length === 0) {
    return (
      <div role="alert" className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">
            {error === 'invalid_filters' ? 'Invalid filters' : 'Unable to load users'}
          </p>
          <p className="text-gray-600 text-sm">{errorMessage}</p>
          <button
            type="button"
            onClick={error === 'invalid_filters' ? onResetFilters : onRetry}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {error === 'invalid_filters' ? 'Reset filters' : 'Try again'}
          </button>
        </div>
      </div>
    );
  }

  if (!loading && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-500 font-semibold mb-2">No users found</p>
          <p className="text-gray-400 text-sm">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {error && (
        <div role="alert" className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm">
          <span className="text-red-700">{errorMessage}</span>
          <button
            type="button"
            onClick={error === 'invalid_filters' ? onResetFilters : onRetry}
            className="font-medium text-red-700 underline hover:text-red-900"
          >
            {error === 'invalid_filters' ? 'Reset filters' : 'Try again'}
          </button>
        </div>
      )}
      <div className="mb-3 flex-none text-sm text-gray-600">
        Showing {users.length} of {total} users
        {isRefreshing && <span className="ml-2 text-blue-600">• Updating results...</span>}
        {!isRefreshing && (loading || isLoadingMore) && (
          <span className="ml-2 text-blue-600">• Loading...</span>
        )}
      </div>

      <div
        ref={listContainerRef}
        aria-busy={isRefreshing}
        className={`flex-1 min-h-0 transition-opacity duration-200 ${
          isRefreshing ? 'opacity-50' : 'opacity-100'
        }`}
      >
        {users.length > 0 && listHeight > 0 && (
          <FixedSizeList
            ref={listRef}
            height={listHeight}
            itemCount={users.length}
            itemSize={ITEM_HEIGHT}
            width="100%"
            onScroll={handleScroll}
          >
            {({ index, style }) => (
              <div style={style} className="pr-2 pb-3">
                <UserCard user={users[index]} />
              </div>
            )}
          </FixedSizeList>
        )}
      </div>

      {loading && users.length === 0 && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3" />
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      )}
    </div>
  );
}
